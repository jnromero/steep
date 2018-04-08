from __future__ import print_function,division,absolute_import   
import json
import pickle
import time
class monitorClass():
   def __init__(self):
      #This should be set in experiment.py
      #self.monitorTaskList=['loadInstructions','startQuiz','startExperiment']
      # self.data['taskList']=self.monitorTaskList
      self.monitorTasks()
      if 'monitorTableSortColumn' not in self.data:
         self.data['monitorTableSortColumn']=0
         self.data['monitorTableSortType']=0
         self.data['monitorTableInfo']=[["delete","delete"]]
      self.updateMonitorTableEntries()
   #Monitor Stuff

   def sendMessageToMonitorClients(self,msg):
      try:
         for client in self.monitorClients:
            client.sendMessage(json.dumps(msg).encode('utf8'))
      except Exception as thisExept: 
         print(thisExept)
         print("can't send message to monitor")


   #def monitorMessage(self): in mainServer.py so that it can use reactor.

   def updateMonitorTable(self):
      self.updateMonitorTableEntries()
      msg={"type":"updateMonitorTable"}
      msg['table']=self.getMonitorTable()
      msg['serverStatus']=self.data['serverStatus']
      self.sendMessageToMonitorClients(msg)
      
   def updateTaskTable(self):
      msg={"type":"updateTaskTable"}
      msg['taskList']=self.monitorTaskList
      msg['taskStatus']=self.data['taskStatus']
      msg['serverStatus']=self.data['serverStatus']
      msg['dataFile']=self.config['dataFilePath']
      msg['dataFileURL']=self.config['dataFileURL']
      msg['dataFolderURL']=self.config['dataFolderURL']
      self.sendMessageToMonitorClients(msg)

   def toggleAcceptingSwitch(self,message,client):
      self.data['serverStatus']['acceptingClients']=1-self.data['serverStatus']['acceptingClients']
      if self.data['serverStatus']['acceptingClients']==0:
         print("Done Accepting Clients!")
         print("%s Clients Connected"%(len(self.data['subjectIDs'])))
         
         #check to see if notAcceptingClientsAnymore is defined in experiment
         notAcceptingClientsAnymore = getattr(self,"notAcceptingClientsAnymore",None)
         if callable(notAcceptingClientsAnymore):
            self.notAcceptingClientsAnymore()
         else:
            self.notAcceptingClientsAnymoreDefault()
      else:
         print("Accepting Clients Now!")

      self.monitorMessage()
      self.updateTaskTable()



   def updateMonitorTableEntries(self):
      extra=[
         ['#'              ,'k'],
         ['Refresh'      ,'"<a href=\'javascript:void(0)\' onclick=\'refreshClient([\\\"%s\\\"]);\'>%s</a>"%(sid,sid)'],
         ['Connection'     ,'self.data[sid].connectionStatus']
      ]

      if self.data['monitorTableInfo'][0][0]=="#":
         "already Added"
      elif self.data['monitorTableInfo']=="none":
         self.data['monitorTableInfo']=extra
      else:
         self.data['monitorTableInfo']=extra+self.data['monitorTableInfo']

      #replace ["delete","delete"] with subject delete button
      self.data['monitorTableInfo'] = [x if x!=["delete","delete"] else ['Delete','"<a href=\'javascript:void(0)\' onclick=\'deleteClient([\\\"%s\\\"]);\'>%s</a>"%(sid,sid)'] for x in self.data['monitorTableInfo']]

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
            if len(item)>2:
               formating=item[2]
            else:
               formating="%s"
            try:
               formatString="'tableData[sid][\'formating\']=formating'".replace("formating",formating)
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
      task=message['type']
      self.data['taskStatus'][task]['status']="Done"
      self.saveData()
      self.updateTaskTable()
      self.monitorMessage()


   def taskToTitle(self,taskName):
      title=""
      for l in taskName:
         if l.isupper():
            title+=" "
         title+=l
      title=title.title()
      return title

   def monitorTasks(self):
      self.data['taskStatus']={}
      for task in self.monitorTaskList:
         self.data['taskStatus'][task]={}
         self.data['taskStatus'][task]['status']=""
         self.data['taskStatus'][task]['title']=self.taskToTitle(task)
