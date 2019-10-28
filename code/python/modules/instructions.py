from __future__ import print_function,division,absolute_import   
import pickle
import json
import time
from twisted.internet import reactor
import random
from mutagen.mp3 import MP3

class SteepInstructions():
   def __init__(self):
      "self.doNothering=1"
      self.instructionsAudioFile=self.config['domain']+self.config['currentExperiment']+self.config['instructionsFolder']+"/generatedFiles/output.mp3"
      self.instructionsFinishedCaption="Instructions Finished. Please wait patiently for experiment to continue."
      #so video can be like a regular subject with a status
      self.instructionsPlaybackSpeed=1
      self.createSubject("video")
      self.getInstructionsDuration()
      self.getInstructionsTasks()
      self.getInstructionsCaptions()
      self.taskCalls={}
      self.captionCalls={}



   def toggleInsructionsPauseOnClient(self,message,client):
      sid=client.subjectID
      if self.data[sid].instructionsPlaying==1:
         timeIN=time.time()-self.data[sid].instructionsStartTime
         params={}
         params['startTime']="%.02f"%(timeIN)
         self.cancelInstructionsCalls(sid)
         self.setURLParameters(params,sid,"send")
         self.runJavascriptFunction("pauseInstructions",sid,"send")
         self.data[sid].instructionsPlaying=0
      else:
         timeIN=self.data[sid].queryParameters["startTime"][0]
         self.instructionsDemo(sid,float(timeIN))


   def changeInstructionsTime(self,message,client):
      sid=client.subjectID
      if sid=="monitor":
         sid="allPlusVideo"
      if "amount" in message:
         timeIN=min(self.instructionsLength-30,max(0,time.time()-self.data[sid].instructionsStartTime+message['amount']))
         self.setURLParameters(params,sid,"send")
      elif "percentage" in message:
         timeIN=self.instructionsLength*message['percentage']
      params={}
      params['startTime']="%.02f"%(timeIN)
      self.cancelInstructionsCalls(sid)
      self.instructionsDemo(sid,timeIN)

   def changeInstructionsTimeFromMonitor(self,message,client):
      sid="allPlusVideo"
      self.stopInstructions({},{})
      timeIN=self.instructionsLength*message['percentage']
      self.data['instructionsTime']=timeIN
      self.playInstructions()


   def instructionsDemo(self,sid,timeIN=0):
      if timeIN==0 and "startTime" in self.data[sid].queryParameters:
         timeIN=float(self.data[sid].queryParameters["startTime"][0])

      if timeIN>self.instructionsLength:
         timeIN=0

      print("DMO");
      msgs=[]

      msgList=self.loadInstructionsOnClient(sid,"return")
      msgs+=msgList

      #draw cursor overlay
      msgList=self.runJavascriptFunction("drawCursorOverlay",sid,"return")
      msgs+=msgList

      #draw caption overlay
      msgList=self.runJavascriptFunction("drawCaptionOverlay",sid,"return")
      msgs+=msgList
      
      #draw instructions timer
      msgList=self.drawInstructionsTimer(sid,"return")
      msgs+=msgList

      for s in self.getSubjectIDList(sid):
         self.data[s].instructionsPlaying=1   
      msgList=self.runJavascriptFunction("clearAllInstructions",sid,"return")
      msgs+=msgList

      #dont end instructions for demo
      #      self.initializeTimer(sid,self.instructionsLength,self.endInstructions)

      self.initializeTimer(sid,self.instructionsLength,self.endInstructions)
      self.data['timers'][sid]=[time.time(),time.time()-timeIN,self.instructionsLength]
      # self.data[sid].timer=[time.time(),time.time()-timeIN,self.instructionsLength]
      print(self.data['timers'][sid])
      kwargs={"sid":sid}

      [taskMsgs,index,timeToNext]=self.catchUpTasks(sid,timeIN)
      for s in self.getSubjectIDList(sid):
         self.data[s].taskIndex=index
      self.taskCalls[sid]=reactor.callLater(float(timeToNext)/self.instructionsPlaybackSpeed,self.runAnotherTask,**kwargs)
      msgs+=taskMsgs

      [msgList,index,timeToNext]=self.catchUpCaptions(sid,timeIN)
      for s in self.getSubjectIDList(sid):
         self.data[s].captionIndex=index
      self.captionCalls[sid]=reactor.callLater(float(timeToNext)/self.instructionsPlaybackSpeed,self.displayCaption,**kwargs)
      msgs+=msgList

      msgList=self.startAudio(sid,"return",timeIN)
      msgs+=msgList

      msgList=self.runJavascriptFunction("drawInstructionsControls",sid,"return")
      msgs+=msgList

      self.sendListOfMessages(msgs)

   def getInstructionsTasks(self):
      filename=self.config['webServerRoot']+self.config['currentExperiment']+self.config['instructionsFolder']+"/generatedFiles/taskTimes.json"
      file = open(filename,'r')
      self.taskTimes=json.load(file)
      file.close() 
      self.data['taskIndex']=-1

      filename=self.config['webServerRoot']+self.config['currentExperiment']+self.config['instructionsFolder']+"/generatedFiles/tasksOut.json"
      file = open(filename,'r')
      self.tasks=json.load(file)
      file.close() 
 
   def getInstructionsCaptions(self):
      #is a list of lists with [caption,time to next,total time at end of this caption display]
      filename=self.config['webServerRoot']+self.config['currentExperiment']+self.config['instructionsFolder']+"/generatedFiles/captions.json"
      file = open(filename,'r')
      self.captions=json.load(file)
      file.close() 
      self.captions.append([self.instructionsFinishedCaption,100000,100000])
      self.data['captionIndex']=-1

   def getInstructionsDuration(self):
      instructionLength=MP3(self.config['webServerRoot']+self.config['currentExperiment']+self.config['instructionsFolder']+"/generatedFiles/output.mp3").info.length
      # instructionLength=MP3(self.instructionsAudioFile)
      self.instructionsLength=float(instructionLength)/self.instructionsPlaybackSpeed
      self.instructionsLength+=10#add 10 second buffer at end.  

   def getCurrentInstructionsTime(self):
      #sets self.instructionsTime
      if self.data['serverStatus']['instructions']['playing']==1:   
         self.data['instructionsTime']=time.time()-self.data['instructionsStartTime']

   def setInstructionsStartTime(self):
      #sets self.instructionsStartTime
      if self.data['serverStatus']['instructions']['playing']==1:   
         self.data['instructionsStartTime']=time.time()-self.data['instructionsTime']

   def reconnectInstructions(self,sid="all",output="send",timeIN="none"):
      print("reconnecting "+sid)
      msgs=[]
      msgList=self.loadInstructionsOnClient(sid,"return")
      msgs+=msgList

      #draw cursor overlay
      msgList=self.runJavascriptFunction("drawCursorOverlay",sid,"return")
      msgs+=msgList

      #draw caption overlay
      msgList=self.runJavascriptFunction("drawCaptionOverlay",sid,"return")
      msgs+=msgList
      
      #draw instructions timer
      msgList=self.drawInstructionsTimer(sid,"return")
      msgList=self.drawInstructionsTimer("allPlusVideo","return")
      msgs+=msgList



      [taskMsgs,index,timeToNext]=self.catchUpTasks(sid,timeIN)
      msgs+=taskMsgs
      
      [msgList,index,timeToNext]=self.catchUpCaptions(sid,timeIN)
      msgs+=msgList

      if self.data['serverStatus']['instructions']['playing']==1:   
         msgList=self.startAudio(sid,"return")
         msgs+=msgList
      else:
         # self.initializeTimer("all",self.instructionsLength,self.endInstructions)
         self.data['timer']=[time.time(),time.time()-self.data['instructionsTime'],self.instructionsLength]
         msgList=self.runJavascriptFunction("pauseInstructions",sid,"return")
         msgs+=msgList

      self.sendListOfMessages(msgs)

   def loadInstructions(self,message,client):
      #this ensures that the server knows that the instructions are loaded
      print("Loading Instructions....")
      self.data['serverStatus']['page']="instructions"
      self.data['instructionsTime']=0
      self.data['instructionsStartTime']=0

      self.data['serverStatus']['instructions']['lastCaption']=self.captions[0][0]
      self.data['serverStatus']['instructions']['loaded']=1
      self.loadInstructionsOnClient("allPlusVideo")
      self.monitorMessage()
      self.updateTaskTable()

   def loadInstructionsOnClient(self,sid="all",output="send"):
      print(len(self.data['subjectIDs']))
      print("Loading Instructions on client....",sid)
      messages=[]

      # def sendListOfMessages(self,messages):
      # def messageToId(self,msg,sid="all",output="send"):



      #update status message
      for s in self.getSubjectIDList(sid):
         self.data[s].status['page']="generic"
         self.data[s].status['message']=["The instruction video will start shortly...."]
      msgList=self.updateStatus(sid,"return")
      messages+=msgList

      #load Instructions message
      msg={}
      msg['type']="loadInstructions"
      msg['source']=self.instructionsAudioFile
      msg['length']=self.instructionsLength
      msgList=self.messageToId(msg,sid,"return")
      messages+=msgList

      # #Load Click moved to load instructions
      # msgList=self.runJavascriptFunction("loadClickSound",sid,"return")
      # messages+=msgList


      if output=="send":
         self.sendListOfMessages(messages)
      elif output=="return":
         return messages

   def runJavascriptFunction(self,functionName,sid="all",output="send"):
      msg={}
      msg['type']=functionName
      return self.messageToId(msg,sid,output)



   def placeCursor(self,x,y,sid="all",output="send"):
      msg={}
      msg['type']='placeCursor'
      msg['x']=x
      msg['y']=y
      return self.messageToId(msg,sid,output)

   def changeCaptionBottom(self,y,sid="all",output="send"):
      msg={}
      msg['type']='changeCaptionBottom'
      msg['y']=y
      return self.messageToId(msg,sid,output)

   def moveCursor(self,endX,endY,time=0.5,delay=0,sid="all",output="send"):
      msg={}
      msg['type']='moveCursor'
      msg['endX']=endX
      msg['endY']=endY
      msg['time']=time
      msg['delay']=delay
      return self.messageToId(msg,sid,output)


   def moveCursorToDiv(self,divName,time=0.5,delay=0,anchor="none",sid="all",output="send"):
      msg={}
      msg['type']='moveCursorToDiv'
      msg['anchor']=anchor
      msg['divName']=divName
      msg['time']=time
      msg['delay']=delay
      return self.messageToId(msg,sid,output)


   def cursorDown(self,delay,position,sid="all",output="send"):
      msg={}
      msg['type']='cursorDown'
      msg['position']=position
      msg['delay']=delay
      return self.messageToId(msg,sid,output)

   def cursorDownDiv(self,delay,divName,anchor="none",sid="all",output="send"):
      msg={}
      msg['type']='cursorDownDiv'
      msg['divName']=divName
      msg['anchor']=anchor
      msg['delay']=delay
      print(sid,output)
      print("Cursordown")
      return self.messageToId(msg,sid,output)

   def mouseSequence(self,sequence,sid="all",output="send"):
      kwargs={"sid":sid,"output":"return"}
      msgs=[]
      sequenceTime=0
      currentPosition=[0,0]
      for s in sequence:
         if s[0]=="place":
            msgList=self.placeCursor(s[1],s[2],**kwargs)
            msgs+=msgList
            currentPosition=[s[1],s[2]]
         elif s[0]=="toPoint":
            msgList=self.moveCursor(s[1],s[2],s[3],sequenceTime,**kwargs)
            msgs+=msgList
            sequenceTime+=s[3]
            currentPosition=[s[1],s[2]]
         elif s[0]=="toDiv":
            for kw in kwargs:
               s[1][kw]=kwargs[kw]
            s[1]['delay']=sequenceTime
            msgList=self.moveCursorToDiv(**s[1])
            msgs+=msgList
            if "time" not in s[1]:
               thisTime=0.5
            else:
               thisTime=s[1]['time']

            sequenceTime+=thisTime
         elif s[0]=="click" or s[0]=="clickDiv":
            if s[0]=="click":
               msgList=self.cursorDown(sequenceTime,currentPosition,**kwargs)
               msgs+=msgList
            elif s[0]=="clickDiv":
               theseArgs={}
               for kw in ['divName','anchor']:
                  if kw in s[1]:
                     theseArgs[kw]=s[1][kw]
               for kw in ['sid','output']:
                  theseArgs[kw]=kwargs[kw]
               theseArgs['delay']=sequenceTime
               msgList=self.cursorDownDiv(**theseArgs)
               msgs+=msgList

            clickArgs={}
            clickArgs['func']=s[1]['func']
            clickArgs['args']=s[1]['args']
            clickArgs['sid']=sid
            clickArgs['output']="send"
            self.taskCalls[sid]=reactor.callLater(float(sequenceTime+.15)/self.instructionsPlaybackSpeed,self.runSingleTask,**clickArgs)
            sequenceTime+=.65

      if output=="send":
         self.sendListOfMessages(msgs)
      else:
         return msgs

   def startAudio(self,sid="all",output="send",timeIN="none"):
      #self.instructionsTime should be set before this is run
      if timeIN=="none" or sid in ["all","allPlusVideo"]:
         timeIN=self.data['instructionsTime']
         self.data['instructionsStartTime']=time.time()-timeIN
      else:
         self.data[sid].instructionsStartTime=time.time()-timeIN

      msg={}
      msg['currentTime']=timeIN
      msg['playbackRate']=self.instructionsPlaybackSpeed
      msg['type']='startAudio'
      return self.messageToId(msg,sid,output)

   def changeBackgroundColor(self,color,sid="all",output="send"):
      msg={}
      msg['type']='changeBackgroundColor'
      msg['color']=color
      return self.messageToId(msg,sid,output)

   def highlightDiv(self,divName,sid="all",output="send"):
      msg={}
      msg['type']='highlightDiv'
      msg['divName']=divName
      return self.messageToId(msg,sid,output)


   def unHighlightDiv(self,divName,sid="all",output="send"):
      msg={}
      msg['type']='unHighlightDiv'
      msg['divName']=divName
      return self.messageToId(msg,sid,output)


   def placeText(self,divID,text,left,top,fontSize,color,fadeTime,textAlign,sid="all",output="send"):
      msg={}
      msg['type']='placeText'
      msg['divid']=divID
      msg['text']=text
      msg['left']=left
      msg['top']=top
      msg['fontSize']=fontSize
      msg['color']=color
      msg['fadeTime']=fadeTime
      msg['textAlign']=textAlign
      return self.messageToId(msg,sid,output)

   def playInstructions(self):
      msgs=[]
      self.data['serverStatus']['instructions']['playing']=1
      # if self.data['serverStatus']['instructions']['loaded']==0   
      self.data['serverStatus']['instructions']['started']=1
      self.data['serverStatus']['instructions']['time']=float(self.data['instructionsTime'])/self.instructionsLength


      #draw cursor overlay
      msgList=self.runJavascriptFunction("drawCursorOverlay","allPlusVideo","return")
      msgs+=msgList

      #draw caption overlay
      msgList=self.runJavascriptFunction("drawCaptionOverlay","allPlusVideo","return")
      msgs+=msgList
      
      #draw instructions timer
      msgList=self.drawInstructionsTimer("allPlusVideo","return")
      msgs+=msgList


      msgList=self.startAudio("allPlusVideo","return")
      msgs+=msgList
      msgList=self.runJavascriptFunction("clearAllInstructions","allPlusVideo","return")
      msgs+=msgList

      # self.initializeTimer("all",self.instructionsLength,self.endInstructions)
      self.initializeTimer("all",self.instructionsLength-self.data['instructionsTime'],self.endInstructions)
      # self.data['timer']=[time.time(),time.time()-self.data['instructionsTime'],self.instructionsLength]

      [taskMsgs,index,timeToNext]=self.catchUpTasks()
      self.data['taskIndex']=index
      kwargs={"sid":"allPlusVideo"}
      self.taskCalls['allPlusVideo']=reactor.callLater(float(timeToNext)/self.instructionsPlaybackSpeed,self.runAnotherTask,**kwargs)
      msgs+=taskMsgs
      [msgList,index,timeToNext]=self.catchUpCaptions()
      self.data['captionIndex']=index

      kwargs={"sid":"allPlusVideo"}
      self.captionCalls['allPlusVideo']=reactor.callLater(float(timeToNext)/self.instructionsPlaybackSpeed,self.displayCaption,**kwargs)
      msgs+=msgList

      self.sendListOfMessages(msgs)
      self.monitorMessage()
      self.updateTaskTable()



   def resumeInstructions(self,message,client):
      self.playInstructions()

   def restartInstructions(self,message,client):
      if self.data['serverStatus']['instructions']['playing']==1:
         self.stopInstructions({},{})
      for sid in ['video']+self.data['subjectIDs']:
         self.data[sid].status['page']="generic"
         self.data[sid].status['message']=["The instruction video will start shortly...."]
         self.updateStatus(sid)


      self.data['instructionsTime']=0
      self.data['serverStatus']['instructions']['time']=float(self.data['instructionsTime'])/self.instructionsLength
      self.data['serverStatus']['instructions']['playing']=0   
      self.monitorMessage()
      self.updateTaskTable()

   def cancelInstructionsCalls(self,sid):
      if sid in self.taskCalls:
         if self.taskCalls[sid].cancelled==0:
            if self.taskCalls[sid].called==0:
               self.taskCalls[sid].cancel()
            else:
               print("trying to cancel already called Task",sid)
      if sid in self.captionCalls:
         if self.captionCalls[sid].cancelled==0:
            if self.captionCalls[sid].called==0:
               self.captionCalls[sid].cancel()
            else:
               print("trying to cancel already called Caption",sid)

   def stopInstructions(self,message,client):
      self.cancelInstructionsCalls("allPlusVideo")
      self.runJavascriptFunction("pauseInstructions","allPlusVideo","send")
      self.data['instructionsTime']=time.time()-self.data['instructionsStartTime']
      self.data['serverStatus']['instructions']['time']=float(self.data['instructionsTime'])/self.instructionsLength
      self.data['serverStatus']['instructions']['playing']=0   
      self.monitorMessage()
      self.updateTaskTable()


   def runSingleTask(self,func,args,sid="all",output="send"):
      args['sid']=sid
      args['output']="return"
      thisFunction = getattr(self,func)
      msgList=thisFunction(**args)
      if output=="send":
         self.sendListOfMessages(msgList)
      else:
         return msgList

   def catchUpTasks(self,sid="all",timeIN="none"):
      print("catchUpTasks")
      if timeIN=="none":
         self.getCurrentInstructionsTime()
         timeIN=self.data['instructionsTime']
      print(timeIN) 
      toBeRun=[{"func":"runJavascriptFunction","args":{"functionName":"clearAllInstructions"}}]
      lastPosition=[-23,-23]
      for index in range(len(self.taskTimes)):
         taskTime=self.taskTimes[index]
         thisTask=self.tasks[index]
         if taskTime<timeIN:
            if "args" in thisTask:
               if "functionName" in thisTask['args']:
                  if thisTask['args']['functionName']=="clearAllInstructions":
                     toBeRun=[]
                     lastPosition=[-23,-23]
            if thisTask['func']=="mouseSequence":
               thisSequence= thisTask['args']['sequence']
               for k in thisSequence:
                  if k[0]=="place":
                     lastPosition=[k[1],k[2]]
                  elif k[0]=="place":
                     lastPosition=[k[1],k[2]]
                  elif k[0]=="toDiv":
                     lastPosition=["div",k[1]["divName"]]
                  elif k[0]=="click" or k[0]=="clickDiv":
                     clickArgs={}
                     clickArgs['func']=k[1]['func']
                     clickArgs['args']=k[1]['args']
                     clickArgs['args']['sid']=sid
                     toBeRun.append(clickArgs)
            else:
               toBeRun.append(thisTask)
         else:
            #all tasks after time don't need to be looked at
            break
            #index is the index of the next task to be run.

      #place cursor:
      if lastPosition==[-23,-23]:
         "do nothing"
      elif lastPosition[0]=="div":
         this={"func":"mouseSequence","args":{"sequence":[["toDiv",{"divName":lastPosition[1],"time":0}]]}}
         toBeRun.append(this)
      else:
         this={"func":"placeCursor","args":{"x":lastPosition[0],"y":lastPosition[1]}}
         toBeRun.append(this)


      messages=[]
      for task in toBeRun:
         msgList=self.runSingleTask(task['func'],task['args'],sid,"return")
         messages+=msgList

      timeToNextTask=self.taskTimes[index]-timeIN
      return [messages,index-1,timeToNextTask]


   def testRunAnotherTask(self,message,client):
      thisIndex=self.data['taskIndex']
      if "testInstructionTimeIndex" not in self.data:
         self.data['testInstructionTimeIndex']=0

      timeForThisTask=float(self.taskTimes[self.data['testInstructionTimeIndex']])-.1
      self.data['instructionsTime']=timeForThisTask
      self.data['serverStatus']['instructions']['playing']=1
      self.reconnectInstructions("allPlusVideo","send",timeForThisTask)
      self.data['testInstructionTimeIndex']+=1

   def runAnotherTask(self,sid="all"):
      runTask=0
      if self.config['serverType']=="regularExperiment":
         self.data['taskIndex']+=1
         thisIndex=self.data['taskIndex']
         sendToWho="allPlusVideo"
         runTask=1
      elif self.config['serverType']=="demoExperiment":
         if sid in self.data:
            self.data[sid].taskIndex+=1
            thisIndex=self.data[sid].taskIndex
            sendToWho=sid
            runTask=1
      if runTask==1:
         timeForThisTask=float(self.taskTimes[thisIndex])
         task=self.tasks[thisIndex]
         msgList=self.runSingleTask(task['func'],task['args'],sendToWho,"send")
         # self.getCurrentInstructionsTime()

         if thisIndex<len(self.taskTimes)-1:
            timeForNextThisTask=float(self.taskTimes[thisIndex+1])
            timeToNext=timeForNextThisTask-timeForThisTask
            kwargs={"sid":sid}
            self.taskCalls[sid]=reactor.callLater(float(timeToNext)/self.instructionsPlaybackSpeed,self.runAnotherTask,**kwargs)
         self.updateInstructionTimeToMonitor(sid)

   def catchUpCaptions(self,sid="all",timeIN="none"):
      if timeIN=="none":
         self.getCurrentInstructionsTime()
         timeIN=self.data['instructionsTime']
      for index in range(len(self.captions)):
         caption=self.captions[index]
         if caption[-1]>timeIN:
            break
      currentCaption=self.captions[index][0]
      timeToNext=self.captions[index][-1]-timeIN
      msgList=self.setCaption(currentCaption,sid,"return")
      return [msgList,index,timeToNext]

   def updateInstructionTimeToMonitor(self,sid="all"):
      if sid=="all" or sid=="allPlusVideo":
         self.data['instructionsTime']=time.time()-self.data['instructionsStartTime']
         self.data['serverStatus']['instructions']['time']=float(self.data['instructionsTime'])/self.instructionsLength
      else:
         self.data[sid].instructionsTime=time.time()-self.data[sid].instructionsStartTime
         self.data['serverStatus']['instructions']['time']=float(self.data[sid].instructionsTime)/self.instructionsLength

      self.monitorMessage()
      self.updateTaskTable()



   def drawInstructionsTimer(self,sid="all",output="send"):
      msg={}
      msg['type']='drawInstructionsTimer'
      if sid=="allPlusVideo":
         msg['whichTimer']="all"      
      else:
         msg['whichTimer']=sid      
      # if self.config['serverType']=="regularExperiment":
      #    msg['whichTimer']="all"         
      # elif self.config['serverType']=="demoExperiment":
      #    msg['whichTimer']="selfTimer"
      return self.messageToId(msg,sid,output)


   def setCaption(self,caption,sid="all",output="send"):
      msg={}
      msg['type']='setCaptions'
      msg['caption']=caption
      msg['length']=self.instructionsLength
      if sid=="allPlusVideo":
         msg['whichTimer']="all"      
      else:
         msg['whichTimer']=sid      
      return self.messageToId(msg,sid,output)

   def resyncAudio(self,sid="all",output="send"):
      # self.data['timers']['all'][1]+=1
      msg={}
      msg['type']='resyncAudio'
      msg['length']=self.instructionsLength
      if sid=="allPlusVideo":
         msg['whichTimer']="all"      
      else:
         msg['whichTimer']=sid      
      return self.messageToId(msg,sid,output)

   def displayCaption(self,sid="all"):
      setCaption=0
      if self.config['serverType']=="regularExperiment":
         self.data['captionIndex']+=1
         thisIndex=self.data['captionIndex']
         sendToWho="allPlusVideo"
         setCaption=1
      elif self.config['serverType']=="demoExperiment":
         if sid in self.data:
            self.data[sid].captionIndex+=1
            thisIndex=self.data[sid].captionIndex
            sendToWho=sid
            setCaption=1
      if setCaption==1:
         thisCaption=self.captions[thisIndex][0]
         timeToNext=float(self.captions[thisIndex][1])
         self.setCaption(thisCaption,sendToWho,"send")

         if self.captions[thisIndex][0]==self.instructionsFinishedCaption:
            'do nothing'
         else:      
            kwargs={"sid":sid}
            self.captionCalls[sid]=reactor.callLater(float(timeToNext)/self.instructionsPlaybackSpeed,self.displayCaption,**kwargs)
         self.data['serverStatus']['instructions']['lastCaption']=thisCaption
         self.updateInstructionTimeToMonitor(sid)


   def endInstructionsMessage(self,message,client):
      self.stopInstructions({},{})
      self.endInstructions()
   
   def endInstructions(self):
      print("Instructions Finished")
      self.data['serverStatus']['instructions']['started']=0
      self.data['serverStatus']['instructions']['loaded']=0
      self.data['serverStatus']['instructions']['playing']=0
      self.data['serverStatus']['instructions']['finished']=1
      self.data['serverStatus']['page']="none"
      self.monitorMessage()
      self.updateTaskTable()
      msg={}
      msg['type']="endInstructions"
      # for sid in self.getSubjectIDList("allPlusVideo"):
      #    self.data[sid].status["page"]="generic"
      #    self.data[sid].status["message"]=["The Instructions Have Ended. <br> Plese wait for experiment to continue."]
      return self.messageToId(msg,"allPlusVideo","send")

