def getLocation(config):
	config['webServerRoot']="/Users/myUsername/experiments/"
	config['serverType']="regularExperiment"	
	config['serverPort']=2345
	config['webSocketPort']=3456
	ip="localhost"
	config["domain"]="http://"+ip+":"+str(config['serverPort'])
	config["websocketURL"]="ws://"+ip+":"+str(config['webSocketPort'])
	config["screenServer"]="http://"+ip+":"+str(config['screenServerPort'])
	return config