#!/usr/bin/python

def getPage(config):
    currentExperiment=config['currentExperiment']
    packageFolder=config['packageFolder']
    domain=config['domain']

    instructionsJS=""
    captionsJS=""
    tasksJS=""
    quizJS=""

    instructions=False
    if "instructionsFolder" in config:
        instructions=True
    if instructions==True:
        instructionsJS="""<script type="text/javascript" src="<CURRENTEXPHERE><INSTRUCTIONSPATHHERE>instructions.js"></script>"""
        captionsJS="""<script type="text/javascript" src="<CURRENTEXPHERE><INSTRUCTIONSPATHHERE>captions/captionsList.js"></script>"""
        tasksJS="""<script type="text/javascript" src="<CURRENTEXPHERE><INSTRUCTIONSPATHHERE>tasks/taskList.js"></script>"""

    if "quiz" in config:
        if config['quiz']=="True":
            quizJS="""<script type="text/javascript" src="<CURRENTEXPHERE>files/quiz.js"></script>"""


    this="""
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Traditional//EN">
    <html id="everything">
      <head>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/jquery-1.11.3.min.js"></script>
        <script type="text/javascript" src="<JAVASCRIPTCONFIGFILE>"></script>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/common.js"></script>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/websocketConnect.js"></script>
        <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/instructions.css" />
        <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/common.css" />
        <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/quiz.css" />
        <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>css/questionnaire.css" />
        <link rel="stylesheet" type="text/css" href="<PACKAGEFOLDERHERE>javascript/simulateMouse/simulateMouse.css" />
        <link rel="stylesheet" type="text/css" href="<CURRENTEXPHERE>files/experiment.css" />
      </head>
      <body>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/simulateMouse/simulateMouse.js"></script>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/video.js"></script>
        <script type="text/javascript" src="<CURRENTEXPHERE>files/experiment.js"></script>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/instructions.js"></script>
        <script type="text/javascript" src="<PACKAGEFOLDERHERE>javascript/questionnaire.js"></script>
        quizJSHERE
        instructionsJSHERE
        captionsJSHERE
        tasksJSHERE
      </body>
    </html>       
    """    

    this=this.replace("instructionsJSHERE",instructionsJS)
    this=this.replace("captionsJSHERE",captionsJS)
    this=this.replace("tasksJSHERE",tasksJS)
    this=this.replace("quizJSHERE",quizJS)


    this=this.replace("<JAVASCRIPTCONFIGFILE>",config["configJsURL"])
    this=this.replace("<CURRENTEXPHERE>",config['domain']+config['currentExperiment'])
    this=this.replace("<PACKAGEFOLDERHERE>",config['domain']+config['packageFolder'])
    if instructions==True:
        this=this.replace("<INSTRUCTIONSPATHHERE>",config['instructionsFolder'])
    return this