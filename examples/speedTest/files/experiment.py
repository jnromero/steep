#file: experiment.py
#this is where you will define the experimentClass class, subjectClass class, and monitorClass class
from __future__ import print_function
import os

class experimentClass():
   # - the dictionary self.data will be stored automatically every 10 seconds.
   # - store data in self.data[subjectID] which is a Subject class (defined below)
   # - send messages like self.customMessage(subjectID,msg)
   # - list of all subjects at self.data['subjectIDs']
   def __init__(self):
      # initialize the class
      self.setParameters()
      #these are function that can be run by clicking a button on the monitor page
      self.monitorTaskList=['startExperiment']
   def setParameters(self):
      self.data['exchangeRate']=.1
      self.currentMatch=-1
      self.currentClicks=-1
 
   def sendParameters(self,sid):
      msg={}
      msg['payoffVariable']=2
      msg['type']="sendParameters"
      self.customMessage(sid,msg)

   def notAcceptingClientsAnymore(self):
      #This is run when you stop accepting clients.  This is where you might want to do your random matching, or randomly determine parameters for the experiment.
      print(self.data['subjectIDs'])
   
   def reconnectingClient(self,client):
      #This function is needed, DO NOT DELETE
      sid=client.subjectID
      self.sendParameters(sid)
      self.updateStatus(sid)

   def startExperiment(self,message,client):
      #this is run when you click the "start Experiment" button on the monitor page.
      self.taskDone(message)
      
      #this sets the monitor table as defined in the function below
      self.experimentSpecificMonitorTableEntries()
      #this updates the monitor table
      self.monitorMessage()

      self.startMatch()
      print("Starting Experiment!")

   def startMatch(self):
      #add 1 to self.currentMatch
      self.currentMatch+=1
      #set current clicks for this match to 0
      self.currentClicks=0
      #this starts a timer for all subject that lasts 120 seconds and runs the function self.endMatch after it expires. 
      self.initializeTimer("all","everyoneTimer",120,self.endMatch)
      #update status of all clients
      for sid in self.data['subjectIDs']:
         self.data['subjects'][sid].matchClicks=0
         self.data['subjects'][sid].status={"page":"game","numberClicks":0,"currentMatch":self.currentMatch,"warning":"no"}
         self.updateStatus(sid)
      #update monitor screen:
      self.monitorMessage()

   def makeChoice(self,message,client):
      #this function is run when the sever receives a message from a client such that message['type']="makeChoice"
      #get subjectID
      sid=client.subjectID
      #Add 1 to the number of currentClicks for self.currentMatch
      self.currentClicks+=1
      self.data['subjects'][sid].matchClicks+=1
      #Record the data to self.data to be saved. This adds a list [currentMatch,#clicks] to self.data['subjects'][sid].choices     
      self.data['subjects'][sid].choices.append([self.currentMatch,self.currentClicks])
      #start a self timer "can be called anything"
      self.initializeTimer(sid,"myTimeCanBeLabledAnything",5,self.highlightMakeChoice,sid)

      #Check if there are more than 10 clicks, if so run self.endMatch, otherwise, run self.updateClicks      
      if self.currentClicks>10000:
         self.endMatch()
      else:
         self.updateClicks()

      #update monitor screen:
      self.monitorMessage()


   def highlightMakeChoice(self,sid):
      self.data['subjects'][sid].status['warning']="yes"
      self.updateStatus(sid)

   def updateClicks(self):
      #update status of all clients
      msg={}
      msg['type']="updateNumberClicks"
      msg['number']=self.currentClicks
      self.messageToId(msg,sid="all")

   def endMatch(self):
      #wait 10 seconds, and then run self.startMatch to start the next match
      self.initializeTimer("all","timer",10,self.startMatch)
      #update status of all clients
      # messageToId(self,msg,sid="all",output="send"):
      for sid in self.data['subjectIDs']:
         self.data['subjects'][sid].status={"page":"postMatch","stage":"noChoices"}
         self.updateStatus(sid)
      

   def experimentSpecificMonitorTableEntries(self):
      self.currentMonitorTable="experiment"
      self.data['monitorTableInfo']['experiment']=[
      ['page'           ,'self.data["subjects"][sid].status["page"]'],
      ['stage'          ,'self.data["subjects"][sid].status["stage"]'],
      ['Match#'         ,'self.currentMatch'],
      ['My Clicks'      ,'self.data["subjects"][sid].matchClicks'],
      ['Total Clicks'   ,'self.currentClicks'],
      ]
      self.newMonitorTable()


class subjectClass():
   def __init__(self):
      #the subjectID is automatically defined in server.py, and can be accessed with self.subjectID
      #every time the client clicks the button will be recorded here.
      self.choices=[]
      #the total payoffs are recorded here
      self.totalPayoffs=0
      #the subject status is initialized here.  Any time this is changed, you can update the client with self.updateStatus(subjectID)
      self.status={}
      self.status['page']="generic"
      self.status['message']=["Please read, sign, and date your consent form. <br> You may read over the instructions as we wait to begin."]

      #number of clicks this match
      self.matchClicks=0



if __name__ == "__main__":
   import imp
   filename="../../../code/python/server.py"
   completePathToServerDotPyFile=os.path.abspath(filename) 
   server = imp.load_source('server',completePathToServerDotPyFile)
   #python experiment.py -l local -o True -s False


