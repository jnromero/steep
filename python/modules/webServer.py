from __future__ import print_function
import sys
import os
import imp
import pickle
if sys.version_info >= (3,0):
   import urllib.parse as theURLparse
else:
   import urlparse as theURLparse

from twisted.web.resource import Resource
from twisted.web.static import File

autoVersion = imp.load_source('autoVersion',"modules/auto-versioning.py")


#Get value from url key function
def getValueFromQueryKey(query,key):
   number=""
   for k in query.split("&"):
      this=k.split("=")
      if this[0]==key:
         number=int(this[1])
   return number

#Handle HTTP requests
class RequestHandler(Resource):
   isLeaf = True
   def __init__(self,config,debug,restartString):
      self.config=config
      self.transformedFiles=autoVersion.updateAllAutoVersion(config)
      if debug=="False":
         import logger
         self.thisLogger=logger.TwistedLogger(config['webServerRoot']+config['dataFolder'])
         print(restartString)

   def render_GET(self, request):
      parsedURL=theURLparse.urlparse(request.uri.replace("//","/"))#scheme,netloc,path,query
      thisPath=parsedURL.path.decode("utf-8").replace("//","/")
      if thisPath=="/":
         ext=".py"
         filename="index.py"
         fileFolder=self.config['packageFolder']+"/html/"
         fullPath=self.config['webServerRoot']+fileFolder+filename
      elif thisPath in ["/client.html","/monitor.html","/instructions.html","/video.html","/questionnaire.html","/quiz.html"]:
         ext=".py"
         filename=thisPath.replace(".html",".py").replace("/","")
         fileFolder=self.config['packageFolder']+"/html/"
         fullPath=self.config['webServerRoot']+fileFolder+filename
      elif thisPath in ["/console.html"]:
         thisPage=getValueFromQueryKey(parsedURL.query,"page")
         if thisPage=="":
            thisPage=self.thisLogger.fileCount
         self.logURL=self.config['domain']+self.config['dataFolder']+"/logs/%s.log"%(thisPage)
         self.currentLogTab=thisPage
         ext=".py"
         filename=thisPath.replace(".html",".py").replace("/","")
         fileFolder=self.config['packageFolder']+"/html/"
         fullPath=self.config['webServerRoot']+fileFolder+filename
      else:
         root,ext=os.path.splitext(thisPath)
         filename=os.path.basename(thisPath)
         if filename=="":
            filename="index.py"
            ext=".py"
         fileFolder=thisPath.replace(filename,"")
         fullPath=self.config['webServerRoot']+fileFolder+filename
         if filename=="favicon.ico":
            fullPath=self.config['webServerRoot']+self.config['packageFolder']+"/html/triangle.png"

      if os.path.isfile(fullPath):
         if filename=="console.py":
            print("running %s from %s"%(filename,self.config['webServerRoot']+fileFolder))
            thisPage = imp.load_source('thisPage',self.config['webServerRoot']+fileFolder+filename)
            output=thisPage.getPage(self.config,self.logURL,self.thisLogger.fileCount,self.currentLogTab)
            return output.encode('utf-8')
         elif ext==".py":
            print("running %s from %s"%(filename,self.config['webServerRoot']+fileFolder))            
            thisPage = imp.load_source('thisPage',self.config['webServerRoot']+fileFolder+filename)
            self.transformedFiles=autoVersion.updateAutoVersion(self.config)
            output=thisPage.getPage(self.config,self.transformedFiles)
            return output.encode('utf-8')
         elif ext==".m4a":
            request.setHeader("Content-Type","audio/mp4")
            thisFile=File(self.config['webServerRoot']+thisPath)
            return File.render_GET(thisFile,request)
         else:
            #print "getting file: "+self.config['webServerRoot']+fileFolder+filename
            thisFile=File(self.config['webServerRoot']+fileFolder+filename)
            return File.render_GET(thisFile,request)
      else:
         print(request)
         print("ErrorLine: File NOT found: %s"%(fullPath), file=sys.stderr)
         #print >> sys.stderr, "ErrorLine: File NOT found: %s"%(fullPath)
         return "<html><h1>File Not Found - %s</h1></html>"%(fullPath)





