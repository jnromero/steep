def getLocation(config):
	config['webServerRoot']="/home/jnromero/Sites/jnromero.com/Experiments/"
	config['serverType']="regularExperiment"	
	config['serverPort']=24921
	config['webSocketPort']=13557
	config["domain"]="http://jnromero.com/experiment"
	config["websocketURL"]='ws://jnromero.com/webSockets/experiment'
	config["screenServer"]="http://jnromero.com/screenServer/"
	return config