#!/usr/bin/python

def getOriginalFiles(config):
    packageFolder=config['packageFolder']
    currentExperiment=config['currentExperiment']

    files={}
    files['common']={}

    files['common']['jquery.js']=packageFolder+"javascript/jquery-1.11.3.min.js"
    files['common']['velocity.js']=packageFolder+"javascript/velocity.min.js"
    files['common']['common.js']=packageFolder+"javascript/common.js"
    files['common']['websocketConnect.js']=packageFolder+"javascript/websocketConnect.js"
    files['common']['video.js']=packageFolder+"javascript/video.js"
    files['common']['instructions.js']=packageFolder+"javascript/instructions.js"
    files['common']['monitor.js']=packageFolder+"javascript/monitor.js"
    files['common']['index.js']=packageFolder+"javascript/index.js"
    files['common']['questionnaire.js']=packageFolder+"javascript/questionnaire.js"
    files['common']['quiz.js']=packageFolder+"javascript/quiz.js"
    files['common']['console.js']=packageFolder+"javascript/console.js"

    files['common']['simulateMouse.css']=packageFolder+"javascript/simulateMouse/simulateMouse.css"
    files['common']['simulateMouse.js']=packageFolder+"javascript/simulateMouse/simulateMouse.js"

    files['common']['instructions.css']=packageFolder+"css/instructions.css"
    files['common']['common.css']=packageFolder+"css/common.css"
    files['common']['index.css']=packageFolder+"css/index.css"
    files['common']['switch.css']=packageFolder+"css/switch.css"
    files['common']['monitor.css']=packageFolder+"css/monitor.css"
    files['common']['quiz.css']=packageFolder+"css/quiz.css"
    files['common']['questionnaire.css']=packageFolder+"css/questionnaire.css"

    files[currentExperiment]={}
    files[currentExperiment]['config.js']=config["configJsURL"]
    files[currentExperiment]['experiment.css']=currentExperiment+"files/experiment.css"
    files[currentExperiment]['experiment.js']=currentExperiment+"files/experiment.js"

    if "instructionsFolder" in config:
        instructionsFolder=currentExperiment+config['instructionsFolder']
        files[currentExperiment]['instructions.js']=instructionsFolder+"instructions.js"

    return files

