from __future__ import print_function,division,absolute_import   
import time
from twisted.internet import reactor

class SteepTimerManager():
   def __init__(self):
      self.data['timers']={}
      #Cannot Pickle these!!
      self.timerFunctions={}

   def cancelTimerFunction(self,timerName):
      self.initializeTimer(timerName,0)

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

   def updateTimer(self,timer):
      #timer=currentTime,startTime,totalTime
      timer[0]=time.time()
      remaining=timer[2]-(timer[0]-timer[1])
      return remaining