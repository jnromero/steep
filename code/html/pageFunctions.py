#!/usr/bin/python
import random


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
                    if extension=="js":
                        string+=javascriptLine(fileDetails[0])
                    elif extension=="css":
                        string+=cssLine(fileDetails[0])
                elif fileType=="relative":
                    domain=config['domain']
                    currentExperiment=config['currentExperiment']
                    experimentURL=domain+currentExperiment
                    relativeURL=experimentURL+"files/"+fileDetails[0]
                    if extension=="js":
                        string+=javascriptLine(relativeURL)
                    if extension=="css":
                        string+=cssLine(relativeURL)
    return string


    this+=pf.addPluginFiles(config,"js")

def addPluginFiles(config,extension):
    string=""
    if "plugins" in config:
        for plugin in config["plugins"]:
            path=plugin[0]
            pathLocation=plugin[1]
            if pathLocation=="relative":
                domain=config['domain']
                currentExperiment=config['currentExperiment']
                experimentURL=domain+currentExperiment
                url=experimentURL+"files/"+path
            elif pathLocation=="absolute":
                path="/"+path.replace(config['webServerRoot'],"")
                domain=config['domain']
                # currentExperiment=config['currentExperiment']
                # experimentURL=domain+currentExperiment
                url=domain+path
            if extension=="js":
                string=javascriptLine(url.replace(".py",".js"))+string
            elif extension=="css":
                string=cssLine(url.replace(".py",".css"))+string
    return string




def javascriptLine(url):
 return '\t\t<script type="text/javascript" src="%s"></script>\n'%(url)

def cssLine(url):
  return '\t\t<link rel="stylesheet" type="text/css" href="%s">\n'%(url)

def getFiles(config):
    packageFolder=config['packageFolder']
    currentExperiment=config['currentExperiment']
    domain=config['domain']
    packageURL=domain+packageFolder
    experimentURL=domain+currentExperiment

    files={}
    files['common']={}

    files['common']['jquery.js']=packageURL+"javascript/jquery-1.11.3.min.js"
    files['common']['velocity.js']=packageURL+"javascript/velocity.min.js"
    files['common']['common.js']=packageURL+"javascript/common.js"
    files['common']['websocketConnect.js']=packageURL+"javascript/websocketConnect.js"
    files['common']['video.js']=packageURL+"javascript/video.js"
    files['common']['instructions.js']=packageURL+"javascript/instructions.js"
    files['common']['monitor.js']=packageURL+"javascript/monitor.js"

    files['common']['simulateMouse.css']=packageURL+"javascript/simulateMouse/simulateMouse.css"
    files['common']['simulateMouse.js']=packageURL+"javascript/simulateMouse/simulateMouse.js"

    files['common']['instructions.css']=packageURL+"css/instructions.css"
    files['common']['common.css']=packageURL+"css/common.css"
    files['common']['monitor.css']=packageURL+"css/monitor.css"

    files["exp"]={}
    files["exp"]['config.js']=config["configJsURL"]
    files["exp"]['experiment.css']=experimentURL+"files/experiment.css"
    files["exp"]['experiment.js']=experimentURL+"files/experiment.js"
    files["exp"]['tester.js']=experimentURL+"files/tester.js"

    if "instructionsFolder" in config:
        instructionsFolder=experimentURL+config['instructionsFolder']
        files["exp"]['instructions.js']=instructionsFolder+"instructions.js"


    #this ensures that we won't use cached versions of these js and css files.  
    for k in files:
        for j in files[k]:
            files[k][j]=files[k][j]+"?r=%s"%(str(random.random()).replace(".",""))

    return files
