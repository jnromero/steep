import os

def setOtherFileLocations(config,serverStartString):
	config['dataFolder']=config['currentExperiment']+"/data/"+serverStartString+"/"
	if not os.path.exists(config['webServerRoot']+config['dataFolder']):
		os.makedirs(config['webServerRoot']+config['dataFolder'])

	#config['configJsURL']=config['domain']+config['dataFolder']+"/config.js"
	config['configJsURL']=config['dataFolder']+"/config.js"
	config['configJsPath']=config['webServerRoot']+config['configJsURL']

	config['dataFileURL']=config['dataFolder']+"/%s.pickle"%(serverStartString)
	config['dataFilePath']=config['webServerRoot']+config['dataFileURL']
	return config

def writeJavascriptConfigFile(config,configFile):
	string="//Config File Location: %s\n"%(configFile)
	string=string+"window.config=%s;"%(config)
	file = open(config['webServerRoot']+config['configJsURL'],'w')
	file.writelines(string)
	file.close() 
