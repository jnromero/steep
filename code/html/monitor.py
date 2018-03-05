#!/usr/bin/python
import imp

def getPage(config):
  pf = imp.load_source('pf', config['webServerRoot']+config['packageFolder']+"/html/pageFunctions.py")
  files=pf.getFiles(config)
  this=''
  this+='<html>\n'
  this+='\t<head>\n'
  this+='\t\t<title>STEEP: Monitor</title>\n'
  this+=pf.javascriptLine(files['common']['jquery.js'])
  this+=pf.javascriptLine(files["exp"]['config.js'])
  this+=pf.javascriptLine(files['common']['common.js'])
  this+=pf.javascriptLine(files['common']['monitorGeneral.js'])
  this+=pf.javascriptLine(files['common']['websocketConnect.js'])
  this+=pf.cssLine(files['common']['switch.css'])
  this+=pf.cssLine(files['common']['monitor.css'])
  this+=pf.cssLine(files['common']['common.css'])
  this+='\t</head>\n'
  this+='\t<body>\n'
  this+='\t\t<div id="mainDiv"></div>\n'
  this+=pf.javascriptLine(files['common']['monitor.js'])
  this+='\t</body>\n'
  this+='</html>'

  return this