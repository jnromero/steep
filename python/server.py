from __future__ import print_function
import sys
import imp
import time
import webbrowser

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
restartString=optionsCommands.printRestartString(serverStartString)
print("!!!!!",restartString)

#load the config file
try:  
   settings = imp.load_source('settings',options.configFile)
except:
   sys.exit("ERROR: Config file couldn't be loaded (probably not a python file).\n %s \nYou can see all options by running 'python server.py -h'"%(options.configFile))

#Save data to temporary file.  This avoids clutter
if options.saveData=="False":
   serverStartString="tmp"
#Add serverStartString to config file
config=settings.defaultSettings(options.location,options.configFile,serverStartString)



#Print server starting message
if options.restart=="False":
   print("SERVER RUNNING - %s!!!"%(serverStartString))
else:
   print("SERVER RESTARTING - %s!!!"%(serverStartString))
print("current Experiment: "+config['currentExperiment'])





#load the experiment file
experimentFile=config['webServerRoot']+config['currentExperiment']+"/files/experiment.py"
experiment = imp.load_source('experiment', experimentFile)
from experiment import experimentClass
from experiment import subjectClass

#load webServer module
steepWebServer = imp.load_source('steepWebSockets', "modules/webServer.py")

#load autoVersion module
autoversion = imp.load_source('autoversion', "modules/auto-versioning.py")
autoversion.updateAutoVersion(config)

#load websockets module
steepWebSockets = imp.load_source('steepWebSockets', "modules/webSockets.py")
from steepWebSockets import SteepWebSocketFactory

#load mainServer module
steepMainServer = imp.load_source('steepMainServer', "modules/mainServer.py")
from steepMainServer import SteepMainServer

#load instructions module
steepInstructions = imp.load_source('steepInstructions', "modules/instructions.py")
from steepInstructions import SteepInstructions

#load quiz module
steepQuiz = imp.load_source('steepQuiz', "modules/quiz.py")
from steepQuiz import SteepQuiz


class ExperimentQuiz():
   def __init__(self):
      "defin blank class in case not importing other"
if 'quiz' in config:
   #load experiment specific quiz module
   experimentQuiz = imp.load_source('experimentQuiz',config['webServerRoot']+config['currentExperiment']+"/files/quiz.py")
   from experimentQuiz import ExperimentQuiz


class ExperimentInstructions():
   def __init__(self):
      "defin blank class in case not importing other"
if 'instructions' in config:
   #load experiment specific quiz module
   experimentInstructions = imp.load_source('experimentInstructions',config['webServerRoot']+config['currentExperiment']+"/files/instructions.py")
   from experimentInstructions import ExperimentInstructions

#load monitor module
steepMonitor = imp.load_source('steepMonitor', "modules/monitor.py")
from steepMonitor import monitorClass



#load monitor module
steepTimer = imp.load_source('steepTimer', "modules/timer.py")
from steepTimer import SteepTimerManager

class SteepServerClass(SteepMainServer,SteepWebSocketFactory,experimentClass,monitorClass,subjectClass,SteepInstructions,SteepQuiz,ExperimentQuiz,SteepTimerManager,ExperimentInstructions):
   def __init__(self,config,options,serverStartString):
      self.config=config
      self.options=options
      self.serverStartString=serverStartString
      self.restartString=optionsCommands.printRestartString(self.serverStartString)
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


if __name__ == '__main__':
   #websockets
   factory = SteepServerClass(config,options,serverStartString)
   listenWS(factory)

   #webserver
   resource = steepWebServer.RequestHandler(config,options.debug,restartString)
   factory = Site(resource)
   reactor.listenTCP(resource.config['serverPort'], factory)

   if options.openBrowser=="True":
      url = 'http://localhost:%s'%(resource.config['serverPort'])
      webbrowser.open(url)

   reactor.run()

