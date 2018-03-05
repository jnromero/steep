def getLocation(config):
	config['webServerRoot']="/Users/labAdmin/myUsername/experiments/"
	config['serverType']="regularExperiment"	
	config['serverPort']=4567
	config['webSocketPort']=5678
	ip="12.345.67.89"
	config["domain"]="http://"+ip+":"+str(config['serverPort'])
	config["websocketURL"]="ws://"+ip+":"+str(config['webSocketPort'])
	config["screenServer"]="http://"+ip+":"+str(config['screenServerPort'])
	return config