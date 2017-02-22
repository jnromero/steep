from __future__ import print_function,division,absolute_import   
import sys
import imp
import time
import webbrowser
functions = imp.load_source('functions', "modules/functions.py")

from twisted.internet import reactor
from twisted.web.server import Site
from autobahn.twisted.websocket import listenWS


#python version
functions.printColor("\n\n\t\tRunning")
functions.printColor("STEEP","turquoise",['bold'])
functions.printColor("server.\n\n\n")
functions.printColor("Python version:","blue",["bold"])
functions.printColor(sys.version+"\n","black")
functions.printColor("Python executable:","blue",["bold"])
functions.printColor(sys.executable+"\n\n","black")

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
   functions.printColor("Warning:","red",["background","flash"])
   functions.printColor("Saving Data to TMP file, and potentially rewriting old tmp data.\n","red")
   functions.printColor("This is fine if you are just testing.\n","red")
   functions.printColor("Use '-s True' or remove '-s False' to save data to new folder.\n\n","red")
   serverStartString="tmp"

#print restart script
restartString=optionsCommands.getRestartString(serverStartString)
functions.printColor("To restart use:\n","green",['background'])
functions.printColor(restartString+"\n\n","green",[''])

#load the config file
try:  
   settings = imp.load_source('settings',options.configFile)
except:
   sys.exit("ERROR: Config file couldn't be loaded (probably not a python file).\n %s \nYou can see all options by running 'python server.py -h'"%(options.configFile))

#Add serverStartString to config file
config=settings.setConfig(options.location)
config['location']=options.location
configFunctions = imp.load_source('configFunctions', "modules/configFunctions.py")
config=configFunctions.setOtherFileLocations(config,serverStartString)
configFunctions.writeJavascriptConfigFile(config,options.configFile)



#Print server starting message
if options.restart=="False":
   functions.printColor("Data File Name:","black",['bold'])
   functions.printColor(serverStartString+"\n")
else:
   functions.printColor("SERVER RESTARTING - %s!!!"%(serverStartString),"red")
functions.printColor("Current Experiment:","black",['bold'])
functions.printColor(config['currentExperiment']+"\n\n")





#load the experiment file
experimentFile=config['webServerRoot']+config['currentExperiment']+"/files/experiment.py"
experiment = imp.load_source('experiment', experimentFile)
from experiment import experimentClass
from experiment import subjectClass

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
   experimentQuiz = imp.load_source('experimentQuiz',config['webServerRoot']+config['currentExperiment']+"/files/quiz.py")
   from experimentQuiz import ExperimentQuiz


class ExperimentQuestionnaire():
   def __init__(self):
      "defin blank class in case not importing other"
if 'questionnaire' in config:
   #load experiment specific questionnaire module
   experimentQuestionnaire = imp.load_source('experimentQuestionnaire',config['webServerRoot']+config['currentExperiment']+"/files/questionnaire.py")
   from experimentQuestionnaire import ExperimentQuestionnaire

class ExperimentInstructions():
   def __init__(self):
      "defin blank class in case not importing other"
class SteepInstructions():
   def __init__(self):
      "defin blank class in case not importing other"
if 'instructions' in config:
   #load experiment specific quiz module
   experimentInstructions = imp.load_source('experimentInstructions',config['webServerRoot']+config['currentExperiment']+"/files/instructions.py")
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
   def __init__(self,config,options,serverStartString):
      self.config=config
      self.options=options
      self.serverStartString=serverStartString
      self.restartString=optionsCommands.getRestartString(self.serverStartString)
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

