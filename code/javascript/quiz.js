function drawStatement(message){
	var left=message['location'][0]
	var top=message['location'][1]
	var width=message['size'][0]
	var height=message['size'][1]
	var statement=message['statement']
	var questionNumber=message['questionNumber']
	var options=message['options']
	var result=message['result']
	var questionBox = createAndAddDiv("quizQuestionStatement",'mainDiv');
    questionBox.style.top=top+"px";
    questionBox.style.left=left+"px";
    questionBox.style.width=width+"px";
    questionBox.style.height=height+"px";
    questionBox.innerHTML=statement;

	if(window.state['quizQuestionStatus']=="blank"){
		makeDropdownQuiz(options)
		var quizSubmitAnswerButton=createAndAddElement("button","quizSubmitAnswerButton","quizQuestionStatement");
		quizSubmitAnswerButton.className="quizAnswerButton"
		quizSubmitAnswerButton.innerHTML="Submit";
		clickButton("once","quizSubmitAnswerButton",checkAnswer);
    }
	else if(window.state['quizQuestionStatus']=="noButton"){
		//Nothing to draw
    }

	else if(window.state['quizQuestionStatus']=="incorrect"){
		var correctOrNot=createAndAddElement("div","correctOrNot","quizQuestionStatement");
		correctOrNot.innerHTML=window.state['answer']+" is incorrect, Try Again.";
		correctOrNot.style.color="red";

		var quizTryAgainButton=createAndAddElement("button","quizTryAgainButton","quizQuestionStatement");
		quizTryAgainButton.className="quizAnswerButton"
		quizTryAgainButton.innerHTML="Try Again";
		clickButton("once","quizTryAgainButton",tryCurrentQuestionAgain);
    }

	else if(window.state['quizQuestionStatus']=="correct"){
		var correctOrNot=createAndAddElement("div","correctOrNot","quizQuestionStatement");
		correctOrNot.innerHTML=window.state['answer']+" is correct!";
		correctOrNot.style.color="green";

		var quizNextQuestionButton=createAndAddElement("button","quizNextQuestionButton","quizQuestionStatement");
		quizNextQuestionButton.className="quizAnswerButton"
		quizNextQuestionButton.innerHTML="Next";
		clickButton("once","quizNextQuestionButton",getNextQuestion);
    }
}

function checkAnswer(args){
	var questionNumber=args[0];
	var answer=document.getElementById("quizAnswer").value;
	var message={"type":"checkQuizAnswer","questionNumber":questionNumber,"answer":answer};
    sendMessage(message);
}

function getNextQuestion(){
	var message={"type":"getNextQuestion"};
	sendMessage(message);
}

function tryCurrentQuestionAgain(){
	var message={"type":"tryCurrentQuestionAgain"};
	sendMessage(message);
}

function makeDropdownQuiz(options){
    var select=createAndAddElement("select","quizAnswer","quizQuestionStatement");
    for(k=0;k<options.length;k++){
	    var option = document.createElement("option");
	    option.value=options[k];
	    option.innerHTML=options[k];
	    select.appendChild(option);
    }
}

