from __future__ import print_function,division,absolute_import   
import time
from twisted.internet import reactor

class SteepTimerManager():
   def __init__(self):
      self.data['timer']=[0,0,0]

      #Cannot Pickle these!!
      self.timerFunction=reactor.callLater(0,self.blank)
      self.subjectTimerFunctions={}

   def cancelTimerFunction(self,subjectID):
      self.initializeTimer(subjectID,0)


   # self.initializeTimer("all",self.data['preStageLengths'][self.data['currentMatch']],self.startMatch)
   # #self.initializeTimer(sid,5,self.pleaseMakeChoice,sid)

   def initializeTimer(self,*args):
      subjectID=args[0]
      duration=args[1]
      args2=args[1:]
      if subjectID=="all":
         self.data['timer']=[time.time(),time.time(),duration]
         print(self.data['timer'])
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