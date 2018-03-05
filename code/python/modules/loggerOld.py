from __future__ import print_function,division,absolute_import   
import os
from twisted.python import log
import time
import sys
import pickle 

#start the logger
class TwistedLogger:
   def __init__(self,config):
      self.fileCount=1
      self.entries=0
      self.fullLogFile=config['fullLogFile']
      self.currentLogFile=config['logFolder']+"/log!!!NUMBERHERE!!!.pickle"
      # log.startLogging(open(self.fullLogFile,'ab'))#,setStdout=False)
      log.startLogging(sys.stdout,setStdout=True)
      log.addObserver(self.writeToFile)

   def addLine(self,thisType,thisLine):
      toAdd=(time.time(),thisType,thisLine)
      self.entries+=1

      file = open(self.fullLogFile,'ab')
      #protocol for python 3 compatibility
      pickle.dump(toAdd,file,protocol=2)
      file.close() 

      thisFile=self.currentLogFile.replace("!!!NUMBERHERE!!!",str(self.fileCount))
      file = open(thisFile,'ab')
      #protocol for python 3 compatibility
      pickle.dump(toAdd,file,protocol=2)
      file.close() 
      
      if self.entries>500:
         self.entries=0
         self.fileCount+=1

   def writeToFile(self,this):
      if 'log_namespace' not in this:
         self.addLine("regular",str(this))
      elif this['isError']==1:
         if 'log_text' in this:
            for k in this['log_text'].split("\n"):
               self.addLine("stdErr",k)
         else:
            self.addLine("stdErr",str(this['log_io']))
      elif this['log_namespace']=='stdout':
         self.addLine("stdOut",str(this['log_io']))
      elif this['log_namespace']=='twisted.python.log':
         if this['log_io'].find("\"GET")>-1:
            thisLine=""
         else:
            self.addLine("stdTwisted",str(this['log_io']))
            self.addLine("stdTwisted",str(this))
      else:
         if "log_text" in this:
            self.addLine("stdOther",str(this['log_text']))
         elif "log_format" in this:
            self.addLine("stdOther",str(this['log_format']))
         else:
            self.addLine("stdOther",str(this['message']))

