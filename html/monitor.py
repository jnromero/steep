#!/usr/bin/python


def getPage(config,tf):
  currentExperiment=config['currentExperiment']
  packageFolder=config['packageFolder']
  domain=config['domain']

  this=''
  this+='<html>\n'
  this+='\t<head>\n'
  this+='\t\t<title>STEEP: Monitor</title>\n'
  this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['jquery.js'])
  this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf[currentExperiment]['config.js'])
  this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['common.js'])
  this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['websocketConnect.js'])
  this+='\t\t<link rel="stylesheet" type="text/css" href="%s/%s/html/auto-version/%s" />\n'%(domain,packageFolder,tf['common']['common.css'])
  this+='\t\t<link rel="stylesheet" type="text/css" href="%s/%s/html/auto-version/%s" />\n'%(domain,packageFolder,tf['common']['switch.css'])
  this+='\t\t<link rel="stylesheet" type="text/css" href="%s/%s/html/auto-version/%s" />\n'%(domain,packageFolder,tf['common']['monitor.css'])
  this+='\t</head>\n'
  this+='\t<body>\n'
  this+='\t\t<div id="mainDiv"></div>\n'
  this+='\t\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['monitor.js'])
  this+='\t\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['video.js'])
  this+='\t<body>\n'
  this+='</html>'

  return this