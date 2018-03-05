#!/usr/bin/python
import sys
import netifaces as ni
import imp


def getPage(config):
  pf = imp.load_source('pf', config['webServerRoot']+config['packageFolder']+"/html/pageFunctions.py")
  thisVersion=sys.version.split("\n")[0]
  thisVersion=thisVersion.replace("\"","'")
  string="window.pythonVersion=\"%s\";\n"%(thisVersion)
  string+="window.pythonExecutable=\"%s\";"%(sys.executable)
  ips=[]
  for k in ni.interfaces():
     ni.ifaddresses(k)
     try:  
        ip = ni.ifaddresses(k)[2][0]['addr']
        ips.append(["%s"%(k),"%s"%(ip)])
     except:
        "no address"
  string+="window.ipAddresses=%s;"%(ips)
  files=pf.getFiles(config)


  this=''
  this+='<html>\n'
  this+='\t<head>\n'
  this+='\t\t<title>STEEP: Dashboard</title>\n'
  this+=pf.javascriptLine(files['common']['jquery.js'])
  this+=pf.javascriptLine(files["exp"]['config.js'])
  this+=pf.javascriptLine(files['common']['common.js'])
  this+=pf.javascriptLine(files['common']['websocketConnect.js'])
  this+=pf.cssLine(files['common']['common.css'])
  this+='\t</head>\n'
  this+='\t<body>\n'
  this+='\t\t<div id="mainDiv"></div>\n'
  this+='\t\t\t<script type="text/javascript">%s</script>\n'%(string)
  this+=pf.javascriptLine(files['common']['index.js'])
  this+='\t<body>\n'
  this+='</html>'

  return this