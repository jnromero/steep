from __future__ import print_function,division,absolute_import   
import time
from twisted.internet import reactor
import datetime
import pytz
class SteepTimerManager():
   def __init__(self):
      self.data['timers']={}
      #Cannot Pickle these!!
      self.timerFunctions={}

   def cancelTimerFunction(self,timerName):
      self.initializeTimer(timerName,0)

   def initializeTimer(self,*args):
      timerAccess=args[0]# all or sid
      timerName=args[1]
      duration=args[2]
      args2=args[2:]
      if isinstance(duration,datetime.datetime):
         utc_now = pytz.utc.localize(datetime.datetime.utcnow())
         duration=(duration-utc_now).total_seconds()
         args2=[duration]+list(args[3:])

      myTimers=self.data['timers'].setdefault(timerAccess,{})
      myTimerFunctions=self.timerFunctions.setdefault(timerAccess,{})

      myTimers[timerName]=[time.time(),duration]
      if timerName in myTimerFunctions:
         if myTimerFunctions[timerName].cancelled==0 and myTimerFunctions[timerName].called==0:
            myTimerFunctions[timerName].cancel()
      if len(args2)>1:
         myTimerFunctions[timerName]=reactor.callLater(*args2)

   def updateTimer(self,timer):
      remaining=timer[1]-(time.time()-timer[0])#duration - (currentTime-startTime)
      return remaining

   def updateTimerPretty(self,timer):
      remaining=int(timer[1]-(time.time()-timer[0]))#duration - (currentTime-startTime)
      return str(datetime.timedelta(seconds=remaining))
