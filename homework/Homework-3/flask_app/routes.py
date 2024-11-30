# Author: Prof. MM Ghassemi <ghassem3@msu.edu>
from flask import current_app as app
from flask import render_template, redirect, request, session, url_for, copy_current_request_context
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect
from .utils.database.database  import database
from werkzeug.datastructures   import ImmutableMultiDict
from pprint import pprint
import json
import random
import functools
from . import socketio
db = database()


#######################################################################################
# AUTHENTICATION RELATED
#######################################################################################
def login_required(func):
    @functools.wraps(func)
    def secure_function(*args, **kwargs):
        if "email" not in session:
            return redirect(url_for("login", next=request.url))
        return func(*args, **kwargs)
    return secure_function

def getUser():
	return db.reversibleEncrypt('decrypt', session['email']) if 'email' in session else 'Unknown'

@app.route('/login')
def login():
    return render_template('login.html', user = getUser())

@app.route('/logout')
def logout():
	session.pop('email', default=None)
	return redirect('/home')

@app.route('/processlogin', methods = ["POST","GET"])
def processlogin():
	form_fields = dict((key, request.form.getlist(key)[0]) for key in list(request.form.keys()))
	status = db.authenticate(email = form_fields['email'], password = form_fields['password'])
	print(form_fields)
	session['email'] = db.reversibleEncrypt('encrypt', form_fields['email'])
	return json.dumps(status)

	

	# if (db.authenticate(form_fields['email', form_fields['password']])):
	# 	session['email'] = form_fields['email']
	# 	return json.dumps({'success':1}, status)
	# else:
	# 	return json.dumps({'success':0}, status)


#######################################################################################
# CHATROOM RELATED
#######################################################################################
@app.route('/chat')
@login_required
def chat():
    return render_template('chat.html', user=getUser())

@socketio.on('joined', namespace='/chat')
def joined(message):
	user = getUser()

	join_room('main')
	if user == 'owner@email.com':
		emit('status', {'msg': getUser() + ' has entered the room.', 'style': 'width: 100%;color:rgb(247, 255, 91);text-align: right'}, room='main')
	else:
		emit('status', {'msg': getUser() + ' has entered the room.', 'style': 'width: 100%;color:azure;text-align: left'}, room='main')

@socketio.on('text', namespace='/chat')
def sent(message):
	user = getUser()
	print(user)
	if user == 'owner@email.com':
		emit('message', {'msg': message['msg'], 'style': 'width: 100%;color:rgb(247, 255, 91);text-align: right'}, room='main')
	else:
		emit('message', {'msg': message['msg'], 'style': 'width: 100%;color:azure;text-align: left'}, room='main')

@socketio.on('left', namespace='/chat')
def left(message):
	user = getUser()

	leave_room('main')
	if user == 'owner@email.com':
		emit('status', {'msg': getUser() + ' has left the room.', 'style': 'width: 100%;color:rgb(247, 255, 91);text-align: right'}, room='main')
	else:
		emit('status', {'msg': getUser() + ' has left the room.', 'style': 'width: 100%;color:azure;text-align: left'}, room='main')


#######################################################################################
# OTHER
#######################################################################################
@app.route('/')
def root():
	return redirect('/home')

@app.route('/home')
def home():
	print(db.query('SELECT * FROM users'))
	x = random.choice(['My mode of transportation is rollerblading.','I enjoy thrillseeking.','I have wrote music.'])
	return render_template('home.html', user=getUser(), fun_fact = x)

@app.route("/static/<path:path>")
def static_dir(path):
    return send_from_directory("static", path)

@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r

@app.route('/resume')
def resume():
	resume_data = db.getResumeData()
	pprint(resume_data)
	return render_template('resume.html', resume_data = resume_data)

@app.route('/projects')
def projects():
	return render_template('projects.html')

@app.route('/piano')
def piano():
	return render_template('piano.html')


@app.route('/getFeedback',methods = ['POST'])
def getFeedback(): 
	if request.method == 'POST':
		feedback_data = request.form.to_dict()
		db.insertRows("feedback",feedback_data.keys(),[list(feedback_data.values())])
		feedback = db.getFeedData()
		print(feedback)
		return render_template('feedback.html', feedback = feedback)
