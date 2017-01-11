from __future__ import print_function
import pickle
import string
import random
import time
import json
import copy
from twisted.internet import reactor
from twisted.internet import task
import urlparse


class SteepMainServer():
   def __init__(self):
      self.setPreliminaries()

   def setPreliminaries(self):
      #All Clients 
      self.clients=[]
      self.videoClients=[]
      self.monitorClients=[]
      self.clientsById={}
      if self.options.restart=="False":
         #store all data here
         self.data={}
         self.data['config']=self.config
         self.data['subjectIDs']=[]
         self.data['sessionTimeStamp']=self.serverStartString
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
      self.wakingCall.start(120)

   def blank(self):
      pass
   def saveData(self):
      file = open(self.config['dataFilePath'],'wb')
      pickle.dump(self.data,file)
      file.close() 

   def wakeUp(self):
      msg={}
      msg['type']='wakeUp'
      return self.messageToId(msg,"all","send")

   def toggleAcceptingSwitch(self,message,client):
      self.data['serverStatus']['acceptingClients']=1-self.data['serverStatus']['acceptingClients']
      if self.data['serverStatus']['acceptingClients']==0:
         print("Done Accepting Clients!")
         print("%s Clients Connected"%(len(self.data['subjectIDs'])))
         self.setMatchings()
      else:
         print("Accepting Clients Now!")

      self.monitorMessage()




   def generateRandomString(self,size=8):
      chars=string.ascii_uppercase + string.digits
      return ''.join(random.choice(chars) for _ in range(size))



   def getViewTypeAndSubjectID(self,message):
      fullURl=message['url']['href']
      pathName=message['url']['pathname']
      queryParameters=urlparse.parse_qs(message['url']['search'][1:])#1: to eliminate ?
      #always generate new subjectID in demo
      if self.config['serverType']=="demoExperiment":
         if "subjectID" in queryParameters:
            del queryParameters['subjectID']


      if pathName=="/video.html":
         viewType="video"
         subjectID="video"
      elif pathName=="/monitor.html":
         viewType="monitor"
         subjectID="monitor"
      elif pathName=="/client.html":
         viewType="regular"
      else:
         viewType="unknown"
         subjectID="unknown"

      urlParamsToAdd={}
      if "subjectID" in queryParameters:#always generate new subjectID for demo
         subjectID=queryParameters["subjectID"][0]
      else:
         subjectID=self.generateRandomString(8)
         subjectID="subject%s"%(len(self.data['subjectIDs']))
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
                  client.sendMessage(json.dumps(msg).encode('utf8'))
                  print("New Client Trying to Join: %s, not accepting anymore"%(subjectID))
            elif subjectID in self.data['subjectIDs']:
               print("reconnecting subject %s, %s"%(subjectID,self.data['serverStatus']['page']))
               if subjectID in self.clientsById:
                  #IF a client with that ID is currently connected
                  print("connectAnotherBrowser",subjectID)
                  msg={}
                  msg['type']="connectAnotherBrowser"
                  self.clientsById[subjectID].sendMessage(json.dumps(msg).encode('utf8'))
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
      self.subjectTimerFunctions[subjectID]=reactor.callLater(0,self.blank)
      self.data[subjectID]=thisSubject
      self.updateStatus(subjectID)

   def deleteSubject(self,subjectID):
      self.data['subjectIDs'].remove(subjectID)
      if subjectID in self.data:
         del self.data[subjectID]
      else:
         print("Trying to delete %s from self.data, but not there"%(subjectID))
      if subjectID in self.clientsById:
         del self.clientsById[subjectID]
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
      msg['timer']=self.updateTimer(self.data['timer'])
      sids=self.getSubjectIDList(sid)
      msgs=[]
      for s in sids:
         msg['selfTimer']=self.updateTimer(self.data[s].timer)
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
               client.sendMessage(json.dumps(msg).encode('utf8'))
         except Exception as thisExept: 
            print(thisExept)
            print("can't send %s message to %s"%(msg['type'],sid))
      else:
         try:
            self.clientsById[sid].sendMessage(json.dumps(msg).encode('utf8'))
         except Exception as thisExept: 
            print(thisExept)
            print("can't send %s message to %s"%(msg['type'],sid))


   def customMessage(self,subjectID,msg,output="send"):
      #print "send message %s - %s"%(subjectID,msg['type'])
      msg['timer']=self.updateTimer(self.data['timer'])
      if subjectID=="video":
         if output=="send":
            try:
               for client in self.videoClients:
                  client.sendMessage(json.dumps(msg).encode('utf8'))
            except:
               print("can't send %s message to %s"%(msg['type'],subjectID))
      else:
         msg['selfTimer']=self.updateTimer(self.data[subjectID].timer)
         msg['status']=self.data[subjectID].status
         if output=="send":
            try:
               self.clientsById[subjectID].sendMessage(json.dumps(msg).encode('utf8'))
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
      print(message)
      return self.messageToId(msg,message['sid'],"send")

   def stopPythonServer(self,message,client):
      self.saveData()
      print("To Restart Use:\n")
      print(self.restartString)
      reactor.stop()


