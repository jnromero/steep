from __future__ import print_function
import json

class monitorClass():
   def __init__(self):
      #These next two functions should be in experiment.py because they are specific to each experiment
      self.monitorTasks()
      if 'monitorTableSortColumn' not in self.data:
         self.data['monitorTableSortColumn']=0
         self.data['monitorTableSortType']=0
         self.data['monitorTableInfo']="none"#
      self.updateMonitorTableEntries()

   #Monitor Stuff
   def monitorMessage(self):
      self.updateMonitorTableEntries()
      msg={"type":"tableUpdate"}
      msg['table']=self.getMonitorTable()
      msg['serverStatus']=self.data['serverStatus']
      msg['taskTable']=self.data['monitorTasks']
      msg['dataFile']=self.config['dataFilePath']
      msg['dataFileURL']=self.config['dataFileURL']
      try:
         for client in self.monitorClients:
            client.sendMessage(json.dumps(msg).encode('utf8'))
      except Exception as thisExept: 
         print(thisExept)
         print("can't send message to monitor")


   def updateMonitorTableEntries(self):
      extra=[
         ['#'              ,'k'],
         ['subjectID'      ,'"<a href=\'javascript:void(0)\' onclick=\'refreshClient([\\\"%s\\\"]);\'>%s</a>"%(sid,sid)'],
         ['Connection'     ,'self.data[sid].connectionStatus']
      ]
      if self.data['monitorTableInfo'][0][0]=="#":
         "already Added"
      elif self.data['monitorTableInfo']=="none":
         self.data['monitorTableInfo']=extra
      else:
         self.data['monitorTableInfo']=extra+self.data['monitorTableInfo']

   def getMonitorTable(self):
      tableData={}
      tableData['subjectIDs']=self.data['subjectIDs']
      tableData['titles']=[x[0] for x in self.data['monitorTableInfo']]
      k=0
      for sid in tableData['subjectIDs']:
         k+=1
         tableData[sid]={}
         for item in self.data['monitorTableInfo']:
            string=item[0]
            value=item[1]
            try:
               exec('tableData[sid][\'%s\']=%s'%(string,value))
            except:
               exec('tableData[sid][\'%s\']="NA"'%(string))
      tableData=self.sortMonitorTable(tableData,self.data['monitorTableSortColumn'])
      return tableData

   def sortMonitorTable(self,tableData,index):
      thisTitle=tableData['titles'][index]
      toBeSorted=[]
      for sid in tableData['subjectIDs']:
         toBeSorted.append([tableData[sid][thisTitle],sid])
      if self.data['monitorTableSortType']==0:
         toBeSorted.sort()#reverse=True)
      else:
         toBeSorted.sort(reverse=True)

      tableData['subjectIDs']=[x[1] for x in toBeSorted]
      return tableData

   def sortMonitorTableMessage(self,message,client):
      if self.data['monitorTableSortColumn']==int(message['col']):
         self.data['monitorTableSortType']=1-self.data['monitorTableSortType']
      else:
         self.data['monitorTableSortType']=0
      self.data['monitorTableSortColumn']=int(message['col'])
      self.monitorMessage()

   def taskDone(self,message):
      self.data['monitorTasks'][message['index']]['status']='Done'
      self.saveData()
      self.monitorMessage()

   def monitorTasks(self):

      alreadyThere=[]
      if 'monitorTasks' in self.data:
         for k in self.data['monitorTasks']:
            if k['type'] not in alreadyThere:
               alreadyThere.append(k['type'])
      else:
         self.data['monitorTasks']=[]

      taskList=[]
      k=-1
      for task in self.monitorTaskList: 
         if task not in alreadyThere:  
            k+=1
            msg={}
            msg['type']=task
            title=""
            for l in task:
               if l.isupper():
                  title+=" "
               title+=l
            title=title.title()
            msg['title']=title
            msg['status']=''
            msg['index']=k
            self.data['monitorTasks'].append(msg)

