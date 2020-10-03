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
from pathlib import Path

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
         self.data['rejectIDs']=[]
         self.data['duplicateIDs']=[]
         self.data['subjects']={}

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


   def loadPreloadedData(self):
      if self.options.file!="False":
         completePath=os.path.abspath(self.options.file) 
         file = open(completePath,'rb')
         loadedData=pickle.load(file)
         file.close() 
         for k in loadedData:
            self.createSubject(k.subjectID,{},"","preload",k)
            self.data['subjects'][k.subjectID].connectionStatus="disconnected"
         print("External data file loaded from %s!"%(completePath))


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
      elif pathName.split("/")[-1]=="client.html" or pathName=="/":
         viewType="regular"
         while True:
            subjectID=self.generateRandomString(8)
            if subjectID not in self.data['subjectIDs']:
               break
      else:
         viewType="unknown"
         subjectID="unknown"


      if "subjectID" in queryParameters:
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
         self.data['subjects'][sid].queryParameters[k]=[params[k]]

      queryString="?"
      queryString+="%s=%s"%("subjectID",self.data['subjects'][sid].queryParameters["subjectID"][0])
      queryString+="&%s=%s"%("viewType",self.data['subjects'][sid].queryParameters["viewType"][0])

      for k in self.data['subjects'][sid].queryParameters:
         if k!="subjectID" and k!="viewType":
            queryString+="&%s=%s"%(k,self.data['subjects'][sid].queryParameters[k][0])
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
            client.currentMonitorTable=self.currentMonitorTable
            client.monitorTableSortColumn=[[0,"reg","clientInfo"],[0,"reg","clientInfo"],[0,"reg","clientInfo"],[0,"reg","clientInfo"],[0,"reg","clientInfo"],[0,"reg","clientInfo"]]
            client.page="monitor"
            client.consoleTab=1
            print("New monitor client SET!!!!!!!!!")
            self.monitorClients.append(client)
            self.confirmSuccessfulSTEEPconnection(client)
            self.updateMonitorPage(client)
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
            #true or false conditions
            fromURL="subjectID" not in urlParamsToAdd
            hasDuplicateString=subjectID.find("-duplicate-")>-1
            inDuplicates=subjectID in self.data['duplicateIDs']
            baseSID=subjectID.split("-")[0]

            if fromURL and hasDuplicateString and not inDuplicates:
               #remove duplicate string if from URL but not already in duplicates
               subjectID=baseSID
               queryParameters["subjectID"][0]=subjectID
               client.subjectID=subjectID

            #true or false conditions
            hasDuplicateString=subjectID.find("-duplicate-")>-1
            inSubjects=subjectID in self.data['subjectIDs']
            inRejects=subjectID in self.data['rejectIDs']
            inDuplicates=subjectID in self.data['duplicateIDs']
            inOne=inSubjects or inRejects or inDuplicates
            baseSID=subjectID.split("-")[0]
            hasBase=baseSID in self.data['subjectIDs']




            if not inOne:
               if self.data['serverStatus']['acceptingClients']==1:
                  self.createSubject(subjectID,client,queryParameters,"subject")
               elif self.data['serverStatus']['acceptingClients']==0:
                  self.createSubject(subjectID,client,queryParameters,"reject")
               self.setURLParameters(urlParamsToAdd,subjectID,output="send")
               self.confirmSuccessfulSTEEPconnection(client)
            elif inOne:
               print("reconnecting subject %s, %s"%(subjectID,self.data['serverStatus']['page']))
               reconnectNeeded=True
               if subjectID in self.clientsById and baseSID in self.clientsById:
                  print("CONDITOIN 1") 
                  reconnectNeeded=False
                  for k in range(1,1000):
                     duplicateSid="%s-duplicate-%s"%(baseSID,k)
                     if duplicateSid not in self.data['duplicateIDs']:
                        break
                  subjectID=duplicateSid
                  client.subjectID=subjectID
                  queryParameters["subjectID"][0]=subjectID
                  self.createSubject(subjectID,client,queryParameters,"duplicate")
                  self.setURLParameters(urlParamsToAdd,subjectID,output="send")
                  self.confirmSuccessfulSTEEPconnection(client)
               elif baseSID not in self.clientsById:
                  subjectID=baseSID
                  client.subjectID=subjectID
                  queryParameters["subjectID"][0]=subjectID
                  reconnectNeeded=True

               if reconnectNeeded:
                  self.clientsById[subjectID]=client
                  self.confirmSuccessfulSTEEPconnection(client)
                  reconnectMethod = getattr(self,"reconnectingClient",None)
                  if callable(reconnectMethod):
                     self.reconnectingClient(client)
                  else:
                     self.updateStatus(subjectID)

               self.data['subjects'][subjectID].ipAddress=client.peer
               self.data['subjects'][subjectID].connectionStatus='connected'
               self.data['subjects'][subjectID].queryParameters=queryParameters
               self.setURLParameters(urlParamsToAdd,subjectID,output="send")

      elif self.config['serverType']=="demoExperiment":
         # if subjectID in self.data['subjectIDs']: 
         #    self.deleteSubject(subjectID)
         print("new demo client: %s"%(subjectID))
         self.clientsById[subjectID]=client
         self.createSubject(subjectID)
         self.data['subjects'][subjectID].ipAddress=client.peer
         self.data['subjects'][subjectID].queryParameters=queryParameters
         self.data['subjects'][subjectID].connectionStatus='connected'
         self.displayDemo(viewType,subjectID)
         self.data['subjects'][subjectID].viewType=viewType
         self.setURLParameters(urlParamsToAdd,subjectID,output="send")
      self.monitorMessage()

   def confirmSuccessfulSTEEPconnection(self,client):
      msg={}
      msg['type']='confirmSuccessfulSTEEPconnection'
      self.sendMessageToClient(msg,client)


   def displayDemo(self,viewType,sid):
      if viewType=="quiz":
         self.quizDemo(sid)
      elif viewType=="instructions":
         self.instructionsDemo(sid)
      else:
         self.experimentDemo(sid,viewType)

   def createSubject(self,subjectID,client,queryParameters,addType,classIN={}):
      print("new %s client: %s"%(addType,subjectID))
      #This sets self.data['subjects'][subjectID] to the Subject class which is defined in experiment.py
      if addType=="preload":
         preload=True
         addType="subject"
         thisSubject=classIN
         thisSubject.ipAddress="preloaded"
      else:
         preload=False
         thisSubject=self.subjectClass()
         thisSubject.ipAddress=client.peer
         self.clientsById[subjectID]=client
      thisSubject.subjectID=subjectID
      thisSubject.queryParameters=queryParameters
      thisSubject.timer=[0,0,0]
      thisSubject.connectionStatus="connected"
      thisSubject.communicationStatus=["empty","empty"]
      if addType=="reject":
         thisSubject.status["page"]="steepNotAcceptingClientsAnymore"
         thisSubject.status["subjectIDs"]=[[x,self.data['subjects'][x].connectionStatus] for x in self.data['subjectIDs']]
      elif addType=="duplicate":
         thisSubject.status["page"]="steepDuplicateConnection"
      #managerial
      self.data[addType+'IDs'].append(subjectID)
      self.data['subjects'][subjectID]=thisSubject
      if not preload:
         self.clearSessionStorageOnClient(subjectID,"send")
         self.updateStatus(subjectID)



   def disconnectThisClient(self,message,client):
      sid=message['subjectIDIncoming']
      msg={}
      msg['type']='steepDisconnectClient'
      return self.messageToId(msg,sid,"send")


   def rejectThisClient(self,message,client):
      sid=message['subjectIDIncoming']
      if sid in self.data['subjectIDs']:
         self.data['subjectIDs'].remove(sid)
      if sid not in self.data['rejectIDs']:
         self.data['rejectIDs'].append(sid)
      self.data['subjects'][sid].status["page"]="steepNotAcceptingClientsAnymore"
      self.updateStatus(sid)
      self.monitorMessage()

   def acceptThisClient(self,message,client):
      sid=message['subjectIDIncoming']
      if sid in self.data['rejectIDs']:
         self.data['rejectIDs'].remove(sid)
      if sid not in self.data['subjectIDs']:
         self.data['subjectIDs'].append(sid)
      self.data['subjects'][sid].status["page"]="generic"
      self.updateStatus(sid)
      self.monitorMessage()


   def deleteSubject(self,subjectID):
      print("Deleteing subject "+subjectID)
      self.data['subjectIDs'].remove(subjectID)
      if subjectID in self.data['subjects']:
         del self.data['subjects'][subjectID]
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
      #get timers for everyone
      allTimers=self.updateAllTimers({},"all")
      sids=self.getSubjectIDList(sid)
      msgs=[]
      for s in sids:
         #get timers for this subject
         msg['timers']=self.updateAllTimers(allTimers.copy(),s)
         if s in self.data['subjects']:
            if "subjectID" not in self.data['subjects'][s].status:
               self.data['subjects'][s].status['subjectID']=s
            msg['status']=self.data['subjects'][s].status
         else:
            msg['status']={"subjectID":"NoSID"}
         if output=="send":
            self.sendMessageToClientByID(msg,s)
         elif output=="return":
            msgs.append({"msg":msg,"sid":s})
      if output=="return":
         msgs=copy.deepcopy(msgs)
         return msgs

   def sendMessageToClient(self,msg,client):
      try:
         self.messagePythonToJavascript(msg,client)
      except Exception as thisExept: 
         print(thisExept)
         try:
            print("can't send %s message to %s"%(msg['type'],client.subjectID))
         except:
            print("STEEP client has not subjectID")

   def sendMessageToClientByID(self,msg,sid):
      if sid=="video":
         for client in self.videoClients:
            self.sendMessageToClient(msg,client)
      else:
         if sid in self.clientsById:   
            self.sendMessageToClient(msg,self.clientsById.get(sid,"NOCLIENTAVAILABLE"))
         else:
            print("can't send message to %s"%(sid)) 

   # def customMessage(self,subjectID,msg,output="send"):
   #    #print "send message %s - %s"%(subjectID,msg['type'])
   #    msg['timers']={}
   #    for timer in self.data["timers"]:
   #       msg['timers'][timer]=self.updateTimer(self.data['timers'][timer])
   #    if subjectID=="video":
   #       if output=="send":
   #          try:
   #             for client in self.videoClients:
   #                self.messagePythonToJavascript(msg,client)
   #          except:
   #             print("can't send %s message to %s"%(msg['type'],subjectID))
   #    else:
   #       #msg['selfTimer']=self.updateTimer(self.data['subjects'][subjectID].timer)
   #       msg['status']=self.data['subjects'][subjectID].status
   #       if output=="send":
   #          try:
   #             self.messagePythonToJavascript(msg,self.clientsById[subjectID])
   #          except:
   #             print("can't send %s message to %s"%(msg['type'],subjectID))
   #    if output=="return":
   #       msg=copy.deepcopy(msg)
   #       return msg


   def runCommand(self,message,client):
      try:
         exec(message['command'])
      except Exception as thisExept: 
         print(thisExept)

   def refreshMyPage(self,message,client):
      msg={}
      msg['type']="refreshMyPage"
      return self.messageToId(msg,message['subjectIDIncoming'],"send")

   def refreshMyPageIn10(self,message,client):
      msg={}
      msg['type']="refreshMyPageIn10"
      return self.messageToId(msg,message['subjectIDIncoming'],"send")

   def deleteThisClient(self,message,client):
      self.deleteSubject(message['subjectIDIncoming'])
      self.monitorMessage()
      reactor.callLater(2,self.monitorMessage)



   def clearSessionStorageOnClient(self,sid="all",output="send"):
      msg={}
      msg['type']="clearSessionStorage"
      self.messageToId(msg,sid,output)

   def stopPythonServer(self,message,client):
      self.saveData()
      self.clearSessionStorageOnClient("all","send")
      print("To Restart Use:\n")
      print(self.restartString)
      reactor.stop()

   def restartPythonServer(self,message,client):
      self.saveData()
      self.clearSessionStorageOnClient("all","send")
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
         try:
            # for client in self.consoleClients:
            for client in self.monitorClients:
               if client.page=="console":
                  msg={"type":"consoleLinesUpdate"}   
                  msg['monitorTables']=[x for x in self.data['monitorTableInfo']]
                  msg['consoleLines']=self.getCurrentConsoleLines(client.consoleTab)
                  msg=self.getExtraMonitorPageInfo(msg,client)
                  client.sendMessage(json.dumps(msg).encode('utf8'))
         except Exception as thisExept: 
            # print("can't send message to console"+thisExept)
            pass
      else:
         if self.nextConsoleCall==0:
            self.nextConsoleCall=reactor.callLater(.1,self.consoleMessage)
   def getCurrentConsoleLines(self,tab):
      currentTab=tab
      thisFile=Path(self.config['logFolder']).joinpath("pickle","%s.pickle"%(currentTab))
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

   def STEEPdataViewer(self,message,client):
      out={}
      out['type']="STEEPreturnDataViewer"
      try:
         out['string']=str(eval(message['python']))
      except:
         out['string']="ERROR"
      client.sendMessage(json.dumps(out).encode('utf8'))

   def STEEPsendJSToClient(self,message,client):
      if message['sid']=="monitor":
         print(message) 
         out={}
         out['type']="STEEPreturnJSFromClient"
         out['string']=message['js']      
         self.messageToId(out,message['sidTO'],"send")


if __name__ == '__main__':
   pass