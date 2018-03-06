// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // //  Message // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

function sendParameters(msg){
    window.payoffVariable=msg['payoffVariable'];
}

function updateNumberClicks(msg){
    console.log(msg['number']);
    document.getElementById("numberClicks").innerHTML="There have been " + msg['number'] + " clicks so far.";
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // //  Draw Interface // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

function drawButton() {
    placeText({"divid":"makeChoiceButton","text":"Click Here to Submit","top":"400px","left":"700px","width":"200px","height":"100px","backgroundColor":"rgba(255,0,0,.11)",'border':'5px solid transparent'})
    clickButton("many","makeChoiceButton",makeChoiceButtonClicked,27);
    hoverDivChangeOtherDiv("makeChoiceButton","makeChoiceButton",{'border':'5px solid red'});
}

function drawMatch(currentMatch) {
    var matchText = createAndAddDiv("matchText","mainDiv");
    var thisText = "Match #" + currentMatch + "  Time: <time id='everyoneTimer'>0</time>";
    placeText({"divid":"matchText","text":thisText,"top":"200px","left":"600px","width":"400px","height":"100px","fontSize":"25px"});

    if(window.state['warning']=="yes"){
        var thisColor="red";
        var thisText = "Please make choice!!!";
    }
    else{
        var thisColor="black";
        var personalTimer="myTimeCanBeLabledAnything"+window.state['subjectID']
        var thisText = "My Personal Timer That is Subject Specific: <time id='"+personalTimer+"'>0</time>";
        moveTimer(personalTimer);
    }

    placeText({"divid":"myMatchText","color":thisColor,"text":thisText,"top":"600px","height":"100px","fontSize":"25px","lineHeight":"50px","width":"100%"});

    moveTimer("everyoneTimer");
}

function drawStatus(number) {
    var thisText = "There have been " + number + " clicks so far.";
    placeText({"divid":"numberClicks","text":thisText,"top":"700px","left":"600px","width":"400px","height":"100px","fontSize":"25px"});
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // //  Actions // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

function makeChoiceButtonClicked(someVariable) {
    var message = { "type": "makeChoice", "variable": someVariable };
    for(k=0;k<1000;k++){
        window.setTimeout(function(){
            sendMessage(message);
        }, k);
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // //  Pages // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

function game(){
    clearAll();
    drawButton();
    drawMatch(thisStatus['currentMatch']);
    drawStatus(thisStatus['numberClicks']);
}

function postMatch(){
    clearAll();
    genericScreen("That match is over.  The next match will start in <time id='timer'>0</time>");
    moveTimer("timer");
}