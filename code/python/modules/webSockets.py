from __future__ import print_function,division,absolute_import   
import json
from autobahn.twisted.websocket import WebSocketServerFactory,WebSocketServerProtocol,listenWS
import time
import pickle 

class SteepWebSocketProtocol(WebSocketServerProtocol):
   def onOpen(self):
      self.factory.register(self)
   def connectionLost(self, reason):
      WebSocketServerProtocol.connectionLost(self, reason)
      self.factory.unregister(self)
   def onMessage(self, payload, isBinary):
      if not isBinary:
         msg = json.loads(payload.decode('utf8'))
         try:
            sid=client.subjectID
         except:
            sid="sidNotSet"
         msg["sid"]=sid
         self.factory.messageJavascriptToPython(msg,self)

class SteepWebSocketFactory(WebSocketServerFactory,):
   def __init__(self):
      WebSocketServerFactory.__init__(self)
      self.port=self.config["webSocketPort"]
      self.protocol = SteepWebSocketProtocol
      self.messageLogFile = open(self.config['messageLogFile'],'wb')
      self.messageLogFile.close()
      self.messageLogFile = open(self.config['messageLogFile'],'ab')
      self.messagesFromPythonToJavascript=True
      
   def messageJavascriptToPython(self,message,client):
      #automatically run the function self.message['type'](message,client) when that message is received
      self.writeToMessageLog(message,"from")
      eval("self.%s(%s,%s)"%(message['type'],'message','client'))

   def messagePythonToJavascript(self,message,client):
      if self.messagesFromPythonToJavascript:
         try:
            sid=client.subjectID
         except:
            sid="sidNotSet"
         message['sid']=sid
         self.writeToMessageLog(message,"to")
         client.sendMessage(json.dumps(message).encode('utf8'))
   
   def writeToMessageLog(self,message,direction):
      dataToWrite=[direction,time.time(),message]
      # file = open(self.config['messageLogFile'],'ab')
      #protocol for python 3 compatibility
      pickle.dump(dataToWrite,self.messageLogFile,protocol=2)
      # file.close() 

   def register(self, client):
      if client not in self.clients:
         self.clients.append(client)
      # try:
      #    self.data[client.subjectID].connectionStatus='connected'
      #    self.monitorMessage()
      # except:
      #    "do nothing"
   def unregister(self, client):
      if client in self.clients:
         self.clients.remove(client)
         if self.config['serverType']=="demoExperiment":
            if client.subjectID in self.data['subjectIDs']:
               print("DELETING SUBJECT !!!!!",client.subjectID) 
               self.deleteSubject(client.subjectID)
            self.cancelInstructionsCalls(client.subjectID)
         else:
            toDelete=[]
            for k in self.clientsById:
               if self.clientsById[k]==client:
                  toDelete.append(k)
            for k in toDelete:
               del self.clientsById[k]
            try:
               self.data[client.subjectID].connectionStatus='disconnected'
               self.monitorMessage()
            except:
               "do nothing"
            
      if client in self.videoClients:
         self.videoClients.remove(client)
      elif client in self.monitorClients:
         self.monitorClients.remove(client)
      elif client in self.consoleClients:
         self.consoleClients.remove(client)

