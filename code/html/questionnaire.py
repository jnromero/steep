#!/usr/bin/python


def getPage(config):
  currentExperiment=config['currentExperiment']
  packageFolder=config['packageFolder']
  domain=config['domain']
  this="""
  <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Traditional//EN">
  <html id="everything">
    <head>
      <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/common.css" />
      <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/questionnaire.css" />
      <link rel="stylesheet" type="text/css" href="<CURRENTEXPHERE>files/experiment.css" />
    </head>
    <body>
      <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/jquery-1.11.3.min.js"></script>
      <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/common.js"></script>
      <script type="text/javascript" src="<CURRENTEXPHERE>files/experiment.js"></script>
      <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/questionnaire.js"></script>
      <script>
      showQuestionnaire();
  </script>
    </body>
  </html>  
  """    

  this=this.replace("<CURRENTEXPHERE>",domain+currentExperiment).replace("<PACKAGEFOLDERHERE>",domain+packageFolder)
  return this