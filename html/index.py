#!/usr/bin/python
import sys
import netifaces as ni


def getPage(config,tf):
  currentExperiment=config['currentExperiment']
  packageFolder=config['packageFolder']
  domain=config['domain']


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
  this+='\t\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['index.js'])
  this+='\t<body>\n'
  this+='</html>'

  return this