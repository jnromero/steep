#!/usr/bin/python
import pickle 
import sys 
import json
import netifaces as ni
import imp

def getPage(config,totalPages,currentTab):
	pf = imp.load_source('pf', config['webServerRoot']+config['packageFolder']+"/html/pageFunctions.py")
	files=pf.getFiles(config)
	string="window.totalPages=%s;\n"%(totalPages)
	string+="window.currentTab=%s;\n"%(currentTab)
	string+="window.consoleLines=[];\n"

	this=''
	this+='<html>\n'
	this+='\t<head>\n'
	this+='\t\t<title>STEEP: Dashboard</title>\n'
	this+=pf.addExternalFiles(config,"headStart")
	this+=pf.javascriptLine(files['common']['jquery.js'])
	this+=pf.javascriptLine(files["exp"]['config.js'])
	this+=pf.javascriptLine(files['common']['common.js'])
	this+=pf.javascriptLine(files['common']['monitorGeneral.js'])
	this+=pf.javascriptLine(files['common']['websocketConnect.js'])
	this+=pf.cssLine(files['common']['common.css'])
	this+=pf.cssLine(files['common']['switch.css'])
	this+=pf.cssLine(files['common']['monitor.css'])
	this+=pf.addExternalFiles(config,"headEnd")
	this+='\t</head>\n'
	this+='\t<body>\n'
	this+=pf.addExternalFiles(config,"bodyStart")
	this+='\t\t<script type="text/javascript">%s</script>\n'%(string)
	this+='\t\t<div id="mainDiv"></div>\n'
	this+=pf.javascriptLine(files['common']['console.js'])
	this+=pf.addExternalFiles(config,"bodyEnd")
	this+='\t<body>\n'
	this+='</html>'

	return this
