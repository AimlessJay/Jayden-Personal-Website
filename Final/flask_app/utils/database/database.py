import mysql.connector
import glob
import json
import csv
from io import StringIO
import itertools
import hashlib
import os
import cryptography
from cryptography.fernet import Fernet
from math import pow

class database:

    def __init__(self, purge = False):

        # Grab information from the configuration file
        self.database       = 'db'
        self.host           = '127.0.0.1'
        self.user           = 'master'
        self.port           = 3306
        self.password       = 'master'
        self.tables         = ['institutions', 'positions', 'experiences', 'skills','feedback', 'users']
        
        # NEW IN HW 3-----------------------------------------------------------------
        self.encryption     =  {   'oneway': {'salt' : b'averysaltysailortookalongwalkoffashortbridge',
                                                 'n' : int(pow(2,5)),
                                                 'r' : 9,
                                                 'p' : 1
                                             },
                                'reversible': { 'key' : '7pK_fnSKIjZKuv_Gwc--sZEMKn2zc8VvD6zS96XcNHE='}
                                }
        #-----------------------------------------------------------------------------

    def query(self, query = "SELECT * FROM users", parameters = None):

        cnx = mysql.connector.connect(host     = self.host,
                                      user     = self.user,
                                      password = self.password,
                                      port     = self.port,
                                      database = self.database,
                                      charset  = 'latin1'
                                     )


        if parameters is not None:
            cur = cnx.cursor(dictionary=True)
            cur.execute(query, parameters)
        else:
            cur = cnx.cursor(dictionary=True)
            cur.execute(query)

        # Fetch one result
        row = cur.fetchall()
        cnx.commit()

        if "INSERT" in query:
            cur.execute("SELECT LAST_INSERT_ID()")
            row = cur.fetchall()
            cnx.commit()
        cur.close()
        cnx.close()
        return row

    def createTables(self, purge=False, data_path = 'flask_app/database/'):
        ''' FILL ME IN WITH CODE THAT CREATES YOUR DATABASE TABLES.'''

        #should be in order or creation - this matters if you are using forign keys.
         
        if purge:
            for table in self.tables[::-1]:
                self.query(f"""DROP TABLE IF EXISTS {table}""")
            
        # Execute all SQL queries in the /database/create_tables directory.
        for table in self.tables:
            
            #Create each table using the .sql file in /database/create_tables directory.
            with open(data_path + f"create_tables/{table}.sql") as read_file:
                create_statement = read_file.read()
            self.query(create_statement)

            # Import the initial data
            try:
                params = []
                with open(data_path + f"initial_data/{table}.csv") as read_file:
                    scsv = read_file.read()            
                for row in csv.reader(StringIO(scsv), delimiter=','):
                    params.append(row)
            
                # Insert the data
                cols = params[0]; params = params[1:] 
                self.insertRows(table = table,  columns = cols, parameters = params)
            except:
                print('no initial data')

    def insertRows(self, table='table', columns=['x','y'], parameters=[['v11','v12'],['v21','v22']]):
        
        # Check if there are multiple rows present in the parameters
        has_multiple_rows = any(isinstance(el, list) for el in parameters)
        keys, values      = ','.join(columns), ','.join(['%s' for x in columns])
        
        # Construct the query we will execute to insert the row(s)
        query = f"""INSERT IGNORE INTO {table} ({keys}) VALUES """
        if has_multiple_rows:
            for p in parameters:
                query += f"""({values}),"""
            query     = query[:-1] 
            parameters = list(itertools.chain(*parameters))
        else:
            query += f"""({values}) """                      
        
        insert_id = self.query(query,parameters)[0]['LAST_INSERT_ID()']         
        return insert_id
    

    def getFeedData(self):
        out = {}
        feedback = self.query("SELECT * FROM feedback")
        for feed in feedback:
            comment_id = feed["comment_id"]
            out[comment_id] = feed
            out[comment_id].pop("comment_id")
        return out

    # def getSignData(self):
    # out = {}
    # signup = self.query("SELECT * FROM users")
    # for sign in signup:
    #     comment_id = sign["comment_id"]
    #     out[comment_id] = feed
    #     out[comment_id].pop("comment_id")
    # return out

    def getResumeData(self):
        ret = {}
        insts = self.query("SELECT * FROM institutions")
        for inst in insts:
            inst_id = inst["inst_id"]
            ret[inst_id] = inst
            ret[inst_id].pop("inst_id")
            ret[inst_id]["positions"]={}
            pos = self.query(f"SELECT * FROM positions WHERE inst_id = {inst_id}")
            for po in pos:
                pos_id = po["position_id"]
                ret[inst_id]["positions"][pos_id] = po
                ret[inst_id]["positions"][pos_id].pop("inst_id")
                ret[inst_id]["positions"][pos_id].pop("position_id")
                ret[inst_id]["positions"][pos_id]["experiences"] = {}
                xps = self.query(f"SELECT * FROM experiences WHERE position_id = {pos_id}")
                for xp in xps:
                    xp_id = xp["xp_id"]
                    ret[inst_id]["positions"][pos_id]["experiences"][xp_id] = xp
                    ret[inst_id]["positions"][pos_id]["experiences"][xp_id].pop("xp_id")
                    ret[inst_id]["positions"][pos_id]["experiences"][xp_id].pop("position_id")
                    ret[inst_id]["positions"][pos_id]["experiences"][xp_id]["skills"] = {}
                    skills = self.query(f"SELECT * FROM skills WHERE xp_id = {xp_id}")
                    for skill in skills:
                        skill_id = skill["skill_id"]
                        ret[inst_id]["positions"][pos_id]["experiences"][xp_id]["skills"][skill_id] = skill
                        ret[inst_id]["positions"][pos_id]["experiences"][xp_id]["skills"][skill_id].pop("xp_id")
                        ret[inst_id]["positions"][pos_id]["experiences"][xp_id]["skills"][skill_id].pop("skill_id")
                        #ret[xp_id]["skills"] = {}
                        #skills = self.query(f"SELECT * skills WHERE experiences_id = {xp_id}")
        print(ret)
        return ret


