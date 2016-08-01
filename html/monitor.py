#!/usr/bin/python


def getPage(config):
  currentExperiment=config['currentExperiment']
  packageFolder=config['packageFolder']
  domain=config['domain']

  this="""
  <html>
    <head>
      <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/jquery-1.11.3.min.js"></script>
      <script type="text/javascript" src="<JAVASCRIPTCONFIGFILE>"></script>
      <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/common.js"></script>
      <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/websocketConnect.js"></script>
      <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/common.css" />
      <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/switch.css" />
      <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/monitor.css" />
    </head>
    <body>

        <div id="mainDiv"></div>
      <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/monitor.js"></script>
      <!--<script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/console.js"></script>-->
       <script src="<PACKAGEFOLDERHERE>javascript/video.js"></script>
  </body>

  </html>
  """    
  this=this.replace("<JAVASCRIPTCONFIGFILE>",config["configJsURL"])
  this=this.replace("<CURRENTEXPHERE>",domain+currentExperiment)
  this=this.replace("<PACKAGEFOLDERHERE>",domain+packageFolder)
  this=this.replace("<DOMAINHERE>",domain)
  return this