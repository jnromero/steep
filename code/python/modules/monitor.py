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
      self.data['taskDoneTime']=[]
      self.data['monitorTableInfo']={}
      self.clientInfoSpecificMonitorTableEntries()

   def sendMessageToMonitorClients(self,msg):
      try:
         for client in self.monitorClients:
            if client.page=="monitor":
               msg=self.getExtraMonitorPageInfo(msg,client)
               client.sendMessage(json.dumps(msg).encode('utf8'))
      except Exception as thisExept: 
         print(thisExept)
         print("can't send message to monitor, from sendMessageToMonitorClients")


   #def monitorMessage(self): in mainServer.py so that it can use reactor.


   def updateMonitorPage(self,client):
      self.updateMonitorHeader(client)
      if client.page=="monitor":
         self.updateMonitorTable()
         self.updateTaskTable()
      elif client.page=="console":
         self.lastConsoleMessageTime=time.time()-10#this ensures a page refresh
         self.consoleMessage()
      elif client.page=="serverInfo":
         self.showServerInfo(client)

   def showServerInfo(self,client):
      try:
         msg={'type':"showServerInfo"}
         msg=self.getExtraMonitorPageInfo(msg,client)
         client.sendMessage(json.dumps(msg).encode('utf8'))
      except Exception as thisExept: 
         print(thisExept)
         print("can't send message to monitor, from showServerInfo")


   def updateMonitorHeader(self,client):
      msg={"type":"updateMonitorHeader"}
      msg['currentPage']=client.page
      msg['serverStatus']=self.data['serverStatus']
      msg=self.getExtraMonitorPageInfo(msg,client)
      client.sendMessage(json.dumps(msg).encode('utf8'))

   def newMonitorTable(self):
      for client in self.monitorClients:
         client.currentMonitorTable=self.currentMonitorTable
         self.updateMonitorHeader(client)
      self.updateMonitorTable()
      self.updateTaskTable()

   def updateMonitorTable(self):
      try:
         for client in self.monitorClients:
            if client.page=="monitor":
               msg={"type":"updateMonitorTable"}
               msg['table']=self.getMonitorTable(client)
               msg['serverStatus']=self.data['serverStatus']
               msg=self.getExtraMonitorPageInfo(msg,client)
               client.sendMessage(json.dumps(msg).encode('utf8'))
      except Exception as thisExept: 
         print(thisExept)
         print("can't send message to monitor, from updateMonitorTable")
      
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
      self.finalPayoffsSpecificMonitorTableEntries()
      self.monitorMessage()
      self.updateTaskTable()



   def clientInfoSpecificMonitorTableEntries(self):
      self.currentMonitorTable="clientInfo"
      self.data['monitorTableInfo']['clientInfo']=[
         ['Refresh'      ,'"<a href=\'javascript:void(0)\' onclick=\'refreshClient([\\\"%s\\\"]);\'>%s</a>"%(sid,sid)'],
         ['Connection'     ,'self.data[sid].connectionStatus'],
         ['IP Address'     ,'self.clientsById[sid].peer'],
         ['Delete','"<a href=\'javascript:void(0)\' onclick=\'deleteClient([\\\"%s\\\"]);\'>%s</a>"%(sid,sid)']         
      ]

   def finalPayoffsSpecificMonitorTableEntries(self):
      try:
         self.currentMonitorTable="finalPayoffs"
         sid=self.data['subjectIDs'][0]
         thisTable=[]
         for k in self.data[sid].finalPayoffs:
            thisTable.append([k,"'$%%.02f'%%(self.data[sid].finalPayoffs['%s'])"%(k)])
         self.data['monitorTableInfo']['finalPayoffs']=thisTable
      except Exception,e: 
         print("can't set final payoffs monitor table",str(e))

   def getMonitorTableValue(self,sid,item):
      try:
         out=eval(item[1])
      except:
         out="NA"
      return out

   def getMonitorTable(self,client):
      thisMonitorTable=[["subjectID","sid"]]+self.data['monitorTableInfo'][client.currentMonitorTable]
      tableData={}
      tableData['subjectIDs']=self.data['subjectIDs']
      tableData['connected']={}
      for sid in self.data['subjectIDs']:
         tableData['connected'][sid]=self.data[sid].connectionStatus
      tableData['titles']=[x[0] for x in thisMonitorTable]
      k=0
      for sid in tableData['subjectIDs']:
         k+=1
         tableData[sid]={}
         for item in thisMonitorTable:
            string=item[0]
            tableData[sid][string]=self.getMonitorTableValue(sid,item)

      tableData=self.sortMonitorTable(tableData,client.monitorTableSortColumn)
      return tableData

   def sortMonitorTable(self,tableData,sortColumns):
      toBeSorted=[]
      for sid in tableData['subjectIDs']:
         thisList=[sid]
         for c in sortColumns:
            index=c[0]
            sortTyep=c[1]
            table=c[2]
            item=self.data['monitorTableInfo'][table][index-1]
            if index==0:
               thisList.append(sid)
            else:
               thisList.append(self.getMonitorTableValue(sid,item))
         toBeSorted.append(thisList)
      index=0
      for c in sortColumns:
         index+=1
         if c[1]=="reg":
            toBeSorted.sort(key=lambda x: x[index])#reverse=True)
         else:
            toBeSorted.sort(key=lambda x: x[index],reverse=True)
         tableData['subjectIDs']=[x[0] for x in toBeSorted]
      return tableData

   def sortMonitorTableMessage(self,message,client):
      if client.monitorTableSortColumn[-1][0]==int(message['col']) and client.monitorTableSortColumn[-1][2]==client.currentMonitorTable:
         if client.monitorTableSortColumn[-1][1]=="rev":
            client.monitorTableSortColumn[-1][1]="reg"
         elif client.monitorTableSortColumn[-1][1]=="reg":
            client.monitorTableSortColumn[-1][1]="rev"
      else:
         client.monitorTableSortColumn.append([int(message['col']),"reg",client.currentMonitorTable])
         client.monitorTableSortColumn=client.monitorTableSortColumn[1:]
      self.monitorMessage()

   def changeMonitorTable(self,message,client):
      client.currentMonitorTable=message["table"]
      client.page="monitor"
      self.updateMonitorPage(client)

   def changeMonitorPage(self,message,client):
      client.page=message["page"]
      self.updateMonitorPage(client)

   def changeConsoleTab(self,message,client):
      if message["tab"]=="first":
         client.consoleTab=1
      elif message["tab"]=="next":
         client.consoleTab+=1
         client.consoleTab=min(client.consoleTab,self.logCounter.fileCount)
      elif message["tab"]=="previous":
         client.consoleTab-=1
         client.consoleTab=max(client.consoleTab,1)
      elif message["tab"]=="last":
         client.consoleTab=self.logCounter.fileCount
      client.page="console"
      self.updateMonitorPage(client)


   def getExtraMonitorPageInfo(self,msg,client):
      msg['consoleTabs']=[client.consoleTab,self.logCounter.fileCount]
      msg['monitorTables']=[x for x in self.data['monitorTableInfo']]
      msg['currentMonitorTable']=client.currentMonitorTable
      return msg

   def taskDone(self,message):
      task=message['type']
      self.data['taskDoneTime'].append([task,time.time()])
      self.data['taskStatus'][task]['status']="Done"
      self.saveData()
      self.newMonitorTable()


   def taskDoneMany(self,message):
      task=message['type']
      self.data['taskDoneTime'].append([task,time.time()])
      self.data['taskStatus'][task]['status']=""
      self.saveData()
      self.newMonitorTable()



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
