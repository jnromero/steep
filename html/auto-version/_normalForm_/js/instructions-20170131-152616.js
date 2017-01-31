function setInstructionParameters(){
    msg={
    	'colActions': {1: 'L', 2: 'R'}, 
    	'colColors': {1: 'rgba(152,78,163,1)', 2: 'rgba(255,127,0,1)', 3: 'rgba(200,200,51,1)'}, 
    	'exchangeRate': 0.05, 
    	'rowActions': {1: 'U', 2: 'D'}, 
    	'rowColors': {1: 'rgba(228,26,28,1)', 2: 'rgba(55,126,184,1)', 3: 'rgba(77,175,74,1)'}, 
    	'pays': {1: {1: [8, 1], 2: [7, 2]}, 2: {1: [6, 3], 2: [5, 4]}}, 
    	'numberOfCols': 2, 
    	'numberOfRows': 2, 
    	'type': 'parameters'}
    parameters(msg);
    window.state={
    	'correctGuesses': 8, 
    	'period': 19, 
    	'myMatchPay': 180, 
    	'myTotalPay': 470, 
    	'theirMatchPay': 190, 
        'stage': 'noChoices', 
        'rowSelected': 'No', 
        'colSelected': 'No', 
    	'page': 'game', 
    	'match': 2, 
    	'history': [[2, 1], [1, 1], [1, 1], [1, 2], [2, 1], [1, 2], [2, 2], [1, 2], [1, 1], [1, 1], [1, 1], [1, 1], [2, 2], [2, 2], [1, 2], [1, 1], [1, 2], [2, 1], [2, 2]]
    }
    updateStatusOnServer();
}

function updateStatusOnServer(){
	var pageName=location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
	if(pageName=="client.html" || pageName=="client.py" ){
	    var message={"type":"updateStatusFromClient","status":window.state};
	    sendMessage(message);
	}
    statusManager();
}


function nextPeriod(){
    console.log(window.state);
    statusManager();
}


function finishPeriodInstructions(){
    console.log("finishPeriodInstructions")
	window.state["history"].push([1,1]);
	window.state["othersChoice"]=1;
	window.state["theirMatchPay"]=191;
	window.state["myMatchPay"]=188;
	window.state["myTotalPay"]=478;
	window.state["stage"]="periodSummary";
	updateStatusOnServer();
	//statusManager();
}

function selectRowInstructions1(){
	window.state["rowSelected"]=1;
    console.log(window.state);
	updateStatusOnServer();
	//statusManager();
}

function selectColInstructions1(){
	window.state["colSelected"]=2;
	updateStatusOnServer();
	//statusManager();
}

function moveToNextPeriodInstructions(){
	window.state["period"]=window.state["period"]+1;
	window.state["stage"]="noChoices";
    window.state["colSelected"]="No";
    window.state["rowSelected"]="No";
	updateStatusOnServer();
	//statusManager();
}




