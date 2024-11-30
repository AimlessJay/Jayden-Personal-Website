# Author: Prof. MM Ghassemi <ghassem3@msu.edu>
from flask import current_app as app
from flask import render_template, redirect, request
from .utils.database.database  import database
from werkzeug.datastructures import ImmutableMultiDict
from pprint import pprint
import json
import random
db = database()

@app.route('/')
def root():
	return redirect('/home')

@app.route('/home')
def home():
	x     = random.choice(['My mode of transportation is rollerblading.','I enjoy thrillseeking.','I have wrote music.'])
	return render_template('home.html', fun_fact = x)

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

