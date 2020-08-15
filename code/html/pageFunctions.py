#!/usr/bin/python
import random
import os 

def addExternalFiles(config,location):
    #location is either "headStart" or "headEnd" "bodyStart" "bodyEnd"
    string=""
    if "additionalFiles" in config:
        for fileDetails in config["additionalFiles"]:
            fileLocation=fileDetails[2]
            fileType=fileDetails[1]
            filePath=fileDetails[0]
            extension=filePath.split(".")[-1]
            if fileLocation==location:
                if fileType=="full":
                    url=fileDetails[0]
                    add=1
                elif fileType=="relative":
                    domain=config['domain']
                    currentExperiment=config['currentExperiment']
                    fullPath=os.path.abspath(config['webServerRoot']+currentExperiment+"files/"+fileDetails[0])
                    url=fullPath.replace(config['webServerRoot'],domain+"/",1)
                    add=1
                elif fileType.find("pluginRelative")==0:
                    domain=config['domain']
                    fullPath=os.path.abspath(config['pluginRoot'][fileType.replace("pluginRelative/","")]+"/"+filePath) 
                    url=fullPath.replace(config['webServerRoot'],domain+"/",1)
                    add=1


                if add==1:
                    if extension=="js":
                        string+=javascriptLine(url)
                    if extension=="css":
                        string+=cssLine(url)



    return string


    this+=pf.addPluginFiles(config,"js")

def addPluginFiles(config,extension):
    string=""
    if "plugins" in config:
        for plugin in config["plugins"]:
            path=plugin[0]
            completePath=os.path.abspath(path) 
            url=completePath.replace(config['webServerRoot'],config['domain']+"/")
            if extension=="js":
                string=javascriptLine(url.replace(".py",".js"))+string
            elif extension=="css":
                string=cssLine(url.replace(".py",".css"))+string
    return string




def javascriptLine(url):
 return '\t\t<script type="text/javascript" src="%s"></script>\n'%(url)

def cssLine(url):
  return '\t\t<link rel="stylesheet" type="text/css" href="%s">\n'%(url)

def cleanLink(config,link):
    out=link.replace(config['domain'],config['webServerRoot'],1)
    out=os.path.abspath(out) 
    out=out.replace(config['webServerRoot'],config['domain']+"/",1)
    return out

def getFiles(config):
    packageFolder=config['packageFolder']
    currentExperiment=config['currentExperiment']
    domain=config['domain']
    packageURL=domain+packageFolder
    experimentURL=domain+currentExperiment

    files={}
    files['common']={}

    files['common']['jquery.js']=cleanLink(config,packageURL+"javascript/jquery-1.11.3.min.js")
    files['common']['velocity.js']=cleanLink(config,packageURL+"javascript/velocity.min.js")
    files['common']['common.js']=cleanLink(config,packageURL+"javascript/common.js")
    files['common']['websocketConnect.js']=cleanLink(config,packageURL+"javascript/websocketConnect.js")
    files['common']['video.js']=cleanLink(config,packageURL+"javascript/video.js")
    files['common']['instructions.js']=cleanLink(config,packageURL+"javascript/instructions.js")
    files['common']['monitor.js']=cleanLink(config,packageURL+"javascript/monitor.js")
    files['common']['chat.js']=cleanLink(config,packageURL+"javascript/chat.js")

    files['common']['simulateMouse.css']=cleanLink(config,packageURL+"javascript/simulateMouse/simulateMouse.css")
    files['common']['simulateMouse.js']=cleanLink(config,packageURL+"javascript/simulateMouse/simulateMouse.js")

    files['common']['instructions.css']=cleanLink(config,packageURL+"css/instructions.css")
    files['common']['common.css']=cleanLink(config,packageURL+"css/common.css")
    files['common']['monitor.css']=cleanLink(config,packageURL+"css/monitor.css")
    files['common']['chat.css']=cleanLink(config,packageURL+"css/chat.css")

    files["exp"]={}
    files["exp"]['config.js']=config["configJsURL"]
    files["exp"]['experiment.css']=cleanLink(config,experimentURL+"files/experiment.css")
    files["exp"]['experiment.js']=cleanLink(config,experimentURL+"files/experiment.js")
    files["exp"]['tester.js']=cleanLink(config,experimentURL+"files/tester.js")
    files["exp"]['monitor.js']=cleanLink(config,experimentURL+"files/monitor.js")

    if "instructionsFolder" in config:
        instructionsFolder=experimentURL+config['instructionsFolder']
        files["exp"]['instructions.js']=instructionsFolder+"instructions.js"


    #this ensures that we won't use cached versions of these js and css files.  
    for k in files:
        for j in files[k]:
            files[k][j]=files[k][j]+"?r=%s"%(str(random.random()).replace(".",""))

    return files
