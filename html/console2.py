#!/usr/bin/python
import pickle 
import sys 
import json
def getPage(config,tf,page,totalPages,currentTab):
	string="window.totalPages=%s;\n"%(totalPages)
	string+="window.page='%s';\n"%(page)
	string+="window.currentTab=%s;\n"%(currentTab)

	thisFile=config['logFolder']+"/pickle/%s.pickle"%(currentTab)
	file = open(thisFile,'rb')
	out=[]

	while 3<4:
		try:
			data=pickle.load(file)
			out.append(data)
		except:
			# print(sys.exc_info()[0])
			break
	file.close() 

	string+="window.consoleLines=%s;\n"%(json.dumps(out).encode('utf8'))


	currentExperiment=config['currentExperiment']
	packageFolder=config['packageFolder']
	domain=config['domain']
	this=''
	this+='<html>\n'
	this+='\t<head>\n'
	this+='\t\t<title>STEEP: Dashboard</title>\n'
	this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['jquery.js'])
	this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf[currentExperiment]['config.js'])
	this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['common.js'])
	this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['websocketConnect.js'])
	this+='\t\t<link rel="stylesheet" type="text/css" href="%s/%s/html/auto-version/%s" />\n'%(domain,packageFolder,tf['common']['common.css'])
	this+='\t</head>\n'
	this+='\t<body>\n'
	this+='\t\t<div id="mainDiv"></div>\n'
	this+='\t\t\t<script type="text/javascript">%s</script>\n'%(string)
	this+='\t\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['console.js'])
	this+='\t<body>\n'
	this+='</html>'

	return this

	# this=this.replace("CONSOLETEXTHERE",consoleString)
	# this=this.replace("<CURRENTLOGTABHERE>",str(currentTab))
	# this=this.replace("<TOTALPAGESHERE>",str(totalPages))
	# this=this.replace("<PAGENUMBERHERE>",str(page))
	# this=this.replace("<JAVASCRIPTCONFIGFILE>",config["configJsURL"])
	# this=this.replace("<CURRENTEXPHERE>",domain+currentExperiment)
	# this=this.replace("<PACKAGEFOLDERHERE>",domain+packageFolder)
	# this=this.replace("<DOMAINHERE>",domain)
	# return this



