#!/usr/bin/python

def getPage(config):
	currentExperiment=config['currentExperiment']
	packageFolder=config['packageFolder']
	domain=config['domain']
	header=""
	if config['location']=="webfDemo":
		header="""
	<head> 
		<meta http-equiv="refresh" content="0;url=http://jnromero.com/Experiments" /> 
		<title>You are going to be redirected</title> 
	</head>"""
	
	instructions=False
	if "instructionsFolder" in config:
		instructions=True

	experimentLinks=[]
	experimentLinks.append("""<a href="<DOMAINHERE>/console.html">Console</a>""")
	experimentLinks.append("""<a href="<DOMAINHERE>/client.html">Client</a>""")
	experimentLinks.append("""<a href="<DOMAINHERE>/monitor.html">Monitor</a>""")
	if instructions==True:
		experimentLinks.append("""<a href="<DOMAINHERE>/video.html">Front of Class Instructions</a>""")

	demoLinks=[]
	if instructions==True:
		demoLinks.append("""<a href="<DOMAINHERE>/instructions.html">Instructions</a>""")
	if "quiz" in config:
		if config['quiz']=="True":
			demoLinks.append("""<a href="<DOMAINHERE>/quiz.html">Quiz</a>""")
	demoLinks.append("""<a href="<DOMAINHERE>/questionnaire.html">Questionnaire</a>""")
	demoLinks.append("""<a href="<PACKAGEFOLDERHERE>docs/docs.html">Docs</a>""")

	this="""<!DOCTYPE HTML>
	<html id="everything">
	%s
	  <body>
	    <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/common.js"></script>
	    <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/index.css" />

	<div id="container">

	<div id="currentExperiment">Current Experiment: %s</div>
	<ul id="indexExperimentLinks">
"""%(header,currentExperiment)
	for k in experimentLinks:
		this=this+k+"\n"
	this=this+"\n</ul>\n\n<ul id='indexDemoLinks'>"

	for k in demoLinks:
		this=this+k+"\n"

	this=this+"""
	</ul>
	<div id="screenServer" onclick="window.location='%s';">Screen Server</div>
	</div>

	<ul>
	<li> Window launch: </br>
	<code>C:\Program Files (x86)\Google\Chrome\Application\chrome.exe -kiosk --no-default-browser-check --disk-cache-size=1 --media-cache-size=1 %s</code>
	</li>
	<li> Mac launch: </br>
	<code>/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome -kiosk --no-default-browser-check --disk-cache-size=1 --media-cache-size=1 %s</code>
	</li>
	</body>
	</html>
	"""%(config['screenServer'],config['domain']+"/client.html",config['domain']+"/client.html")


	this=this.replace("<CURRENTEXPHERE>",domain+currentExperiment).replace("<PACKAGEFOLDERHERE>",domain+packageFolder).replace("<DOMAINHERE>",domain)
	return this