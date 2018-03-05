def getLocation(config):
	config['webServerRoot']="/Users/jnr/Dropbox/Sites/jnromero.com/Experiments/"
	config['serverType']="regularExperiment"	
	config['serverPort']=24921
	config['webSocketPort']=13557
	ip="192.168.0.3"
	config["domain"]="http://"+ip+":"+str(config['serverPort'])
	config["websocketURL"]="ws://"+ip+":"+str(config['webSocketPort'])
	config["screenServer"]="http://"+ip+":"+str(config['screenServerPort'])
	return config