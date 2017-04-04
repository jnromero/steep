from __future__ import print_function,division,absolute_import   
import sys
import imp
import time
import shutil
import os
import webbrowser
functions = imp.load_source('functions', "modules/functions.py")
from twisted.internet import reactor
from twisted.web.server import Site
from autobahn.twisted.websocket import listenWS


#load options module
optionsCommands = imp.load_source('optionsCommands', "modules/optionsCommands.py")
options=optionsCommands.getOptions()

#get server Start Time String.  This is used for log and data files
if options.restart=="False":
   serverStartString=time.strftime("%Y%m%d-%H%M%S",time.localtime(time.time()))
else:
   serverStartString=options.restart

#Save data to temporary file.  This avoids clutter
if options.saveData=="False":
   serverStartString="tmp"

#load the config file
try:  
   settings = imp.load_source('settings',options.configFile)
except:
   sys.exit("ERROR: Config file couldn't be loaded (probably not a python file).\n %s \nYou can see all options by running 'python server.py -h'"%(options.configFile))


#set Location for config
config=settings.setConfig(options.location)
try:
   locationSettings = imp.load_source('locationSettings','../locations/%s.py'%(options.location))
   config=locationSettings.getLocation(config)
except:
   functions.printColor("Warning:","red",["background","flash"])
   functions.printColor("Can't load location file ../locations/%s.py.\n"%(options.location),"red")
config['location']=options.location



#Add serverStartString to config file
config['serverStartString']=serverStartString

#Add server reStartString to config file
restartString=optionsCommands.getRestartString(config)
config['restartString']=restartString


configFunctions = imp.load_source('configFunctions', "modules/configFunctions.py")
config=configFunctions.setOtherFileLocations(config)
configFunctions.writeJavascriptConfigFile(config,options.configFile)


#blank function place holder for furutre monitor message that will be used to update console page on demand
def testFunction():
   "sdfsdf"
logger = imp.load_source('logger',"modules/logger.py")
thisLogCounter= logger.logCounter()
sys.stdout = logger.SteepLogger(sys.stdout,"stdout",config,thisLogCounter,testFunction)
sys.stderr = logger.SteepLogger(sys.stderr,"stderr",config,thisLogCounter,testFunction)

from twisted.python.log import startLogging,addObserver
#This removes regular twisted messages from the console
startLogging(open(config['twistedLogFile'], 'w'),setStdout=False)
#this send all those twisted messages to the logger.twistedObserver function to be parsed and sent to stdout.
addObserver(logger.twistedObserver)
log=sys.stdout.write


#Print TMP data file warning
if options.saveData=="False":
   kwargs={"color":"rgba(150,0,0,1)","backgroundColor":"rgba(255,0,0,.1)","left":"0px","width":"300px","height":"40px","fontSize":"200%","textAlign":"right"}   
   log("Warning:\n",**kwargs)
   kwargs={"color":"rgba(150,0,0,1)","backgroundColor":"rgba(255,0,0,.1)","left":"320px","width":"1100px","fontSize":"200%","textAlign":"left","height":"40px","sameLine":"True"}   
   log("Saving Data to TMP file, and potentially rewriting old tmp data.\n",**kwargs)
   kwargs['sameLine']='False'
   log("This is fine if you are just testing.\n",**kwargs)
   log("Use '-s True' or remove '-s False' to save data to new folder.\n",**kwargs)


