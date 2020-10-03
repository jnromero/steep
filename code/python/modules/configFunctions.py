import os
from pathlib import Path

def setOtherFileLocations(config):
	config['dataFolder']=str(Path(config['currentExperiment']).joinpath("data",config['serverStartString']))
	config['configJsURL']=str(Path(config['domain'])/Path(config['dataFolder']).joinpath("config.js")).replace("https:/","https://").replace("http:/","http://")
	config['configJsRelative']=str(Path(config['dataFolder']).joinpath("config.js"))
	config['configJsPath']=str(Path(config['webServerRoot'])/Path(config['dataFolder']).joinpath("config.js"))

	config['dataFileRelativePath']=str(Path(config['dataFolder']).joinpath("%s.pickle"%(config['serverStartString'])))
	config['dataFolderURL']=str(Path(config['domain'])/Path(config['currentExperiment']).joinpath("data",config['serverStartString']+".zip")).replace("https:/","https://").replace("http:/","http://")
	config['dataFilePath']=str(Path(config['webServerRoot'])/Path(config['dataFileRelativePath']))
	config['dataFileURL']=str(Path(config['domain'])/Path(config['dataFileRelativePath'])).replace("https:/","https://").replace("http:/","http://")

	config['fullDataFolder']=str(Path(config['webServerRoot'])/Path(config['dataFolder']))
	config['logFolder']=str(Path(config['fullDataFolder']).joinpath("logs"))
	config['messageLogFile']=str(Path(config['logFolder']).joinpath("messages","messagesLog.pickle"))
	config['twistedLogFile']=str(Path(config['logFolder']).joinpath("twistedLog.log"))
	config['fullLogFile']=str(Path(config['logFolder']).joinpath("fullLog.pickle"))

	makeFolderIfNeeded(Path(config['fullDataFolder']))
	makeFolderIfNeeded(Path(config['logFolder']))
	makeFolderIfNeeded(Path(config['logFolder']).joinpath("messages/"))
	makeFolderIfNeeded(Path(config['logFolder']).joinpath("txt/"))
	makeFolderIfNeeded(Path(config['logFolder']).joinpath("pickle/"))


	string="""import pickle 
filename='messagesLog.pickle'
with open(filename,'rb') as f:
	while True:
		try:
			data=pickle.load(f)
			print data
			print data[0],data[1],data[2]['type'],data[2]['sid']
			raw_input() 
		except Exception,e: 
			print str(e)
			break
"""

	filename=Path(config['logFolder']).joinpath("messages","messagesLogViewer.py")
	file = open(filename,'w')
	file.writelines(string)
	file.close() 

	return config

def writeJavascriptConfigFile(config):
	string="window.config=%s;"%(config)
	string=string.replace(",",",\n\t")
	file = open(Path(config['webServerRoot'])/Path(config['configJsRelative']),'w')
	file.writelines(string)
	file.close() 

def makeFolderIfNeeded(folder):
	if not os.path.exists(folder):
		os.makedirs(folder)
