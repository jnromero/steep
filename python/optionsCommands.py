from optparse import OptionParser
import time
import os,sys,imp

def getOptions():
   #options for running the server
   parser = OptionParser()
   parser.add_option("-c", "--configFile", dest="configFile", default="NONE",
                        help="location of server configuration file.  Default is ../config/settings.py")
   parser.add_option("-l", "--location", dest="location", default="NONE",
                     help="the location where the server is being run, specifics are defined in the config file.")
   parser.add_option("-o", "--openBrowser", dest="openBrowser", default="True",
                     help="set to False to not open the browser on start.")
   parser.add_option("-r", "--restart", dest="restart", default="False",
                     help="set to the string %Y%m%d-%H%M%S to restart the server.")
   parser.add_option("-d", "--debug", dest="debug", default="False",
                     help="set to True to write to console rather than to the console webpage.")
   parser.add_option("-s", "--saveData", dest="saveData", default="True",
                     help="set to False to write data to tmp folder, rather than unique folder.  This should NEVER be used when you run an experiment in the lab.")
   (options, args) = parser.parse_args()



   if options.configFile=="NONE":
      sys.exit("ERROR: You must set a config file to run the server.  You can see all options by running 'python server.py -h'")
   else:
      if os.path.isfile(options.configFile)==False:
         sys.exit("ERROR: Config file not found.\n %s \nYou can see all options by running 'python server.py -h'"%(options.configFile))
   if options.location=="NONE":
      sys.exit("ERROR: You must set a location to run the server.  You can see all options by running 'python server.py -h'")
   return options


def printRestartString(serverStartString):
   #Print the restart server string
   print "To restart use:"
   print 
   if "-r" in sys.argv:
      this=sys.argv
      i=this.index("-r")
      del this[i]
      del this[i]
   restartString="python "+" ".join(sys.argv)+" -r %s"%(serverStartString)
   print restartString
   print 
   return restartString 