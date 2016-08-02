import sys
import os
import imp
import pickle
import string
import random
import time
import json
import urlparse
import webbrowser

from twisted.internet import reactor
from twisted.internet import task

from twisted.web.server import Site
from twisted.web.resource import Resource
from twisted.web.static import File
from twisted.python import log
from autobahn.twisted.websocket import WebSocketServerFactory,WebSocketServerProtocol,listenWS


#load the options
import optionsCommands
options=optionsCommands.getOptions()

#get server Start Time String.  This is used for log and data files
if options.restart=="False":
   serverStartString=time.strftime("%Y%m%d-%H%M%S",time.localtime(time.time()))
else:
   serverStartString=options.restart
restartString=optionsCommands.printRestartString(serverStartString)

#load the config file
try:  
   settings = imp.load_source('settings',options.configFile)
except:
   sys.exit("ERROR: Config file couldn't be loaded (probably not a python file).\n %s \nYou can see all options by running 'python server.py -h'"%(options.configFile))

#Save data to temporary file.  This avoids clutter
if options.saveData=="False":
   serverStartString="tmp"
#Add serverStartString to config file
config=settings.defaultSettings(options.location,options.configFile,serverStartString)



#Load the logger
import logger
if options.debug!="True":
   thisLogger=logger.TwistedLogger(config['webServerRoot']+config['dataFolder'])
   print restartString

#load the experiment file
experimentFile=config['webServerRoot']+config['currentExperiment']+"/files/experiment.py"
experiment = imp.load_source('experiment', experimentFile)

#Print server starting message
if options.restart=="False":
   print "SERVER RUNNING - %s!!!"%(serverStartString)
else:
   print "SERVER RESTARTING - %s!!!"%(serverStartString)
print "current Experiment: "+config['currentExperiment']

#Get value from url key function
def getValueFromQueryKey(query,key):
   number=""
   for k in query.split("&"):
      this=k.split("=")
      if this[0]==key:
         number=int(this[1])
   return number

#Handle HTTP requests
class RequestHandler(Resource):
   isLeaf = True
   def __init__(self,config):
      self.config=config
   def render_GET(self, request):
      parsedURL=urlparse.urlparse(request.uri)#scheme,netloc,path,query
      if parsedURL.path=="/":
         ext=".py"
         filename="index.py"
         fileFolder=self.config['packageFolder']+"/html/"
         fullPath=self.config['webServerRoot']+fileFolder+filename
      elif parsedURL.path in ["/client.html","/monitor.html","/instructions.html","/video.html","/questionnaire.html","/quiz.html"]:
         ext=".py"
         filename=parsedURL.path.replace(".html",".py").replace("/","")
         fileFolder=self.config['packageFolder']+"/html/"
         fullPath=self.config['webServerRoot']+fileFolder+filename
      elif parsedURL.path in ["/console.html"]:
         thisPage=getValueFromQueryKey(parsedURL.query,"page")
         if thisPage=="":
            thisPage=thisLogger.fileCount
         self.logURL=self.config['domain']+self.config['dataFolder']+"/logs/%s.log"%(thisPage)
         print "HERE",self.logURL
         self.currentLogTab=thisPage
         ext=".py"
         filename=parsedURL.path.replace(".html",".py").replace("/","")
         fileFolder=self.config['packageFolder']+"/html/"
         fullPath=self.config['webServerRoot']+fileFolder+filename
      else:
         root,ext=os.path.splitext(parsedURL.path)
         filename=os.path.basename(parsedURL.path)
         if filename=="":
            filename="index.py"
            ext=".py"
         fileFolder=parsedURL.path.replace(filename,"")
         fullPath=self.config['webServerRoot']+fileFolder+filename
         if filename=="favicon.ico":
            print "FAVICON"
            fullPath=self.config['webServerRoot']+self.config['packageFolder']+"/html/triangle.png"


      if os.path.isfile(fullPath):
         if filename=="console.py":
            print "running %s from %s"%(filename,self.config['webServerRoot']+fileFolder)
            thisPage = imp.load_source('thisPage',self.config['webServerRoot']+fileFolder+filename)
            output=thisPage.getPage(self.config,self.logURL,thisLogger.fileCount,self.currentLogTab)
            return output
         elif ext==".py":
            print "running %s from %s"%(filename,self.config['webServerRoot']+fileFolder)
            thisPage = imp.load_source('thisPage',self.config['webServerRoot']+fileFolder+filename)
            output=thisPage.getPage(self.config)
            return output
         elif ext==".m4a":
            request.setHeader("Content-Type","audio/mp4")
            thisFile=File(self.config['webServerRoot']+parsedURL.path)
            return File.render_GET(thisFile,request)
         else:
            #print "getting file: "+self.config['webServerRoot']+fileFolder+filename
            thisFile=File(self.config['webServerRoot']+fileFolder+filename)
            return File.render_GET(thisFile,request)
      else:
         print request
         print >> sys.stderr, "ErrorLine: File NOT found: ",fullPath
         return "<html><h1>File Not Found - %s</h1></html>"%(fullPath)



