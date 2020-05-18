from __future__ import print_function,division,absolute_import   
import time
import json

class SteepChatManager():
   def __init__(self):
      self.data['chat']={}

      #this can be updated other places
      #this tells who can send message to who
      self.data['canChatWith']={}
      d=self.data['canChatWith']
      d['experimenter']={}
      d['experimenter']['see']=['everyone','allSubjectIDs']
      d['experimenter']['send']=['everyone','allSubjectIDs']
      d['allSubjectIDs']={}
      d['allSubjectIDs']['see']=['everyone','experimenter']
      d['allSubjectIDs']['send']=['experimenter']

   def getType(self,sid):
      if sid in ["experimenter","everyone"]:
         thisType=sid
      else:
         thisType="allSubjectIDs"
      return thisType


   def chatsToBeDisplayed(self,sid):
      thisType=self.getType(sid)
      toBeDisplayedTypes=[]
      toBeDisplayedTypes+=self.data['canChatWith'].get(thisType,{}).get("see",[])
      toBeDisplayedTypes+=self.data['canChatWith'].get(thisType,{}).get("send",[])
      if thisType=="subject":#check for subject specific
         toBeDisplayedTypes+=self.data['canChatWith'].get(sid,{}).get("see",[])
         toBeDisplayedTypes+=self.data['canChatWith'].get(sid,{}).get("send",[])
      toBeDisplayedTypes=set(toBeDisplayedTypes)
      toBeDisplayed=[]
      for t in toBeDisplayedTypes:
         if t=="allSubjectIDs":
            toBeDisplayed+=self.data['subjectIDs']
         else:
            toBeDisplayed.append(t)
      toBeDisplayed.sort()
      return toBeDisplayed


   def chatsAccess(self,sid):
      thisType=self.getType(sid)
      seeTypes=self.data['canChatWith'].get(thisType,{}).get("see",[])
      sendTypes=self.data['canChatWith'].get(thisType,{}).get("send",[])
      if thisType=="subject":#check for subject specific
         seeTypes+=self.data['canChatWith'].get(sid,{}).get("see",[])
         sendTypes+=self.data['canChatWith'].get(sid,{}).get("send",[])
      seeTypes=set(seeTypes)
      sendTypes=set(sendTypes)

      canSee=[]
      for t in seeTypes:
         if t=="allSubjectIDs":
            canSee+=self.data['subjectIDs']
         else:
            canSee.append(t)

      canSend=[]
      for t in sendTypes:
         if t=="allSubjectIDs":
            canSend+=self.data['subjectIDs']
         else:
            canSend.append(t)

      out={}
      out['send']=canSend
      out['see']=canSee
      print("access",sid,out) 
      return out


   def updateRecentChats(self,sid,sid2):
      recent=self.data['chat'].setdefault(sid,{}).setdefault("recent",[])
      toBeDisplayed=self.chatsToBeDisplayed(sid)

      for r in toBeDisplayed:
         if r not in recent:
            recent.append(r)
      if sid2 in recent:
         recent.remove(sid2)
      if sid2 in toBeDisplayed:
         recent.insert(0,sid2)

   def chatMessageFromClient(self,message,client):
      sender=client.subjectID#this will be either experimenter/sid
      if sender=="monitor":sender="experimenter"
      receiver=message["to"]#this will be either experimenter/everyone/sid

      senderType=self.getType(sender)
      receiverType=self.getType(receiver)

      if receiverType in self.data['canChatWith'].get(senderType,{}).get("send",[]):
         if receiver=="everyone":
            self.updateRecentChats("experimenter",receiver)
            for s in self.data['subjectIDs']:
               self.updateRecentChats(s,receiver)
            currentChat=self.data['chat'].setdefault("everyone",{}).setdefault("messages",[])
            currentChat.append([time.time(),sender,message['message']])
            self.sendChatToClient("everyone")
         else:
            #redundant to save time retreiving
            self.updateRecentChats(sender,receiver)
            self.updateRecentChats(receiver,sender)
            currentChat=self.data['chat'][sender].setdefault("messages",{}).setdefault(receiver,[])
            currentChat.append([time.time(),sender,message['message']])
            currentChat=self.data['chat'][receiver].setdefault("messages",{}).setdefault(sender,[])
            currentChat.append([time.time(),sender,message['message']])
            self.sendChatToClient(sender)
            self.sendChatToClient(receiver)

   def getChatHistory(self,sid):
      msg={}
      msg['type']="updateChatHistory"
      msg['time']=time.time()
      msg['subjectID']=sid
      msg['recent']=self.data['chat'].get(sid,{}).get('recent',[])
      msg['messages']={}
      for x in self.data['chat'].get(sid,{}).get('messages',{}):
         msg['messages'][x]=self.data['chat'][sid]['messages'][x]
      msg['messages']["everyone"]=self.data['chat'].get("everyone",{}).get('messages',[])
      msg['access']=self.chatsAccess(sid)
      return msg

   def sendChatToClient(self,sid):
      if sid=="experimenter":
         msg=self.getChatHistory("experimenter")
         for client in self.monitorClients:
            client.sendMessage(json.dumps(msg).encode('utf8'))
         self.monitorMessage()
      elif sid=="everyone":
         msg=self.getChatHistory("experimenter")
         for client in self.monitorClients:
            client.sendMessage(json.dumps(msg).encode('utf8'))
         self.monitorMessage()
         for s in self.data['subjectIDs']:
            msg=self.getChatHistory(s)
            self.messageToId(msg,s,"send")
      else:
         msg=self.getChatHistory(sid)
         self.messageToId(msg,sid,"send")

   def getChatHistoryFromClient(self,msg,client):
      sid=client.subjectID
      if sid=="monitor": sid="experimenter"
      self.updateRecentChats(sid,"NA")
      self.sendChatToClient(sid)