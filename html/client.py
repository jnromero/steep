#!/usr/bin/python

def getPage(config,tf):
    currentExperiment=config['currentExperiment']
    packageFolder=config['packageFolder']
    domain=config['domain']

    this=''
    this+='<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Traditional//EN">\n'
    this+='<html id="everything">\n'
    this+='\t<head>\n'
    this+='\t\t<title>STEEP: Client</title>\n'
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['jquery.js'])
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['velocity.js'])
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf[currentExperiment]['config.js'])
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['common.js'])
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['websocketConnect.js'])
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['quiz.js'])
    this+='\t\t<link rel="stylesheet" type="text/css" href="%s/%s/html/auto-version/%s"/>\n'%(domain,packageFolder,tf['common']['instructions.css'])
    this+='\t\t<link rel="stylesheet" type="text/css" href="%s/%s/html/auto-version/%s"/>\n'%(domain,packageFolder,tf['common']['common.css'])
    this+='\t\t<link rel="stylesheet" type="text/css" href="%s/%s/html/auto-version/%s"/>\n'%(domain,packageFolder,tf['common']['quiz.css'])
    this+='\t\t<link rel="stylesheet" type="text/css" href="%s/%s/html/auto-version/%s"/>\n'%(domain,packageFolder,tf['common']['questionnaire.css'])
    this+='\t\t<link rel="stylesheet" type="text/css" href="%s/%s/html/auto-version/%s"/>\n'%(domain,packageFolder,tf['common']['simulateMouse.css'])
    this+='\t\t<link rel="stylesheet" type="text/css" href="%s/%s/html/auto-version/%s"/>\n'%(domain,packageFolder,tf[currentExperiment]['experiment.css'])
    this+='\t</head>\n'
    this+='\t<body>\n'
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['simulateMouse.js'])
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['video.js'])
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf[currentExperiment]['experiment.js'])
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['instructions.js'])
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['questionnaire.js'])


    instructions=False
    if "instructionsFolder" in config:
        instructions=True
    if instructions==True:
            this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf[currentExperiment]['instructions.js'])

    this+='\t</body>\n'
    this+='</html>'

    return this