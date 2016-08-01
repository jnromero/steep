#!/usr/bin/python

def getPage(config):
  currentExperiment=config['currentExperiment']
  packageFolder=config['packageFolder']
  domain=config['domain']
  this="""
  <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Traditional//EN">
  <html id="everything">
    <head>
      <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/jquery-1.11.3.min.js"></script>
      <script type="text/javascript" src="<JAVASCRIPTCONFIGFILE>"></script>
      <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/common.css" />
      <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>javascript/simulateMouse/simulateMouse.css" />
      <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/instructions.css" />
      <link rel="stylesheet" type="text/css" href="<CURRENTEXPHERE>files/experiment.css" />
    </head>
    <body>
      <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/common.js"></script>
      <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/simulateMouse/simulateMouse.js"></script>
      <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/video.js"></script>
      <script type="text/javascript" src="<CURRENTEXPHERE>files/experiment.js"></script>
      <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/instructions.js"></script>
      <script type="text/javascript" src="<CURRENTEXPHERE><INSTRUCTIONSPATHHERE>instructions.js"></script>
      <script type="text/javascript" src="<CURRENTEXPHERE><INSTRUCTIONSPATHHERE>captions/captionsList.js"></script>
      <script type="text/javascript" src="<CURRENTEXPHERE><INSTRUCTIONSPATHHERE>tasks/taskList.js"></script>
      <script>

  startTime=getUrlParameter('startTime');
  if(startTime==undefined){
    startTime=0;
  }

  speed=getUrlParameter('speed');
  if(speed==undefined){
    speed=1;
  }

  window.elapsed=0+.0000001;
  message=[];
  message['source']='<CURRENTEXPHERE><INSTRUCTIONSPATHHERE>audio/output.m4a';
  message['time']=startTime;
  loadInstructions(message);
  startInstructions(message)
  document.getElementById('videoHolder').playbackRate = speed;
  </script>

    </body>
  </html>  
  """    
  this=this.replace("<JAVASCRIPTCONFIGFILE>",config["configJsURL"])
  this=this.replace("<CURRENTEXPHERE>",config['domain']+config['currentExperiment'])
  this=this.replace("<PACKAGEFOLDERHERE>",config['domain']+config['packageFolder'])
  this=this.replace("<INSTRUCTIONSPATHHERE>",config['instructionsFolder'])
  return this