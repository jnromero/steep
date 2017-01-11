import os
from twisted.python import log
import time

#start the logger
class TwistedLogger:
   def __init__(self,folder):
      self.folder=folder+"/logs/"
      self.fileCount=1
      self.filename=self.folder+"/%s.log"%(self.fileCount)
      if not os.path.exists(self.folder):
         os.makedirs(self.folder)
      # file = open(self.filename,'w')
      # file.close() 
      log.startLogging(open(self.folder+'/fullLog.log', 'w'))#,setStdout=False)
      log.addObserver(self.writeToFile)

   def writeToFile(self,this):
      dateString=time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(this['time']))
      if 'log_namespace' not in this:
         thisString=str(this)
      elif this['isError']==1:
         if 'log_text' in this:
            thisString="<p class='stdErr consoleLine'>%s - %s</p>\n"%(dateString,this['log_text'].split("\n")[0])
            for k in this['log_text'].split("\n")[1:]:
               k=k.replace(" ","&nbsp;&nbsp;")
               thisString=thisString+"<p class='stdErr subLine consoleLine'>%s</p>\n"%(k)
         else:
            thisString="<p class='stdErr consoleLine'>%s - %s</p>\n"%(dateString,this['log_io'])
      elif this['log_namespace']=='stdout':
         thisString="<p class='stdOut consoleLine'>%s - %s</p>\n"%(dateString,this['log_io'])
      elif this['log_namespace']=='twisted.python.log':
         thisString="<p class='stdTwisted consoleLine'>%s - %s</p>\n"%(dateString,this['log_io'])
         thisString=thisString+str(this)
         if this['log_io'].find("\"GET")>-1:
            thisString=""

      else:
         if "log_text" in this:
            thisString="<p class='stdOther consoleLine'>%s - %s</p>\n"%(dateString,this['log_text'])
         elif "log_format" in this:
            thisString="<p class='stdOther consoleLine'>%s - %s</p>\n"%(dateString,this['log_format'])
         else:
            thisString="<p class='stdOther consoleLine'>%s - %s</p>\n"%(dateString,this['message'])


      file = open(self.filename,'a')
      file.writelines(thisString)
      file.close() 

      file = open(self.filename,'r')
      fileData=file.read()
      file.close() 
      if fileData.count("\n")>500:
         self.fileCount=self.fileCount+1
         self.filename=self.folder+"/%s.log"%(self.fileCount)
         file = open(self.filename,'w')
         file.close() 
      self.log = open(self.filename, "a")
