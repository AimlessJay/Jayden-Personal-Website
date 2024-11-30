# Author: Prof. MM Ghassemi <ghassem3@msu.edu>

#--------------------------------------------------
# Import Requirements
#--------------------------------------------------
import os
from flask import Flask
from flask_failsafe import failsafe


#--------------------------------------------------
# Create a Failsafe Web Application
#--------------------------------------------------
@failsafe
def create_app():
	app = Flask(__name__)
	app.secret_key = 'yteETT67uedv90SJbd830lksb7sbvBGG9ksbijb09uobYhJKKnl2C2UsY83H93geu'
	
	from .utils.database.database import database
	db = database()
	db.createTables(purge=True)

	with app.app_context():
		from . import routes
		return app