class BroadcastServerProtocol(WebSocketServerProtocol):
   def onOpen(self):
      self.factory.register(self)
   def connectionLost(self, reason):
      WebSocketServerProtocol.connectionLost(self, reason)
      self.factory.unregister(self)
   def onMessage(self, payload, isBinary):
      if not isBinary:
         msg = json.loads(payload.decode('utf8'))
         self.factory.messageManager(msg,self)

class BroadcastServerFactory(WebSocketServerFactory,experiment.experimentClass,experiment.monitorClass):
   def __init__(self, url,config):
      WebSocketServerFactory.__init__(self, url)
      self.config=config
      self.setPreliminaries(options.restart)
      experiment.experimentClass.__init__(self,config)
      experiment.monitorClass.__init__(self)
      #self.simulation()

   def messageManager(self,message,client):
      eval("self.%s(%s,%s)"%(message['type'],'message','client'))

   def setPreliminaries(self,restart):
      #All Clients 
      self.clients=[]
      self.videoClients=[]
      self.monitorClients=[]
      self.clientsById={}

      if restart=="False":
         #store all data here
         self.data={}
         self.data['config']=self.config
         self.data['subjectIDs']=[]
         self.data['acceptingClients']=1
         self.data['sessionTimeStamp']=serverStartString
         self.data['timer']=[0,0,0]

         #Cannot Pickle these!!
         self.timerFunction=reactor.callLater(0,self.blank)
         self.subjectTimerFunctions={}
      else:
         file = open(self.config['dataFilePath'],'rb')
         self.data=pickle.load(file)
         file.close() 

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
      for sid in self.data['subjectIDs']:
         self.customMessage(sid,msg)

   def stopAccepting(self,message,client):
      self.data['acceptingClients']=0
      print "Done Accepting Clients!"
      print "%s Clients Connected"%(len(self.data['subjectIDs']))
      print self.data['subjectIDs']
      self.setMatchings()

   def startAccepting(self,message,client):
      self.data['acceptingClients']=1
      print "Accepting Clients Now!"

   # def updateStatusFromClient(self,message,client):
   #    sid=client.subjectID
   #    self.data[sid].status=message['status']
   #    #self.updateStatus(sid)

   def register(self, client):
      if client not in self.clients:
         self.clients.append(client)
   def unregister(self, client):
      if client in self.clients:
         self.clients.remove(client)
         # if client.subjectID in self.clientsById:
         #    del self.clientsById[client.subjectID]
         try:
            self.data[client.subjectID].connectionStatus='disconnected'
            self.monitorMessage()
         except:
            "do nothing"
         if self.config['serverType']=="demoExperiment":
            self.deleteSubject(client.subjectID)

      if client in self.videoClients:
         self.videoClients.remove(client)
      elif client in self.monitorClients:
         self.monitorClients.remove(client)



   def generateRandomString(self,size=8):
      chars=string.ascii_uppercase + string.digits
      return ''.join(random.choice(chars) for _ in range(size))


   def newConnection(self,message,client):

      toAdd=[]
      #get subjectID or create a new one
      if 'subjectID' not in message or self.config['serverType']=="demoExperiment":
         subjectID=self.generateRandomString(8)
         toAdd.append(["subjectID",subjectID])
      else:
         subjectID=message['subjectID']

      #get viewType or set to regular
      if 'viewType' not in message:
         viewType="regular"
         toAdd.append(["viewType",viewType])
      else:
         viewType=message['viewType']

      #add parameters to URL
      if len(toAdd)>0:
         msg={}
         msg['type']="addParamToURL"
         msg['params']=toAdd
         client.sendMessage(json.dumps(msg).encode('utf8'))

      #set subject ID for client
      client.subjectID=subjectID


      if self.config['serverType']=="regularExperiment":
         if viewType=="regular":
            if subjectID not in self.data['subjectIDs']: 
               if self.data['acceptingClients']==1:
                  print "new regular client",subjectID
                  self.clientsById[subjectID]=client
                  self.createSubject(subjectID,client)
                  self.data[subjectID].ipAddress=client.peer
                  self.data[subjectID].connectionStatus='connected'
               elif self.data['acceptingClients']==0:
                  #IF not accepting send a list of clients
                  msg={}
                  msg['type']="notAccepting"
                  msg["subjectIDs"]=[[x,self.data[x].connectionStatus] for x in self.data["subjectIDs"]]
                  connections=[]
                  for sid in self.data["subjectIDs"]:
                     connections.append(self.data[sid].connectionStatus)
                  client.sendMessage(json.dumps(msg).encode('utf8'))
                  print "New Client Trying to Join, not accepting anymore",self.data['acceptingClients']
            elif subjectID in self.data['subjectIDs']:
               print "reconnecting subject",subjectID
               if subjectID in self.clientsById:
                  #IF a client with that ID is currently connected
                  msg={}
                  msg['type']="connectAnotherBrowser"
                  self.clientsById[subjectID].sendMessage(json.dumps(msg).encode('utf8'))

               self.clientsById[subjectID]=client
               self.data[subjectID].ipAddress=client.peer
               self.data[subjectID].connectionStatus='connected'
               self.reconnectingClient(client)
         elif viewType=="monitor":
            print "New monitor client"
            self.monitorClients.append(client)
         elif viewType=="video":
            print "New video client"
            self.videoClients.append(client)
            if self.data['instructionsRunning']==1:
               self.reconnectInstructions(client)

      elif self.config['serverType']=="demoExperiment":
         if subjectID in self.data['subjectIDs']: 
            self.deleteSubject(subjectID)
         print "new demo client",subjectID
         self.clientsById[subjectID]=client
         self.createSubject(subjectID,client)
         self.data[subjectID].ipAddress=client.peer
         self.data[subjectID].connectionStatus='connected'
         self.displayDemo(viewType,subjectID)
      self.monitorMessage()

   def createSubject(self,subjectID,client):
      #This sets self.data[subjectID] to the Subject class which is defined in experiment.py
      thisSubject=experiment.subjectClass()
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
      del self.data[subjectID]
      del self.clientsById[subjectID]

   def updateStatus(self,subjectID):
      msg={}
      msg['type']='updateStatus'
      msg['status']=self.data[subjectID].status
      self.customMessage(subjectID,msg)

   def cancelTimerFunction(self,subjectID):
      self.initializeTimer(subjectID,0)

   def initializeTimer(self,*args):
      subjectID=args[0]
      duration=args[1]
      args2=args[1:]
      if subjectID=="all":
         self.data['timer']=[time.time(),time.time(),duration]
         if self.timerFunction.cancelled==0 and self.timerFunction.called==0:
            self.timerFunction.cancel()
         if len(args2)>1:
            self.timerFunction=reactor.callLater(*args2)
      else:
         self.data[subjectID].timer=[time.time(),time.time(),duration]
         if self.subjectTimerFunctions[subjectID].cancelled==0 and self.subjectTimerFunctions[subjectID].called==0:
            self.subjectTimerFunctions[subjectID].cancel()
         if len(args2)>1:
            self.subjectTimerFunctions[subjectID]=reactor.callLater(*args2)

   def updateTimer(self,timer):
      #timer=currentTime,startTime,totalTime
      timer[0]=time.time()
      remaining=timer[2]-(timer[0]-timer[1])
      return remaining

   def customMessage(self,subjectID,msg):
      #print "send message %s - %s"%(subjectID,msg['type'])
      msg['timer']=self.updateTimer(self.data['timer'])
      msg['selfTimer']=self.updateTimer(self.data[subjectID].timer)
      msg['status']=self.data[subjectID].status
      try:
         self.clientsById[subjectID].sendMessage(json.dumps(msg).encode('utf8'))
      except:
         print "can't send %s message to %s"%(msg['type'],subjectID)

   def runCommand(self,message,client):
      try:
         exec(message['command'])
      except Exception as thisExept: 
         print thisExept

   def refreshMyPage(self,message,client):
      msg={}
      msg['type']="refreshMyPage"
      if message['sid']=="all":
         for sid in self.data['subjectIDs']:
            self.customMessage(sid,msg)
      else:
         self.customMessage(message['sid'],msg)


   #Monitor Stuff

   def monitorMessage(self):
      msg={"type":"tableUpdate"}
      msg['table'],msg['titles']=self.getMonitorTable()
      msg['accepting']=self.data['acceptingClients']
      msg['taskTable']=self.data['monitorTasks']
      msg['dataFile']=self.config['dataFilePath']
      msg['dataFileURL']=self.config['dataFileURL']
      try:
         for client in self.monitorClients:
            client.sendMessage(json.dumps(msg).encode('utf8'))
      except:
         print "can't send message to server"

   def taskDone(self,message):
      self.data['monitorTasks'][message['index']]['status']='Done'
      self.monitorMessage()

   # Instructions Stuff

   def reconnectInstructions(self,client):
      for k in self.data['monitorTasks']:
         if k['type']=='loadInstructions':
            print "sending"
            self.loadInstructions(k,client)
            break 
      msg={}
      msg['type']="startInstructions"
      msg['source']=self.videoSource
      msg['time']=time.time()-self.data['instructionsStartTime']
      client.sendMessage(json.dumps(msg).encode('utf8'))


   def loadInstructions(self,message,client):
      msg={}
      msg['type']="loadInstructions"
      self.videoSource=message['source']
      msg['source']=message['source']
      for sid in self.data['subjectIDs']:
         self.data[sid].status={"page":"generic","message":["The instruction video will start shortly...."]}
         self.customMessage(sid,msg)
      self.videoClientMessage(msg)
      self.data['monitorTasks'][message['index']]['status']='Done'
      self.monitorMessage()

   def startInstructions(self,message,client):
      self.data['instructionsRunning']=1      
      self.data['instructionsStartTime']=time.time()
      msg={}
      msg['type']="startInstructions"
      msg['time']=0
      for sid in self.data['subjectIDs']:
         self.customMessage(sid,msg)
      self.videoClientMessage(msg)

      self.data['monitorTasks'][message['index']]['status']='Done'
      self.monitorMessage()
      
      reactor.callLater(message['totalTime'],self.endInstructions)
   
   def endInstructions(self):
      self.data['instructionsRunning']=0
      msg={}
      msg['type']="endInstructions"
      for sid in self.data['subjectIDs']:
         self.data[sid].status={"page":"generic","message":["The Instructions Have Ended. <br> Next there will be a practice match."]}
         self.customMessage(sid,msg)
      self.videoClientMessage(msg)

   def videoClientMessage(self,msg):
      #send message to all video clients
      for client in self.videoClients:
         client.sendMessage(json.dumps(msg).encode('utf8'))

   # Quiz Stuff
   def checkQuizAnswer(self,message,client):
      sid=client.subjectID
      self.data[sid].quizAnswers.append(message['answerInfo'])
      if message['answerInfo']['questionNumber']==13:
         self.data[sid].status={"page":"generic","message":["Please wait for other's to finish the quiz."]}
         self.updateStatus(sid)
         self.data['doneWithQuiz'].append(sid)
         if len(self.data['doneWithQuiz'])==len(self.data['subjectIDs']):
            self.data['quizRunning']=0

      else:
         self.reconnectQuiz(sid)

   def startQuiz(self,message,client):
      self.data['quizRunning']=1
      for sid in self.data['subjectIDs']:
         self.data[sid].quizAnswers.append({'questionNumber':1,'correct':-1,'answer':"sdf"})
         self.reconnectQuiz(sid)

      self.data['monitorTasks'][message['index']]['status']='Done'
      self.monitorMessage()

   def reconnectQuiz(self,sid):
      if self.data[sid].quizAnswers[-1]['questionNumber']==13:
         self.data[sid].status={"page":"generic","message":["Please wait for experiment to start."]}
         self.updateStatus(sid)
      else:
         msg={}
         msg['type']="drawQuiz"
         msg['answerInfo']=self.data[sid].quizAnswers[-1]
         self.customMessage(sid,msg)

   # Questionnaire Stuff

   def startQuestionnaire(self):
      for sid in self.data['subjectIDs']:
         self.data[sid].status['page']="questionnaire"
         self.data[sid].status['payment']="%.02f+%s"%(self.data[sid].totalPayoffs*self.data['exchangeRate'],self.data[sid].bonusPay)
         self.data[sid].status['subjectID']=sid
         self.updateStatus(sid)

   def questionnaireAnswers(self,message,client):
      sid=client.subjectID
      self.data[sid].questionnaireAnswers=message['answers']
      self.data[sid].status['page']="generic"
      self.data[sid].status['message']="Thank You! <br> <br> subjectID: %s <br> Payment: %s"%(sid,self.data[sid].status['payment'])
      self.updateStatus(sid)


if __name__ == '__main__':
   debug=False
   #websockets
   factory = BroadcastServerFactory(config["websocketURL"],config)
   factory.port=config["webSocketPort"]
   factory.protocol = BroadcastServerProtocol
   factory.setProtocolOptions(allowHixie76 = True)
   listenWS(factory)

   #webserver
   resource = RequestHandler(config)
   factory = Site(resource)
   reactor.listenTCP(resource.config['serverPort'], factory)

   if options.openBrowser=="True":
      url = 'http://localhost:%s'%(resource.config['serverPort'])
      webbrowser.open(url)

   reactor.run()

