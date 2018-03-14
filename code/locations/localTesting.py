def getLocation(config,ip="localhost"):
	config['webServerRoot']="/Users/jnr/Dropbox/Sites/jnromero.com/Experiments/"
	config['serverType']="regularExperiment"	
	config['serverPort']=24921
	config['webSocketPort']=13557
	config["domain"]="http://jnromero.com/testing"
	config["websocketURL"]="ws://jnromero.com/testingWS"
	return config