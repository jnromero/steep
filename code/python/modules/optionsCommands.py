from __future__ import print_function,division,absolute_import   
from optparse import OptionParser
import time
import os,sys,imp

def getOptions():
   #options for running the server
   parser = OptionParser()
   parser.add_option("-l", "--location", dest="location", default="NONE",
                     help="the location where the server is being run, specifics are defined in the config file.")
   parser.add_option("-i", "--ipAddress", dest="ipAddress", default="localhost",
                     help="the server ip address.")
   parser.add_option("-o", "--openBrowser", dest="openBrowser", default="False",
                     help="set to True to open the browser on start.")
   parser.add_option("-r", "--restart", dest="restart", default="False",
                     help="set to the string %Y%m%d-%H%M%S to restart the server.")
   parser.add_option("-d", "--debug", dest="debug", default="False",
                     help="set to True to write to console rather than to the console webpage.")
   parser.add_option("-s", "--saveData", dest="saveData", default="True",
                     help="set to False to write data to tmp folder, rather than unique folder.  This should NEVER be used when you run an experiment in the lab.")
   parser.add_option("-n", "--numberClients", dest="numberClients", default="0",
                     help="set to an integer n to open clients on startup, mostly for local testing.")
   parser.add_option("-v", "--videoClient", dest="videoClient", default="False",
                     help="set to True to open a video client.")
   (options, args) = parser.parse_args()

   if options.location=="NONE":
      sys.exit("ERROR: You must set a location to run the server.  You can see all options by running 'python server.py -h'")


   return options


def getRestartString(config):
   serverStartString=config['serverStartString']
   #Print the restart server string
   if "-r" in sys.argv:
      this=sys.argv
      i=this.index("-r")
      del this[i]
      del this[i]
   restartString="python "+" ".join(sys.argv)+" -r %s"%(serverStartString)
   return restartString 