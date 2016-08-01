#!/usr/bin/python


def getPage(config):
    currentExperiment=config['currentExperiment']
    packageFolder=config['packageFolder']
    domain=config['domain']
    this="""
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Traditional//EN">
    <html id="everything">
      <head>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>config/config.js"></script>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/common.js"></script>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/websocketConnect.js"></script>
        <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/instructions.css" />
        <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/common.css" />
        <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>javascript/simulateMouse/simulateMouse.css" />
        <link rel="stylesheet" type="text/css" href="<CURRENTEXPHERE>files/experiment.css" />
      </head>
      <body>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/jquery-1.11.3.min.js"></script>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/simulateMouse/simulateMouse.js"></script>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/video.js"></script>
        <script type="text/javascript" src="<CURRENTEXPHERE>files/experiment.js"></script>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/instructions.js"></script>
        <script type="text/javascript" src="<CURRENTEXPHERE><INSTRUCTIONSPATHHERE>instructions.js"></script>
        <script type="text/javascript" src="<CURRENTEXPHERE><INSTRUCTIONSPATHHERE>captions/captionsList.js"></script>
        <script type="text/javascript" src="<CURRENTEXPHERE><INSTRUCTIONSPATHHERE>tasks/taskList.js"></script>
        <script>
        message="Instructions Screen";
        genericScreen(message);
        </script>
      </body>
    </html>       
    """    

    this=this.replace("<CURRENTEXPHERE>",config['domain']+config['currentExperiment'])
    this=this.replace("<PACKAGEFOLDERHERE>",config['domain']+config['packageFolder'])
    this=this.replace("<INSTRUCTIONSPATHHERE>",config['instructionsFolder'])
    return this