#python version
kwargs={"color":"blue","backgroundColor":"rgba(0,0,255,.1)","textAlign":"center","fontSize":"300%","height":"100px"}
log("Running STEEP server.\n",**kwargs)
kwargs={"color":"black","backgroundColor":"rgba(255,255,0,.1)","left":"0px","width":"300px","height":"40px","fontSize":"200%","textAlign":"right"}   
log("Python info:\n",**kwargs)
kwargs={"color":"black","backgroundColor":"rgba(255,255,0,.1)","left":"300px","width":"300px","height":"40px","fontSize":"200%","textAlign":"right","sameLine":"True"}   
log("\tPython version:\n",**kwargs)
kwargs={"color":"orange","backgroundColor":"rgba(255,255,0,.1)","left":"620px","width":"780px","height":"40px","fontSize":"200%","textAlign":"left","sameLine":"True"}   
log(sys.version.split("\n")[0]+"\n",**kwargs)
kwargs={"color":"black","backgroundColor":"rgba(255,255,0,.1)","left":"300px","width":"300px","height":"40px","fontSize":"200%","textAlign":"right","sameLine":"False"}   
log("\tPython executable:\n",**kwargs)
kwargs={"color":"orange","backgroundColor":"rgba(255,255,0,.1)","left":"620px","width":"780px","height":"40px","fontSize":"200%","textAlign":"left","sameLine":"True"}   
log(sys.executable+"\n\n",**kwargs)
kwargs={"color":"black","backgroundColor":"rgba(255,0,255,.1)","left":"0px","width":"300px","height":"40px","fontSize":"200%","textAlign":"right"}   
log("Current IP Addresses:\n",**kwargs)
import netifaces as ni
sameLine="True"
for k in ni.interfaces():
   ni.ifaddresses(k)
   try:  
      # print(ni.ifaddresses(k))
      ip = ni.ifaddresses(k)[2][0]['addr']
      kwargs={"color":"black","backgroundColor":"rgba(255,0,255,.1)","left":"200px","width":"300px","height":"40px","fontSize":"200%","textAlign":"right","sameLine":sameLine}   
      log("%s:\n"%(k),**kwargs)
      kwargs={"color":"red","backgroundColor":"rgba(255,0,255,.1)","left":"520px","width":"780px","height":"40px","fontSize":"200%","textAlign":"left","sameLine":"True"}   
      log("%s\n"%(ip),**kwargs)
      sameLine='False'
   except:
      "no address"


#print restart script
kwargs={"color":"black","backgroundColor":"rgba(0,255,0,.1)","left":"0px","width":"300px","height":"50px","fontSize":"200%","textAlign":"right"}   
log("To restart the server use:\n",**kwargs)
kwargs={"color":"black","backgroundColor":"rgba(0,255,0,.1)","left":"0px","width":"100%","height":"50px","fontSize":"200%","textAlign":"center","userSelect":"all"}   
log(restartString+"\n",**kwargs)

#Print server starting message
if options.restart!="False":
   log("\nSERVER RESTARTING - %s!!!\n\n"%(serverStartString),**kwargs)


kwargs={"color":"blue","backgroundColor":"rgba(0,0,255,.1)","left":"0px","width":"300px","height":"40px","fontSize":"200%","textAlign":"right"}   
log("Config File Info:\n",**kwargs)
firstList=["currentExperiment","location","domain","serverPort","dataFileURL","serverType"]
for k in firstList:
   kwargs={"color":"black","backgroundColor":"rgba(0,0,255,.1)","left":"0px","width":"200px","fontSize":"150%","textAlign":"right"}   
   log("%s:  \n"%(k),**kwargs)
   kwargs={"color":"blue","backgroundColor":"rgba(0,0,255,.1)","left":"200px","width":"1200px","fontSize":"150%","textAlign":"left","sameLine":"True"}   
   log("%s\n"%(config[k]),**kwargs)

for k in config:
   if k not in firstList:
      kwargs={"color":"black","backgroundColor":"rgba(0,0,255,.1)","left":"0px","width":"200px","fontSize":"150%","textAlign":"right"}   
      log("%s:  \n"%(k),**kwargs)
      kwargs={"color":"blue","backgroundColor":"rgba(0,0,255,.1)","left":"200px","width":"1200px","fontSize":"150%","textAlign":"left","sameLine":"True"}   
      log("%s\n"%(config[k]),**kwargs)


#load the experiment file
experimentFile=config['webServerRoot']+config['currentExperiment']+"/files/experiment.py"
experiment = imp.load_source('experiment', experimentFile)
from experiment import experimentClass
from experiment import subjectClass

#copy experiment file for later viewing
dataFolderFiles=config['webServerRoot']+config['dataFolder']+"/files/"
if not os.path.exists(dataFolderFiles):
   os.makedirs(dataFolderFiles)
shutil.copyfile(experimentFile,dataFolderFiles+"/experiment.py")
shutil.copyfile(experimentFile.replace(".py",".js"),dataFolderFiles+"/experiment.js")
shutil.copyfile(experimentFile.replace(".py",".css"),dataFolderFiles+"/experiment.css")

#load webServer module
steepWebServer = imp.load_source('steepWebSockets', "modules/webServer.py")

#load autoVersion module
autoversion = imp.load_source('autoversion', "modules/auto-versioning.py")

