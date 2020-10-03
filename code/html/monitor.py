#!/usr/bin/python
import imp
import sys
import netifaces as ni
from pathlib import Path 


def getPage(config):
  pf = imp.load_source('pf',str(Path(config['webServerRoot'])/Path(config['packageFolder']).joinpath("html","pageFunctions.py")))
  thisVersion=sys.version.split("\n")[0]
  thisVersion=thisVersion.replace("\"","'")
  string=""
  string+="\n\nwindow.pythonVersion=\"%s\";\n"%(thisVersion)
  string+="window.pythonExecutable=\"%s\";\n"%(sys.executable)
  ips=[]
  for k in ni.interfaces():
    ni.ifaddresses(k)
    try:  
      ip = ni.ifaddresses(k)[2][0]['addr']
      ips.append(["%s"%(k),"%s"%(ip)])
    except Exception as e: 
      # print("error getting ips",str(e))
      "no address"

  ips=[[str(y.encode("utf-8")) for y in x] for x in ips]
  string+="window.ipAddresses=%s;\n"%(ips)
  files=pf.getFiles(config)
  this=''
  this+='<html>\n'
  this+='\t<head>\n'
  this+='\t\t<title>STEEP: Monitor</title>\n'
  this+=pf.addExternalFiles(config,"headStart")
  this+=pf.javascriptLine(files["exp"]['config.js'])
  this+=pf.javascriptLine(files['common']['jquery.js'])
  this+=pf.javascriptLine(files["exp"]['monitor.js'])
  this+=pf.javascriptLine(files['common']['common.js'])
  this+=pf.javascriptLine(files['common']['websocketConnect.js'])
  this+=pf.javascriptLine(files['common']['chat.js'])
  this+=pf.cssLine(files['common']['monitor.css'])
  this+=pf.cssLine(files['common']['common.css'])
  this+=pf.cssLine(files['common']['chat.css'])
  this+=pf.addExternalFiles(config,"headEnd")
  this+='\t</head>\n'
  this+='\t<body>\n'
  this+=pf.addExternalFiles(config,"bodyStart")
  this+='\t\t<div id="mainDiv"></div>\n'
  this+='\t\t\t<script type="text/javascript">%s;</script>\n'%(string)
  this+=pf.javascriptLine(files['common']['monitor.js'])
  this+=pf.addExternalFiles(config,"bodyEnd")
  this+='\t</body>\n'
  this+='</html>'

  return this