from __future__ import print_function,division,absolute_import   
import sys
import os
import imp
import pickle
import shutil
if sys.version_info >= (3,0):
   import urllib.parse as theURLparse
else:
   import urlparse as theURLparse

from twisted.web.resource import Resource
from twisted.web.static import File

#Get value from url key function
def getValueFromQueryKey(query,key):
   number=""
   for k in query.split("&"):
      this=k.split("=")
      if this[0]==key:
         number=this[1]
   return number

#Handle HTTP requests
class RequestHandler(Resource):
   isLeaf = True
   def __init__(self,config,debug,restartString,thisLogCounter):
      self.thisCounter=thisLogCounter
      self.config=config

   def render_GET(self, request):
      parsedURL=theURLparse.urlparse(request.uri.decode().replace("//","/"))#scheme,netloc,path,query
      thisPath=parsedURL.path.replace("//","/")
      root,ext=os.path.splitext(thisPath)
      if thisPath=="/" or thisPath=="":
         ext=".py"
         filename="/monitor.py"
         fileFolder=self.config['packageFolder']+"/html/"
         fullPath=self.config['webServerRoot']+fileFolder+filename
      elif thisPath in ["/client.html","/monitor.html","/instructions.html","/video.html","/questionnaire.html","/quiz.html","/serverInfo.html","/tester.html"]:
         ext=".py"
         filename=thisPath.replace(".html",".py").replace("/","")
         fileFolder=self.config['packageFolder']+"/html/"
         fullPath=self.config['webServerRoot']+fileFolder+filename
      elif thisPath in ["/experiment.js","/experiment.py","/experiment.css"]:
         ext="showFiles"
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
      if ext==".zip":
         #will download the data file for ANY zip extension.
         dataFolder=self.config['webServerRoot']+self.config['dataFolder']
         outputName=self.config['webServerRoot']+self.config['currentExperiment']+"/data/"+self.config['serverStartString']
         fullPath=outputName+".zip"
         print("creating zip file ",fullPath," for data folder ",dataFolder)
         shutil.make_archive(outputName,'zip',dataFolder)
         filename=self.config['serverStartString']+".zip"
         #this causes file to be downloaded automatically rather than being opened in the browser.   
         request.setHeader("Content-Disposition","attachment")
         thisFile=File(fullPath)
         # os.remove(fullPath)
         return File.render_GET(thisFile,request)
      elif ext=="showFiles":
         prismFolder=self.config['packageFolder']+"/css/prism/"
         filename=self.config['webServerRoot']+self.config['currentExperiment']+"/files/"+thisPath
         file = open(filename,'rb')
         fileContent=file.read()
         if thisPath=="/experiment.py":
            extension="python"
         elif thisPath=="/experiment.js":
            extension="js"
         elif thisPath=="/experiment.css":
            extension="css"
         file.close() 
         output="""<html>

<head>
    <link href="%s/prism.css" rel="stylesheet" type="text/css" />
</head>

<body>
<script src="%s/prism.js"></script>

<h1>%s</h1>
<pre class="line-numbers"><code class="language-%s">%s
</code></pre>

</body>
"""%(prismFolder,prismFolder,thisPath,extension,fileContent)
         return output.encode('utf-8')
      elif os.path.isfile(fullPath):
         if ext==".py":
            print("running %s from %s"%(filename,self.config['webServerRoot']+fileFolder))            
            thisPage = imp.load_source('thisPage',self.config['webServerRoot']+fileFolder+filename)
            output=thisPage.getPage(self.config)
            return output.encode('utf-8')
         elif ext==".m4a":
            request.setHeader("Content-Type","audio/mp4")
            thisFile=File(self.config['webServerRoot']+thisPath)
            return File.render_GET(thisFile,request)
         elif ext==".pickle":         
            #this causes file to be downloaded automatically rather than being opened in the browser.   
            request.setHeader("Content-Disposition","attachment")
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





