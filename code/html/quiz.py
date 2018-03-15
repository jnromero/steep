#!/usr/bin/python

def getPage(config,tf):
    currentExperiment=config['currentExperiment']
    packageFolder=config['packageFolder']
    domain=config['domain']
    this=''
    this+='<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Traditional//EN">\n'
    this+='<html id="everything">\n'
    this+='\t<head>\n'
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['jquery.js'])
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['common.js'])
    this+='\t\t<link rel="stylesheet" type="text/css" href="%s/%s/html/auto-version/%s"/>\n'%(domain,packageFolder,tf['common']['quiz.css'])
    this+='\t\t<link rel="stylesheet" type="text/css" href="%s/%s/html/auto-version/%s"/>\n'%(domain,packageFolder,tf[currentExperiment]['experiment.css'])
    this+='\t<body>\n'
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['video.js'])
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf[currentExperiment]['experiment.js'])
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf['common']['quiz.js'])
    this+='\t\t<script type="text/javascript" src="%s/%s/html/auto-version/%s"></script>\n'%(domain,packageFolder,tf[currentExperiment]['quiz.js'])
    this+='\t</body>\n'
    this+='</html>\n'
    return this

