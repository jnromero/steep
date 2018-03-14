def getLocation(config,ip="localhost"):
	config['serverType']="regularExperiment"	
	config['serverPort']=23456
	config['webSocketPort']=34567
	config["domain"]="http://"+ip+":"+str(config['serverPort'])
	config["websocketURL"]="ws://"+ip+":"+str(config['webSocketPort'])
	return config