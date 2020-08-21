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

   def cancelTimerFunction(self,timerAccess,timerName):
      self.initializeTimer(timerAccess,timerName,0)

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
      if duration>0:
         myTimers[timerName]=[time.time(),duration]
         if timerName in myTimerFunctions:
            #if myTimerFunctions[timerName].cancelled==0 and myTimerFunctions[timerName].called==0:
            try:
               myTimerFunctions[timerName].cancel()
            except:
               print("Couldn't cancel timer function for %s/%s"%(timerAccess,timerName)) 
               pass
         if len(args2)>1:
            myTimerFunctions[timerName]=reactor.callLater(*args2)
      else:
         if timerName in myTimers:
            del myTimers[timerName]
         if timerName in myTimerFunctions:
            try:
               myTimerFunctions[timerName].cancel()
            except:
               print("Couldn't cancel timer function for %s/%s"%(timerAccess,timerName)) 
               pass
            del myTimerFunctions[timerName]

   def updateAllTimers(self,startDict,timerAccess):
      out=startDict
      toDelete=[]
      for timer in self.data['timers'].setdefault(timerAccess,{}):
         remaining=self.updateTimer(timerAccess,timer)
         if remaining>=0:
            out[timer]=remaining
         else:
            toDelete.append([timerAccess,timer])
      for k in toDelete:
         del self.data['timers'][k[0]][k[1]]
      return out

   def getPrettyTime(self,timerAccess,timerName):
      remaining=self.updateTimer(timerAccess,timerName)
      minutes=int(remaining/60)
      seconds=remaining%60
      return "%s:%.02f"%(minutes,seconds)

   def updateTimer(self,timerAccess,timerName):
      timer=self.data['timers'].get(timerAccess,{}).get(timerName,None)
      if timer!=None:   
         remaining=timer[1]-(time.time()-timer[0])#duration - (currentTime-startTime)
      else:
         remaining=0
      return remaining

   def updateTimerPretty(self,timerAccess,timerName):
      timer=self.data['timers'].get(timerAccess,{}).get(timerName,None)
      if timer!=None:   
         remaining=int(timer[1]-(time.time()-timer[0]))#duration - (currentTime-startTime)
      else:
         remaining=0
      return str(datetime.timedelta(seconds=remaining))
