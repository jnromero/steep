from __future__ import print_function,division,absolute_import   
import time

class SteepChatManager():
   def __init__(self):
      self.data['chat']={}

   def chatMessageFromClient(self,message,client):
      sender=message['from']
      receiver=message["to"]

      #keep track of most recent messages
      recent=self.data['chat'].setdefault(sender,{}).setdefault("recent",["everyone"]+self.data['subjectIDs'])
      recent.remove(receiver)
      recent=[receiver]+recent

      recent=self.data['chat'].setdefault(receiver,{}).setdefault("recent",["everyone"]+self.data['subjectIDs'])
      recent.remove(sender)
      recent=[sender]+recent

      #redundant to save time retreiving
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
      msg.['chatInfo']=self.data['chat'].setdefault(sid,{})
      return message

   def sendChatToClient(self,sid):
      msg=self.getChatHistory(sid)
      if sid=="monitor":
         for client in self.monitorClients:
            client.sendMessage(json.dumps(msg).encode('utf8'))
         monitorMessage()
      elif sid=="everyone":
         self.messageToId(msg,"all","send")
      else:
         self.messageToId(msg,sid,"send")

