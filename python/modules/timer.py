from __future__ import print_function,division,absolute_import   
import time
from twisted.internet import reactor

class SteepTimerManager():
   def __init__(self):
      self.data['timers']={}
      #Cannot Pickle these!!
      self.timerFunctions={}

   def cancelTimerFunction(self,subjectID):
      self.initializeTimer(subjectID,0)

   # self.initializeTimer("all",self.data['preStageLengths'][self.data['currentMatch']],self.startMatch)
   # #self.initializeTimer(sid,5,self.pleaseMakeChoice,sid)

   def initializeTimer(self,*args):
      timerName=args[0]
      duration=args[1]
      args2=args[1:]

      self.data['timers'][timerName]=[time.time(),time.time(),duration]
      if timerName in self.timerFunctions:
         if self.timerFunctions[timerName].cancelled==0 and self.timerFunctions[timerName].called==0:
            self.timerFunctions[timerName].cancel()
      if len(args2)>1:
         self.timerFunctions[timerName]=reactor.callLater(*args2)


      # if subjectID=="all":
      #    self.data['timer']=[time.time(),time.time(),duration]
      #    # print(self.data['timer'])
      #    if self.timerFunctions.cancelled==0 and self.timerFunction.called==0:
      #       self.timerFunction.cancel()
      #    if len(args2)>1:
      #       self.timerFunction=reactor.callLater(*args2)
      # elif subjectID=="all2":
      #    self.data['timer2']=[time.time(),time.time(),duration]
      #    # print(self.data['timer'])
      #    if self.timerFunction2.cancelled==0 and self.timerFunction2.called==0:
      #       self.timerFunction2.cancel()
      #    if len(args2)>1:
      #       self.timerFunction2=reactor.callLater(*args2)
      # else:
      #    self.data[subjectID].timer=[time.time(),time.time(),duration]
      #    if self.subjectTimerFunctions[subjectID].cancelled==0 and self.subjectTimerFunctions[subjectID].called==0:
      #       self.subjectTimerFunctions[subjectID].cancel()
      #    if len(args2)>1:
      #       self.subjectTimerFunctions[subjectID]=reactor.callLater(*args2)

   def updateTimer(self,timer):
      #timer=currentTime,startTime,totalTime
      timer[0]=time.time()
      remaining=timer[2]-(timer[0]-timer[1])
      return remaining