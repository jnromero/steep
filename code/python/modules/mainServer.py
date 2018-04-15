from __future__ import print_function,division,absolute_import   
import pickle
import string
import random
import time
import json
import copy
from twisted.internet import reactor
from twisted.internet import task
import sys
import os
#compatibility for python 2 and and 3
if sys.version_info >= (3,0):
   import urllib.parse as theURLparse
else:
   import urlparse as theURLparse


class SteepMainServer():
   def __init__(self):
      self.setPreliminaries()
      self.lastConsoleMessageTime=time.time()
      self.nextConsoleCall=0
      self.lastMonitorMessageSent=time.time()
      self.nextMonitorCall=0
   def setPreliminaries(self):
      #All Clients 
      self.clients=[]
      self.videoClients=[]
      self.monitorClients=[]
      self.consoleClients=[]
      self.clientsById={}
      if self.options.restart=="False":
         #store all data here
         self.data={}
         self.data['config']=self.config
         self.data['subjectIDs']=[]
         self.data['sessionTimeStamp']=self.config['serverStartString']
         self.data['timer']=[0,0,0]


         self.data['serverStatus']={}
         self.data['serverStatus']['page']="none"
         self.data['serverStatus']['status']="none"
         self.data['serverStatus']['acceptingClients']=1
         self.data['serverStatus']['instructions']={}
         self.data['serverStatus']['instructions']['loaded']=0
         self.data['serverStatus']['instructions']['started']=0
         self.data['serverStatus']['instructions']['playing']=0
         self.data['serverStatus']['instructions']['time']=0
         self.data['serverStatus']['instructions']['finished']=0


      else:
         file = open(self.config['dataFilePath'],'rb')
         self.data=pickle.load(file)
         file.close() 
         print("Data file reloaded! %s"%(self.config['dataFilePath']))
      #save the data to the file every 10 seconds
      self.savingCall = task.LoopingCall(self.saveData)
      self.savingCall.start(10)

      #Send wake up message to client every 2 minutes to avoid timeout
      self.wakingCall = task.LoopingCall(self.wakeUp)
      self.wakingCall.start(120,now=False)#now=false doesn't run now, but starts after 120 seconds

   def blank(self):
      pass
   def saveData(self):
      with open(self.config['dataFilePath'],'wb') as f:
         #protocol for python 3 compatibility
         pickle.dump(self.data,f,protocol=2)
         
   def wakeUp(self):
      msg={}
      msg['type']='wakeUp'
      return self.messageToId(msg,"all","send")


   def notAcceptingClientsAnymoreDefault(self):
      print("define function notAcceptingClientsAnymore in experiments.py to perform matching after this button has been pressed.")


   def generateRandomString(self,size=8):
      chars=string.ascii_uppercase + string.digits
      return ''.join(random.choice(chars) for _ in range(size))



   def getViewTypeAndSubjectID(self,message):
      fullURL=message['url']['href']
      pathName=message['url']['pathname']
      queryParameters=theURLparse.parse_qs(message['url']['search'][1:])#1: to eliminate ?
      urlParamsToAdd={}
      #always generate new subjectID in demo
      if self.config['serverType']=="demoExperiment":
         if "subjectID" in queryParameters:
            del queryParameters['subjectID']

      if pathName.split("/")[-1]=="video.html":
         viewType="video"
         subjectID="video"
      elif pathName.split("/")[-1]=="monitor.html":
         viewType="monitor"
         subjectID="monitor"
      elif pathName.split("/")[-1]=="console.html":
         viewType="console"
         subjectID="console"
      elif pathName.split("/")[-1]=="tester.html":
         viewType="tester"
         subjectID="tester"
      elif pathName.split("/")[-1]=="client.html":
         viewType="regular"
         for k in range(1,1000):
            subjectID="subject%s"%(k)
            if subjectID not in self.data['subjectIDs']:
               break
      else:
         viewType="unknown"
         subjectID="unknown"

      if "subjectID" in queryParameters:#always generate new subjectID for demo
         subjectID=queryParameters["subjectID"][0]
      else:
         urlParamsToAdd["subjectID"]=subjectID
      if "viewType" in queryParameters:
         viewType=queryParameters["viewType"][0]
      else:
         urlParamsToAdd["viewType"]=viewType
      return [subjectID,viewType,urlParamsToAdd,queryParameters]

   def setURLParameters(self,params,sid="all",output="send"):
      for k in params:
         self.data[sid].queryParameters[k]=[params[k]]

      queryString="?"
      queryString+="%s=%s"%("subjectID",self.data[sid].queryParameters["subjectID"][0])
      queryString+="&%s=%s"%("viewType",self.data[sid].queryParameters["viewType"][0])

      for k in self.data[sid].queryParameters:
         if k!="subjectID" and k!="viewType":
            queryString+="&%s=%s"%(k,self.data[sid].queryParameters[k][0])
      msg={}
      msg['type']='setQueryString'
      msg['queryString']=queryString
      return self.messageToId(msg,sid,output)



   def newConnection(self,message,client):
      [subjectID,viewType,urlParamsToAdd,queryParameters]=self.getViewTypeAndSubjectID(message)
      #set subject ID for client
      client.subjectID=subjectID
      if self.config['serverType']=="regularExperiment":
         if viewType=="monitor":
            print("New monitor client")
            self.monitorClients.append(client)
            self.updateTaskTable()
         elif viewType=="tester":
            print("New tester client")
         elif viewType=="console":
            print("New console client")
            self.consoleClients.append(client)
            self.lastConsoleMessageTime=time.time()-10#this ensures a page refresh
            self.consoleMessage()
         elif viewType=="video":
            print("New video client")
            self.videoClients.append(client)
            self.updateStatus("video")
            if self.data['serverStatus']['page']=="instructions":
               self.reconnectInstructions("video")
         elif viewType=="regular":
            if subjectID not in self.data['subjectIDs']: 
               if self.data['serverStatus']['acceptingClients']==1:
                  self.clientsById[subjectID]=client
                  self.createSubject(subjectID)
                  self.data[subjectID].ipAddress=client.peer
                  self.data[subjectID].connectionStatus='connected'
                  self.data[subjectID].queryParameters=queryParameters
                  self.setURLParameters(urlParamsToAdd,subjectID,output="send")

               elif self.data['serverStatus']['acceptingClients']==0:
                  #IF not accepting send a list of clients
                  msg={}
                  msg['type']="notAccepting"
                  msg["subjectIDs"]=[[x,self.data[x].connectionStatus] for x in self.data["subjectIDs"]]
                  self.messagePythonToJavascript(msg,client)

                  print("New Client Trying to Join: %s, not accepting anymore"%(subjectID))
            elif subjectID in self.data['subjectIDs']:
               print("reconnecting subject %s, %s"%(subjectID,self.data['serverStatus']['page']))
               if subjectID in self.clientsById:
                  #IF a client with that ID is currently connected
                  print("connectAnotherBrowser",subjectID)
                  msg={}
                  msg['type']="connectAnotherBrowser"
                  self.messagePythonToJavascript(msg,self.clientsById[subjectID])
               else:
                  self.clientsById[subjectID]=client
               print(self.data['serverStatus']['page'])
               if self.data['serverStatus']['page']=="instructions":
                  self.reconnectInstructions(subjectID)
               elif self.data['serverStatus']['page']=="quiz":    
                  self.reconnectQuiz(subjectID)
               else:
                  self.reconnectingClient(client)

               self.data[subjectID].ipAddress=client.peer
               self.data[subjectID].connectionStatus='connected'
               self.data[subjectID].queryParameters=queryParameters
               self.setURLParameters(urlParamsToAdd,subjectID,output="send")

      elif self.config['serverType']=="demoExperiment":
         # if subjectID in self.data['subjectIDs']: 
         #    self.deleteSubject(subjectID)
         print("new demo client: %s"%(subjectID))
         self.clientsById[subjectID]=client
         self.createSubject(subjectID)
         self.data[subjectID].ipAddress=client.peer
         self.data[subjectID].queryParameters=queryParameters
         self.data[subjectID].connectionStatus='connected'
         self.displayDemo(viewType,subjectID)
         self.data[subjectID].viewType=viewType
         self.setURLParameters(urlParamsToAdd,subjectID,output="send")
      self.monitorMessage()


   def displayDemo(self,viewType,sid):
      if viewType=="quiz":
         self.quizDemo(sid)
      elif viewType=="instructions":
         self.instructionsDemo(sid)
      else:
         self.experimentDemo(sid,viewType)

   def createSubject(self,subjectID):
      print("new regular client: %s"%(subjectID))
      #This sets self.data[subjectID] to the Subject class which is defined in experiment.py
      thisSubject=self.subjectClass()
      if subjectID!="video":
         self.data['subjectIDs'].append(subjectID)
      thisSubject.subjectID=subjectID
      thisSubject.ipAddress=""
      thisSubject.timer=[0,0,0]
      thisSubject.connectionStatus=""
      self.data[subjectID]=thisSubject
      self.updateStatus(subjectID)

   def deleteSubject(self,subjectID):
      print("Deleteing subject "+subjectID)
      self.data['subjectIDs'].remove(subjectID)
      if subjectID in self.data:
         del self.data[subjectID]
      else:
         print("Trying to delete %s from self.data, but not there"%(subjectID))
      if subjectID in self.clientsById:
         self.clientsById[subjectID].sendClose()
      else:
         print("Trying to delete %s from self.clientsById, but not there"%(subjectID))

   def updateStatus(self,sid="all",output="send"):
      msg={}
      msg['type']='updateStatus'
      return self.messageToId(msg,sid,output)

   def getSubjectIDList(self,sid="all"):
      if isinstance(sid,list):#list of subjectIds
         sids=sid
      elif sid=="video":
         sids=['video']
      elif sid=="all":
         sids=self.data['subjectIDs']
      elif sid=="allPlusVideo":
         sids=self.data['subjectIDs']+["video"]
      else:
         sids=[sid]
      return sids

   def sendListOfMessages(self,messages):
      toSend={}
      for m in messages:
         sid=m["sid"]
         msg=m["msg"]
         if sid not in toSend:
            toSend[sid]=[]
         toSend[sid].append(msg)

      for sid in toSend:
         msg={}
         msg['type']='multipleMessages'
         msg['messages']=toSend[sid]
         self.messageToId(msg,sid,"send")

   def messageToId(self,msg,sid="all",output="send"):
      msg['timers']={}
      for timer in self.data["timers"]:
         msg['timers'][timer]=self.updateTimer(self.data['timers'][timer])
      sids=self.getSubjectIDList(sid)
      msgs=[]
      for s in sids:
         #msg['selfTimer']=self.updateTimer(self.data[s].timer)
         if "subjectID" not in self.data[s].status:
            self.data[s].status['subjectID']=s
         msg['status']=self.data[s].status
         if output=="send":
            self.sendMessageToClientByID(msg,s)
         elif output=="return":
            msgs.append({"msg":msg,"sid":s})
      if output=="return":
         msgs=copy.deepcopy(msgs)
         return msgs

   def sendMessageToClientByID(self,msg,sid):
      if sid=="video":
         try:
            for client in self.videoClients:
               self.messagePythonToJavascript(msg,client)

         except Exception as thisExept: 
            print(thisExept)
            print("can't send %s message to %s"%(msg['type'],sid))
      else:
         try:
            self.messagePythonToJavascript(msg,self.clientsById[sid])
         except Exception as thisExept: 
            print(thisExept)
            print("can't send %s message to %s"%(msg['type'],sid))


   def customMessage(self,subjectID,msg,output="send"):
      #print "send message %s - %s"%(subjectID,msg['type'])
      msg['timers']={}
      for timer in self.data["timers"]:
         msg['timers'][timer]=self.updateTimer(self.data['timers'][timer])
      if subjectID=="video":
         if output=="send":
            try:
               for client in self.videoClients:
                  self.messagePythonToJavascript(msg,client)
            except:
               print("can't send %s message to %s"%(msg['type'],subjectID))
      else:
         #msg['selfTimer']=self.updateTimer(self.data[subjectID].timer)
         msg['status']=self.data[subjectID].status
         if output=="send":
            try:
               self.messagePythonToJavascript(msg,self.clientsById[subjectID])
            except:
               print("can't send %s message to %s"%(msg['type'],subjectID))
      if output=="return":
         msg=copy.deepcopy(msg)
         return msg
   def runCommand(self,message,client):
      try:
         exec(message['command'])
      except Exception as thisExept: 
         print(thisExept)

   def refreshMyPage(self,message,client):
      msg={}
      msg['type']="refreshMyPage"
      return self.messageToId(msg,message['subjectIDIncoming'],"send")

   def deleteThisClient(self,message,client):
      self.deleteSubject(message['subjectIDIncoming'])
      self.monitorMessage()


   def stopPythonServer(self,message,client):
      self.saveData()
      print("To Restart Use:\n")
      print(self.restartString)
      reactor.stop()

   def restartPythonServer(self,message,client):
      reactor.stop()
      print("Starting a new python server")
      string=sys.executable+" "+" ".join(sys.argv)
      # print string
      # os.system(string)
      os.execv(sys.executable,[sys.executable.split("/")[-1]]+sys.argv)

   def consoleMessage(self):
      #this ensures that we won't get memory leak from too many console messages
      if time.time()-self.lastConsoleMessageTime>.1:
         if self.nextConsoleCall!=0:
            if self.nextConsoleCall.cancelled==0 and self.nextConsoleCall.called==0:
               self.nextConsoleCall.cancel()
         self.nextConsoleCall=0
         self.lastConsoleMessageTime=time.time()
         msg={"type":"consoleLinesUpdate"}
         msg['consoleLines']=self.getCurrentConsoleLines()
         try:
            for client in self.consoleClients:
               client.sendMessage(json.dumps(msg).encode('utf8'))
         except Exception as thisExept: 
            # print("can't send message to console"+thisExept)
            pass
      else:
         if self.nextConsoleCall==0:
            self.nextConsoleCall=reactor.callLater(.1,self.consoleMessage)
   def getCurrentConsoleLines(self):
      currentTab=self.logCounter.currentTab
      thisFile=self.config['logFolder']+"/pickle/%s.pickle"%(currentTab)
      with open(thisFile,'rb') as file:
         out=[]
         while 3<4:
            try:
               data=pickle.load(file)
               out.append(data)
            except:
               # print(sys.exc_info()[0])
               break

      return out#json.dumps(out).encode('utf8')

   def monitorMessage(self):
      #update at most 10 times per second
      if time.time()-self.lastMonitorMessageSent>.1:
         if self.nextMonitorCall!=0:
            if self.nextMonitorCall.cancelled==0 and self.nextMonitorCall.called==0:
               self.nextMonitorCall.cancel()
         self.nextMonitorCall=0
         self.lastMonitorMessageSent=time.time()
         self.updateMonitorTable()
      else:
         #this ensures that there will be one last monitor message if a lot are received all at the same time
         if self.nextMonitorCall==0:
            try:
               self.nextMonitorCall=reactor.callLater(.1,self.monitorMessage)
            except Exception as e:
               self.nextMonitorCall=0