#######################################################################################
# AUTHENTICATION RELATED
#######################################################################################
    def createUser(self, email='me@email.com', password='password', role='user'):
        userCol = ['email', 'password', 'role']
        encPass = self.onewayEncrypt(password)
        userParam = [[email, encPass, role]]

        query = """SELECT * FROM users;"""
        results = self.query(query)

        emails = set()

        for row in results:
            emails.add(row['email'])

        if(email not in emails):
            self.insertRows('users', userCol, userParam)
            return {'success': 1, 'reason': "User Created"}
        else:
            return {'success': 0, 'reason': "User Alredy Exists"}

    def authenticate(self, email='me@email.com', password='password'):
        failCnt = 0
        # password = self.onewayEncrypt(password)
        parameters = [email, self.onewayEncrypt(password)]
        check = f"""SELECT COUNT(*) as success FROM users WHERE email=%s AND password=%s"""
        users = self.query(check,parameters)
        query = """SELECT * FROM users;"""
        results = self.query(query)
        print(results)
        print(check)
        print(users[0])
        return users[0]
        # for user in users:
        #     loggedPass = user["password"]
        #     if(loggedPass == password):
        #         failCnt = 0
        #         print({'success': 1, 'reason': "Authenticated"})
        #         return {'success': 1, 'reason': "Authenticated"}
        #     else:
        #         failCnt += 1
        #         print(failCnt)
        #         return {'success': 0, 'reason': "Authentication Failed"}
                

    def onewayEncrypt(self, string):
        encrypted_string = hashlib.scrypt(string.encode('utf-8'),
                                          salt = self.encryption['oneway']['salt'],
                                          n    = self.encryption['oneway']['n'],
                                          r    = self.encryption['oneway']['r'],
                                          p    = self.encryption['oneway']['p']
                                          ).hex()
        return encrypted_string


    def reversibleEncrypt(self, type, message):
        fernet = Fernet(self.encryption['reversible']['key'])
        
        if type == 'encrypt':
            message = fernet.encrypt(message.encode())
        elif type == 'decrypt':
            message = fernet.decrypt(message).decode()

        return message


