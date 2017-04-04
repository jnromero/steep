from __future__ import print_function,division,absolute_import   
import os
from twisted.python import log
import time
import sys
import pickle 


class logCounter():
   def __init__(self):
      self.counter=0
      self.fileCount=1
      self.totalCounter=0
      self.currentTab=1

   def increment(self):
      self.counter+=1
      self.totalCounter+=1
      out=False
      if self.counter>500:
         self.fileCount+=1
         self.counter=0
         out=True
      return out

def createBlankFile(filename):
   file = open(filename,'wb')
   file.close() 


def getFilenames(config,fileCount):
   txtFile=config['logFolder']+"/txt/%s.txt"%(fileCount)
   pickleFile=config['logFolder']+"/pickle/%s.pickle"%(fileCount)
   return [txtFile,pickleFile]

def newFiles(config,fileCount):
   [txtFile,pickleFile]=getFilenames(config,fileCount)
   createBlankFile(txtFile)
   createBlankFile(pickleFile)
   return [txtFile,pickleFile]

class SteepLogger(object):
   def __init__(self,stream,streamType,config,thisCounter,consoleMessage):
      self.stream=stream
      self.config=config
      self.counter=thisCounter
      self.type=streamType#stdErr or stdOut
      self.consoleMessage=consoleMessage
      [self.txtFile,self.pickleFile]=newFiles(self.config,self.counter.fileCount)
      self.newLine()

   def newLine(self):
      self.currentLine=""

   def write(self,obj,**kwargs):
      #open files for appending
      tFile = open(self.txtFile,'ab')
      pFile = open(self.pickleFile,'ab')
      #split into lines
      lines=obj.split("\n")
      if "type" in kwargs:
         thisType=kwargs['type']
      else:
         thisType=self.type
      for k in range(len(lines)):
         self.currentLine+=lines[k]
         if k<len(lines)-1:
            #write to text file
            tFile.write(self.currentLine+"\n")
            #write to pickle file ([type,line,linecounter,kwargs])
            pickle.dump([thisType,self.currentLine.replace(" ","&nbsp;&nbsp;"),self.counter.totalCounter,kwargs],pFile,protocol=2)
            #write to console
            self.stream.write(thisType+" "*(15-len(thisType))+"   "+self.currentLine+"\n")
            self.stream.flush()
            self.currentLine=""
            if self.counter.increment():
               [self.txtFile,self.pickleFile]=newFiles(self.config,self.counter.fileCount)
      tFile.close() 
      pFile.close() 
      self.consoleMessage()

   def flush(self):
      self.stream.flush()



# class SteepTwistedLogger(object):
#    def __init__(self,config,thisCounter,monitorMessage):
#       self.config=config
#       self.counter=thisCounter
#       self.monitorMessage=monitorMessage
#       self.newLine()
#       [self.txtFile,self.pickleFile]=getFilenames(config,self.counter.fileCount)

#    def newLine(self):
#       self.currentLine=""

#    def write(self,obj,messageType,**kwargs):
#       #open files for appending
#       tFile = open(self.txtFile,'ab')
#       pFile = open(self.pickleFile,'ab')
#       #split into lines
#       lines=obj.split("\n")
#       print("sdfsdf",lines)
#       for k in range(len(lines)):
#          self.currentLine+=lines[k]
#          if k<len(lines)-1:
#             #write to text file
#             tFile.write(self.currentLine+"\n")
#             #write to pickle file ([type,line,linecounter,kwargs])
#             pickle.dump([messageType,self.currentLine,self.counter.totalCounter,kwargs],pFile,protocol=2)
#             #write to console
#             sys.stdout.write(messageType+"   "+self.currentLine+"\n")
#             self.currentLine=""
#             if self.counter.increment():
#                [self.txtFile,self.pickleFile]=newFiles(self.config,self.counter.fileCount)
#       tFile.close() 
#       pFile.close() 
#       self.monitorMessage()

#    def flush(self):
#       self.stream.flush()




def twistedObserver(eventDict):
   kwargs={"type":"twisted"}
   if 'log_namespace' not in eventDict:
      sys.stdout.write(eventDict+"\n",**kwargs)
   elif eventDict['isError']==1:
      kwargs={"type":"twistedError"}
      if 'log_text' in eventDict:
         for k in eventDict['log_text'].split("\n"):
            sys.stdout.write(k+"\n",**kwargs)
      else:
         sys.stdout.write(eventDict['log_io']+"\n",**kwargs)
   elif eventDict['log_namespace']=='stdout':
      sys.stdout.write(eventDict['log_io']+"\n",**kwargs)
   elif eventDict['log_namespace']=='twisted.python.log':
      if eventDict['log_io'].find("\"GET")==-1:
         sys.stdout.write(eventDict['log_io']+"\n",**kwargs)

   else:
      if "log_text" in eventDict:
         sys.stdout.write(eventDict['log_text']+"\n",**kwargs)
      elif "log_format" in eventDict:
         sys.stdout.write(eventDict['log_format']+"\n",**kwargs)
      else:
         sys.stdout.write(eventDict['message']+"\n",**kwargs)




def log(text,**kwargs):
   print(text)

