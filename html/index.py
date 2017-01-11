#!/usr/bin/python
import pickle


def getPage(config,transformedFiles):
	currentExperiment=config['currentExperiment']
	packageFolder=config['packageFolder']
	domain=config['domain']
	instructions=False
	if "instructionsFolder" in config:
		instructions=True
	quiz=False
	if "quiz" in config:
		quiz=True

	this=''
	this+='<html>\n'
	this+='\t<head>\n'
	if config['location']=="webfDemo":
		this+='\t\t<meta http-equiv="refresh" content="0;url=http://jnromero.com/Experiments" />\n'
		this+='\t\t<title>You are going to be redirected</title>\n'
	else:
		this+='\t\t<title>STEEP: Dashboard</title>\n'
	this+='\t</head>\n'
	this+='\t<body>\n'
	this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,transformedFiles['common']['jquery.js'])
	this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,transformedFiles['common']['common.js'])
	this+='\t\t<link rel="stylesheet" type="text/css" href="%s/%s/html/auto-version/%s" />\n'%(domain,packageFolder,transformedFiles['common']['index.css'])
	this+='\t\t<div id="container">\n'
	this+='\t\t<div id="currentExperiment">Current Experiment: %s</div>\n'%(currentExperiment)
	this+='\t\t<ul id="indexExperimentLinks">\n'
	this+='\t\t\t<a href="%s/console.html">Console</a>\n'%(domain)
	this+='\t\t\t<a href="%s/client.html">Client</a>\n'%(domain)
	this+='\t\t\t<a href="%s/monitor.html">Monitor</a>\n'%(domain)
	if instructions==True:
		this+='\t\t\t<a href="%s/video.html">Front of Class Instructions</a>\n'%(domain)
	this+='\t\t</ul>\n'
	this+='\t\t<ul id="indexDemoLinks">\n'
	if instructions==True:
		this+='\t\t\t<a href="%s/instructions.html">Instructions</a>\n'%(domain)
	if quiz==True:
		this+='\t\t\t<a href="%s/quiz.html">Quiz</a>\n'%(domain)
	this+='\t\t\t<a href="%s/questionnaire.html">Questionnaire</a>\n'%(domain)
	this+='\t\t\t<a href="%s/docs/docs.html">Docs</a>\n'%(packageFolder)
	this+='\t\t</ul>\n'
	this+='\t\t<div id="screenServer" onclick="window.location=\'%s\';">Screen Server</div>\n'%(config['screenServer'])
	this+='\t\t</div>\n'
	this+='\t\t<ul>\n'
	this+='\t\t\t<li> Window launch:</br><code>C:\Program Files (x86)\Google\Chrome\Application\chrome.exe -kiosk --no-default-browser-check --disk-cache-size=1 --media-cache-size=1 %s</code></li>\n'%(config['domain']+"/client.html")
	this+='\t\t</ul>\n'
	this+='\t\t</body>\n'
	this+='\t\t</html>\n'
	return this