#load websockets module
steepWebSockets = imp.load_source('steepWebSockets', "modules/webSockets.py")
from steepWebSockets import SteepWebSocketFactory

#load mainServer module
steepMainServer = imp.load_source('steepMainServer', "modules/mainServer.py")
from steepMainServer import SteepMainServer

#load quiz module
steepQuiz = imp.load_source('steepQuiz', "modules/quiz.py")
from steepQuiz import SteepQuiz

#load questionnaire module
# steepQuestionnaire = imp.load_source('steepQuestionnaire', "modules/questionnaire.py")
# from steepQuestionnaire import SteepQuestionnaire
#No reason for this right now.

class ExperimentQuiz():
   def __init__(self):
      "defin blank class in case not importing other"
if 'quiz' in config:
   #load experiment specific quiz module
   experimentQuizFile=config['webServerRoot']+config['currentExperiment']+"/files/quiz.py"
   experimentQuiz = imp.load_source('experimentQuiz',experimentQuizFile)
   shutil.copyfile(experimentQuizFile,dataFolderFiles+"/quiz.py")
   from experimentQuiz import ExperimentQuiz


class ExperimentQuestionnaire():
   def __init__(self):
      "defin blank class in case not importing other"
if 'questionnaire' in config:
   #load experiment specific questionnaire module
   experimentQuestionnaireFile=config['webServerRoot']+config['currentExperiment']+"/files/questionnaire.py"
   experimentQuestionnaire = imp.load_source('experimentQuestionnaire',experimentQuestionnaireFile)
   shutil.copyfile(experimentQuestionnaireFile,dataFolderFiles+"/questionnaire.py")
   from experimentQuestionnaire import ExperimentQuestionnaire

class ExperimentInstructions():
   def __init__(self):
      "defin blank class in case not importing other"
class SteepInstructions():
   def __init__(self):
      "defin blank class in case not importing other"
if 'instructions' in config:
   #load experiment specific quiz module
   experimentInstructionsFile=config['webServerRoot']+config['currentExperiment']+"/files/instructions.py"
   experimentInstructions = imp.load_source('experimentInstructions',experimentInstructionsFile)
   shutil.copyfile(experimentInstructionsFile,dataFolderFiles+"/instructions.py")
   from experimentInstructions import ExperimentInstructions
   
   #load instructions module
   steepInstructions = imp.load_source('steepInstructions', "modules/instructions.py")
   from steepInstructions import SteepInstructions



#load monitor module
steepMonitor = imp.load_source('steepMonitor', "modules/monitor.py")
from steepMonitor import monitorClass

#load timer module
steepTimer = imp.load_source('steepTimer', "modules/timer.py")
from steepTimer import SteepTimerManager



class SteepServerClass(SteepMainServer,SteepWebSocketFactory,experimentClass,monitorClass,subjectClass,SteepInstructions,SteepQuiz,ExperimentQuiz,SteepTimerManager,ExperimentInstructions,ExperimentQuestionnaire):
   def __init__(self,config,options,log,thisLogCounter):
      self.logCounter=thisLogCounter
      self.log=log
      self.config=config
      self.options=options
      self.restartString=optionsCommands.getRestartString(self.config)
      SteepWebSocketFactory.__init__(self)
      SteepMainServer.__init__(self)
      SteepTimerManager.__init__(self)
      SteepQuiz.__init__(self)
      experimentClass.__init__(self)
      self.subjectClass=subjectClass
      SteepInstructions.__init__(self)
      monitorClass.__init__(self)
      SteepQuiz.__init__(self)
      ExperimentQuiz.__init__(self)
      ExperimentInstructions.__init__(self)
      ExperimentQuestionnaire.__init__(self)
      sys.stdout.consoleMessage=self.consoleMessage
      sys.stderr.consoleMessage=self.consoleMessage

if __name__ == '__main__':
   #websockets
   factory = SteepServerClass(config,options,log,thisLogCounter)
   listenWS(factory)

   #webserver
   resource = steepWebServer.RequestHandler(config,options.debug,restartString,thisLogCounter)
   factory = Site(resource)
   reactor.listenTCP(resource.config['serverPort'], factory)

   if options.openBrowser=="True":
      url = 'http://localhost:%s'%(resource.config['serverPort'])
      webbrowser.open(url)

   reactor.run()

