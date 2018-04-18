from __future__ import print_function,division,absolute_import   
import os

def setOtherFileLocations(config):
	config['dataFolder']=config['currentExperiment']+"/data/"+config['serverStartString']+"/"

	config['configJsURL']=config['domain']+config['dataFolder']+"/config.js"
	config['configJsRelative']=config['dataFolder']+"/config.js"
	config['configJsPath']=config['webServerRoot']+config['dataFolder']+"/config.js"

	config['dataFileRelativePath']=config['dataFolder']+"/%s.pickle"%(config['serverStartString'])
	config['dataFolderURL']=config['domain']+config['currentExperiment']+"/data/"+config['serverStartString']+".zip"
	config['dataFilePath']=config['webServerRoot']+config['dataFileRelativePath']
	config['dataFileURL']=config['domain']+config['dataFileRelativePath']

	config['fullDataFolder']=config['webServerRoot']+config['dataFolder']
	config['logFolder']=config['fullDataFolder']+"/logs/"
	config['messageLogFile']=config['logFolder']+"/messages/messagesLog.pickle"
	config['twistedLogFile']=config['logFolder']+"/twistedLog.log"
	config['fullLogFile']=config['logFolder']+"/fullLog.pickle"

	makeFolderIfNeeded(config['fullDataFolder'])
	makeFolderIfNeeded(config['logFolder'])
	makeFolderIfNeeded(config['logFolder']+"messages/")
	makeFolderIfNeeded(config['logFolder']+"txt/")
	makeFolderIfNeeded(config['logFolder']+"pickle/")


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

	filename=config['logFolder']+"/messages/messagesLogViewer.py"
	file = open(filename,'w')
	file.writelines(string)
	file.close() 





	return config

def writeJavascriptConfigFile(config):
	string="window.config=%s;"%(config)
	string=string.replace(",",",\n\t")
	file = open(config['webServerRoot']+config['configJsRelative'],'w')
	file.writelines(string)
	file.close() 

def makeFolderIfNeeded(folder):
	if not os.path.exists(folder):
		os.makedirs(folder)
