import mysql.connector
import glob
import json
import csv
from io import StringIO
import itertools
import datetime
class database:

    def __init__(self, purge = False):

        # Grab information from the configuration file
        self.database       = 'db'
        self.host           = '127.0.0.1'
        self.user           = 'master'
        self.port           = 3306
        self.password       = 'master'

    def query(self, query = "SELECT CURDATE()", parameters = None):

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

    def about(self, nested=False):    
        query = """select concat(col.table_schema, '.', col.table_name) as 'table',
                          col.column_name                               as column_name,
                          col.column_key                                as is_key,
                          col.column_comment                            as column_comment,
                          kcu.referenced_column_name                    as fk_column_name,
                          kcu.referenced_table_name                     as fk_table_name
                    from information_schema.columns col
                    join information_schema.tables tab on col.table_schema = tab.table_schema and col.table_name = tab.table_name
                    left join information_schema.key_column_usage kcu on col.table_schema = kcu.table_schema
                                                                     and col.table_name = kcu.table_name
                                                                     and col.column_name = kcu.column_name
                                                                     and kcu.referenced_table_schema is not null
                    where col.table_schema not in('information_schema','sys', 'mysql', 'performance_schema')
                                              and tab.table_type = 'BASE TABLE'
                    order by col.table_schema, col.table_name, col.ordinal_position;"""
        results = self.query(query)
        if nested == False:
            return results

        table_info = {}
        for row in results:
            table_info[row['table']] = {} if table_info.get(row['table']) is None else table_info[row['table']]
            table_info[row['table']][row['column_name']] = {} if table_info.get(row['table']).get(row['column_name']) is None else table_info[row['table']][row['column_name']]
            table_info[row['table']][row['column_name']]['column_comment']     = row['column_comment']
            table_info[row['table']][row['column_name']]['fk_column_name']     = row['fk_column_name']
            table_info[row['table']][row['column_name']]['fk_table_name']      = row['fk_table_name']
            table_info[row['table']][row['column_name']]['is_key']             = row['is_key']
            table_info[row['table']][row['column_name']]['table']              = row['table']
        return table_info



    def createTables(self, purge=False, data_path = 'flask_app/database/'):
        #print('I create and populate database tables.')
        xp = 'experiance'
        feed = 'feedback'
        inst = 'institutions'
        pos = 'positions'
        skill = 'skills'
        tables = [inst, pos, xp, skill, feed]
        sql = '.sql'
        csvs = '.csv'
        create = 'create_tables/'
        init_data = 'initial_data/'

        for table in tables:
            with open(f"{data_path}{create}{table}{sql}",'r') as f1:
                sqlread = f1.read()
                self.query(sqlread)
            if table == feed:
                continue
            with open(f"{data_path}{init_data}{table}{csvs}",'r') as f2:
                rows = []
                for row in csv.reader(f2):
                    rows.append(row)
                self.insertRows(table,rows[0],rows[1:])  
                
        


        


    def insertRows(self, table='table', columns=['x','y'], parameters=[['v11','v12'],['v21','v22']]):
        #print('I insert things into the database.')
        keys = ','.join(columns)
        multi_row = any(isinstance(elem, list)for elem in parameters)
        values = ','.join(['%s' for num in columns])
        if multi_row:
            query = f"INSERT IGNORE INTO {table} ({keys}) VALUES "
            for param in parameters:
                query += f"({values}),"
            query = query[:-1]
            parameters = list(itertools.chain(*parameters))
        else:
            query = f"INSERT IGNORE INTO {table} ({keys}) VALUES "
            query += f"({values})"

            #param.join(',')
            #query += f"({param}), "
        print (table)
        out = self.query(query,parameters)
        return out

    def getFeedData(self):
        out = {}
        feedback = self.query("SELECT * FROM feedback")
        for feed in feedback:
            comment_id = feed["comment_id"]
            out[comment_id] = feed
            out[comment_id].pop("comment_id")
        return out

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
                ret[inst_id]["positions"][pos_id]["experiance"] = {}
                xps = self.query(f"SELECT * FROM experiance WHERE position_id = {pos_id}")
                for xp in xps:
                    xp_id = xp["xp_id"]
                    ret[inst_id]["positions"][pos_id]["experiance"][xp_id] = xp
                    ret[inst_id]["positions"][pos_id]["experiance"][xp_id].pop("xp_id")
                    ret[inst_id]["positions"][pos_id]["experiance"][xp_id].pop("position_id")
                    ret[inst_id]["positions"][pos_id]["experiance"][xp_id]["skills"] = {}
                    skills = self.query(f"SELECT * FROM skills WHERE xp_id = {xp_id}")
                    for skill in skills:
                        skill_id = skill["skill_id"]
                        ret[inst_id]["positions"][pos_id]["experiance"][xp_id]["skills"][skill_id] = skill
                        ret[inst_id]["positions"][pos_id]["experiance"][xp_id]["skills"][skill_id].pop("xp_id")
                        ret[inst_id]["positions"][pos_id]["experiance"][xp_id]["skills"][skill_id].pop("skill_id")
                        #ret[xp_id]["skills"] = {}
                        #skills = self.query(f"SELECT * skills WHERE experiance_id = {xp_id}")
        print(ret)
        return ret
        