#!/usr/bin/python
import imp

def getPage(config):
    pf = imp.load_source('pf', config['webServerRoot']+config['packageFolder']+"/html/pageFunctions.py")
    files=pf.getFiles(config)
    this=''
    this+='<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Traditional//EN">\n'
    this+='<html id="everything">\n'
    this+='\t<head>\n'
    this+='\t\t<title>STEEP: Tester</title>\n'
    this+=pf.addExternalFiles(config,"headStart")
    this+=pf.javascriptLine(files['common']['jquery.js'])
    this+=pf.javascriptLine(files['common']['velocity.js'])
    this+=pf.javascriptLine(files["exp"]['config.js'])
    this+=pf.javascriptLine(files['common']['common.js'])
    this+=pf.javascriptLine(files['common']['websocketConnect.js'])
    this+=pf.cssLine(files['common']['instructions.css'])
    this+=pf.cssLine(files['common']['common.css'])
    this+=pf.cssLine(files['common']['questionnaire.css'])
    this+=pf.cssLine(files['common']['simulateMouse.css'])
    this+=pf.addPluginFiles(config,"css")
    this+=pf.cssLine(files['exp']['experiment.css'])
    this+=pf.addExternalFiles(config,"headEnd")
    this+='\t</head>\n'
    this+='\t<body>\n'
    this+=pf.addExternalFiles(config,"bodyStart")
    this+=pf.javascriptLine(files['common']['simulateMouse.js'])
    this+=pf.javascriptLine(files['common']['video.js'])
    this+=pf.addPluginFiles(config,"js")
    this+=pf.javascriptLine(files['exp']['experiment.js'])
    this+=pf.javascriptLine(files['common']['instructions.js'])
    this+=pf.javascriptLine(files['common']['questionnaire.js'])
    this+=pf.javascriptLine(files['exp']['tester.js'])
    instructions=False
    if "instructionsFolder" in config:
        instructions=True
    if instructions==True:
        this+=pf.javascriptLine(files['exp']['instructions.js'])
    this+=pf.addExternalFiles(config,"bodyEnd")
    this+='\t</body>\n'
    this+='</html>'
    return this