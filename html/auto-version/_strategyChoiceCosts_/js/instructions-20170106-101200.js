
function reconnectInstructions(incoming){
    reloadInstructions(incoming);
}



function moveInstructions(){
    window.instructionDemoIndex=0;
    window.instructionInput=[[["w","w"],1,1,9],[["y","w"],1,1,8],[["y","y"],0,1,6],[["w","y"],0,1,7]];
    pf=partial(newPeriodTest);
    window.moveInstructions=setInterval(pf,10000);
}

function stopInstructions(){
    clearInterval(window.moveInstructions);
}



function addLongerRuleInstructions(){
	seq=[
		["moveToDiv",250,"regular_plusConstructorButton"],
		["click",400,partial(constructorPlusMinus,"+",-1,"regular")],
		["moveToDiv",250,"regular_plusConstructorButton"],
		["click",400,partial(constructorPlusMinus,"+",-1,"regular")],
		["moveToDiv",250,"square_0_0"],
		["click",400,partial(setConstructorEntry,"square_0_0",0,0,1)],
		["click",400,partial(setConstructorEntry,"square_0_0",0,0,0)],
		["moveToDiv",250,"square_1_0"],
		["click",400,partial(setConstructorEntry,"square_1_0",0,1,0)],
		["moveToDiv",250,"square_2_0"],
		["click",400,partial(setConstructorEntry,"square_2_0",0,2,1)],
		["click",400,partial(setConstructorEntry,"square_2_0",0,2,0)],
		["moveToDiv",250,"square_3_0"],
		["click",400,partial(setConstructorEntry,"square_3_0",0,3,0)],
		["click",400,partial(setConstructorEntry,"square_3_0",0,3,1)],
		["moveToDiv",250,"square_0_1"],
		["click",400,partial(setConstructorEntry,"square_0_1",1,0,1)],
		["click",400,partial(setConstructorEntry,"square_0_1",1,0,0)],
		["moveToDiv",250,"square_1_1"],
		["click",400,partial(setConstructorEntry,"square_1_1",1,1,1)],
		["moveToDiv",250,"square_2_1"],
		["click",400,partial(setConstructorEntry,"square_2_1",1,2,1)],
		["click",400,partial(setConstructorEntry,"square_2_1",1,2,0)],
		["moveToDiv",500,"constructorSubmitButton"],
		["click",400,function(){addRuleInstructions([[0,0],[0,1],[0,0],[1]],10);window.nextPeriodPlay=1;window.nextPeriodRuleLength=3;window.nextPeriodRule=10;drawNextAction("regular");}],
		["moveToDiv",1000,"listEntryTitle_10"],
		["moveToDiv",500,"regular_history_square_29_0"]
		];

	startMouseSequence(seq,0)
}

function createNewHypHistoryInstruction(){
	seq=[
		["moveToDiv",500,"hypSliderButton_Add"],
		["click",400,"addHypHistory"],
	]
	startMouseSequence(seq,0);
}

function addRuleToHypStarting(){
    window.ruleSets["regular"].push([[0,1],[1,0],[1]]);
    window.ruleNumbers["regular"].push(2);
    window.ruleLastUsed["regular"].push(0);
    window.ruleFrequency["regular"].push(0);
	drawRules("hypActual");
}


function deleteRuleHypInstructions(ruleNumberIN){
	thisIndex=window.ruleNumbers["regular"].indexOf(ruleNumberIN);
 	window.ruleSets["regular"].splice(thisIndex,1)
	window.ruleNumbers["regular"].splice(thisIndex,1)
	window.ruleLastUsed["regular"].splice(thisIndex,1)
	window.ruleFrequency["regular"].splice(thisIndex,1)
    drawRules("hyp");
    drawRules("hypActual");
}

function addRuleInstructions(ruleIN,ruleNumberIN){
    window.ruleSets["regular"].push(ruleIN);
    window.ruleNumbers["regular"].push(ruleNumberIN);
    window.ruleLastUsed["regular"].push(0);
    window.ruleFrequency["regular"].push(0);
    drawRules("regular");
    window.constructors["regular"]=[[-1,-1],[-1]];
    drawConstructor("regular");
    drawNextAction("regular");
    highlightRule("regular",window.nextPeriodRule,window.nextPeriodRuleLength);
  highlightPayoffs();
}


function deleteRuleInstructions(ruleIN,ruleNumberIN){
	thisIndex=window.ruleNumbers["regular"].indexOf(ruleNumberIN);
 	window.ruleSets["regular"].splice(thisIndex,1)
	window.ruleNumbers["regular"].splice(thisIndex,1)
	window.ruleLastUsed["regular"].splice(thisIndex,1)
	window.ruleFrequency["regular"].splice(thisIndex,1)
     drawRules("regular");
 //    window.constructors["regular"]=[[-1,-1],[-1]];
 //    drawConstructor("regular");
    drawNextAction("regular");
    highlightRule("regular",window.nextPeriodRule,window.nextPeriodRuleLength);
  highlightPayoffs();
}

function switchRuleInstructions(ruleIN,ruleNumberIN){
	deleteRuleInstructions(ruleIN,ruleNumberIN);
	addRuleInstructions([[0,1],[1,0],[1]],7)
}



function lockRulesInstructions(){
    deleteDiv("inGameMessage");
    deleteDiv("regularConstructorDiv");
    deleteDiv("defaultDiv");
    drawInfo();
    drawLock();
    drawUnlockButton();
}

function unlockRulesInstructions(){
    window.totalPayoff=1234;
    window.unlockCosts=500;
    window.ruleLockFixedCost=250;
    drawInfo();
	deleteDiv("rulesLocked");
	// window.ruleLockFixedCost=0
	window.ruleLockMarginalCost=1;
	drawLockButton();
	window.constructors["regular"]=[[-1,-1],[-1]];
	window.rulesUnlocked=1;
	window.unlockedTimeUpdate=(new Date()).getTime();
	window.currentUnlockedTime=0;
}



function setConstructorInstructions(ruleIN){
    window.constructors["regular"]=ruleIN;
    drawConstructor("regular");
}



function drawHypotheticalForInstructions1(){
    clearAll();
    hypLeft=createDiv("hypLeft");
    $("#mainDiv").append(hypLeft);
    hypRight=createDiv("hypRight");
    $("#mainDiv").append(hypRight);



    window.firstPeriodRule["regular"]=0
    window.firstPeriodRule["hyp"]=0
    window.state=[];
    window.state['page']='na';
    window.hypHistories=4;
    window.hypTab=3;
    window.ruleSets["regular"]=[[[1]]];
    window.ruleNumbers["regular"]=[1];
    window.ruleLastUsed["regular"]=[0];
    window.ruleFrequency["regular"]=[0];
    window.firstPeriodRule["regular"]=1;


    window.ruleSets["hyp"]=[[[0]],[[0,1],[1,0],[1]]];
    window.ruleNumbers["hyp"]=[0,2];
    window.ruleLastUsed["hyp"]=[0,0];
    window.ruleFrequency["hyp"]=[0,0];
    window.firstPeriodRule["hyp"]=0;

    incoming=[];
    incoming['hypHistory']=[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[0,1],[1,0],[0,1],[1,0],[1,1],[-1,-1]];
    incoming['totalHypHistories']=4;
    incoming['hypHistoryNumber']=4;
    incoming['hypHistoryComplete']=1;
    hypHistory(incoming);


    var div = createDiv("hypTitle");
    div.innerHTML="Hypothetical Rules";
    $("#mainDiv").append(div);

    var div = createDiv("hypActualTitle");
    div.innerHTML="Starting Rules";
    $("#mainDiv").append(div);



    drawGame("hyp");
    drawRules("hyp");
    drawRules("hypActual");
    drawConstructor("hyp");
    drawDefault("hyp");
    //getHypHistory(-1);

    drawHypTabs();

    incoming['hypRuleOutput']=0;
    incoming['hypRuleNumber']=0;
    incoming['hypRuleLength']=0;


    incoming['hypActualRuleOutput']=1;
    incoming['hypActualRuleNumber']=0;
    incoming['hypActualRuleLength']=0;


    incoming['regularRuleOutput']=1;
    incoming['regularRuleNumber']=1;
    incoming['regularRuleLength']=0;
    displayHypHistory(incoming)


    var topInfoLeft=createDiv("topInfoLeft");
    var topInfoMiddle=createDiv("topInfoMiddle");
    topInfoMiddle.innerHTML="The match will start in <time id='timer'>5:00</time>";
    $("#mainDiv").append(topInfoLeft);
    $("#mainDiv").append(topInfoMiddle);
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);

}




function drawHypotheticalForInstructions2(){
    clearAll();
    hypLeft=createDiv("hypLeft");
    $("#mainDiv").append(hypLeft);
    hypRight=createDiv("hypRight");
    $("#mainDiv").append(hypRight);



    window.firstPeriodRule["regular"]=0
    window.firstPeriodRule["hyp"]=0
    window.state=[];
    window.state['page']='na';
    window.hypHistories=4;
    window.hypTab=3;
    window.ruleSets["regular"]=[[[1]]];
    window.ruleNumbers["regular"]=[1];
    window.ruleLastUsed["regular"]=[0];
    window.ruleFrequency["regular"]=[0];
    window.firstPeriodRule["regular"]=1;


    window.ruleSets["hyp"]=[[[0]],[[0,1],[1,0],[1]]];
    window.ruleNumbers["hyp"]=[1,2];
    window.ruleLastUsed["hyp"]=[0,0];
    window.ruleFrequency["hyp"]=[0,0];
    window.firstPeriodRule["hyp"]=0;

    incoming=[];
    incoming['hypHistory']=[[-1,-1],[0,0],[1,1],[1,0],[0,0],[1,1],[1,1],[1,1],[0,0],[0,0],[0,1],[1,1],[0,1],[0,1],[1,0],[-1,-1]];
    incoming['totalHypHistories']=4;
    incoming['hypHistoryNumber']=3;
    incoming['hypHistoryComplete']=1;
    hypHistory(incoming);


    var div = createDiv("hypTitle");
    div.innerHTML="Hypothetical Rules";
    $("#mainDiv").append(div);

    var div = createDiv("hypActualTitle");
    div.innerHTML="Starting Rules";
    $("#mainDiv").append(div);



    drawGame("hyp");
    drawRules("hyp");
    drawRules("hypActual");
    drawConstructor("hyp");
    drawDefault("hyp");
    //getHypHistory(-1);

    drawHypTabs();

    incoming['hypRuleOutput']=1;
    incoming['hypRuleNumber']=2;
    incoming['hypRuleLength']=2;



    incoming['regularRuleOutput']=1;
    incoming['regularRuleNumber']=1;
    incoming['regularRuleLength']=0;
    displayHypHistory(incoming)


    var topInfoLeft=createDiv("topInfoLeft");
    var topInfoMiddle=createDiv("topInfoMiddle");
    topInfoMiddle.innerHTML="The match will start in <time id='timer'>5:00</time>";
    $("#mainDiv").append(topInfoLeft);
    $("#mainDiv").append(topInfoMiddle);
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);

}

function makeChoiceInstructions(choice,period,nextPeriod,nextRuleLenth,nextRule){
    window.currentHistory.push(choice);
    generateInstructionPayoffs();
    window.currentPeriod=period;
    window.nextPeriodPlay=nextPeriod;
    window.nextPeriodRuleLength=nextRuleLenth;
    window.nextPeriodRule=nextRule;
	drawGameInstructions();	
}





function drawGameInstructions(){
    drawHistory("regular");
    drawGame("regular");
    drawDefault("regular");
    drawRules("regular")
    drawConstructor("regular");
    for(k=0;k<window.currentHistory.length;k++){
        period=window.currentPeriod-window.currentHistory.length+k+1;
        if(isDivNotThere("regular_history_square_"+period+"_1")){
            drawHistoryPeriodLabels('regular',period);
            drawHistoryPeriod('regular',period,0);
            drawHistoryPeriod('regular',period,1);
            fillHistory('regular',period,0,actionFromInteger(window.currentHistory[k][0]));
            fillHistory('regular',period,1,actionFromInteger(window.currentHistory[k][1]));
            document.getElementById("regular_historyPayoffLabel_"+period).innerHTML=window.currentPayoffHistory[k][0];
        }
    }
    drawHistoryPeriod('regular',window.currentPeriod+1,0);
    document.getElementById("regular_historyIN").style.transform="translateX("+(1150-50*window.currentPeriod)+"px)";
    drawNextAction("regular");
    highlightRule("regular",window.nextPeriodRule,window.nextPeriodRuleLength);
  highlightPayoffs();
    drawInfo();
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);
    stopInstructions();
}



function generateInstructionPayoffs(){
    window.currentPayoffHistory=[]
    for(k=0;k<window.currentHistory.length;k++){
        if(window.currentHistory[k][0]==0 && window.currentHistory[k][1]==0){
            window.currentPayoffHistory.push([7,8])
        }
        if(window.currentHistory[k][0]==0 && window.currentHistory[k][1]==1){
            window.currentPayoffHistory.push([3,4])
        }
        if(window.currentHistory[k][0]==1 && window.currentHistory[k][1]==0){
            window.currentPayoffHistory.push([5,6])
        }
        if(window.currentHistory[k][0]==1 && window.currentHistory[k][1]==1){
            window.currentPayoffHistory.push([1,2])
        }
    }
}



function instructionsConfirmChoice(){
    divID='regular_history_square_44_0';
    nextActionSquare=document.getElementById(divID);
    nextActionSquare.className=actionFromInteger(window.nextPeriodPlay)+"Square square confirmed";
}



function drawInstructionDemoPreChoice(){
    window.payoffs=[];
    window.payoffs[0]=[7,8,6,4];
    window.payoffs[1]=[3,4,19,4];
    window.payoffs[2]=[5,6,6,4];
    window.payoffs[3]=[1,2,6,4];
    window.actionProfileFrequencies=[6,19,6,6];
    window.lastPlay=2;
    drawHistory("regular");
    drawGame("regular");
    drawDefault("regular");
    window.ruleSets["regular"]=[[[1]],[[1,1],[0,0],[1,0],[0]],[[1,0],[0,1],[0,1],[0]],[[0,0],[1,0],[0]],[[1,1],[0,0],[1]]];//,[[1,1],[0]],[[0,1],[0]],[[1,0],[1]],[[0,0],[1]],[[1,0],[0,1],[1,0],[1]]];
    window.ruleNumbers["regular"]=[0,2,3,4,5];//,6,7,8,9,12];
    window.ruleLastUsed["regular"]=[0,2,3,4,5];//,6,7,8,9,12];
    window.ruleFrequency["regular"]=[0,2,3,4,5];//,6,7,8,9,12];
    window.firstPeriodRule["regular"]=0;
    window.state=[];
    window.state['page']!="quiz";
    window.state['page']="instructions";
    drawRules("regular")
    drawConstructor("regular");
    window.currentHistory=[[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[1,1],[0,1],[1,0],[0,1],[1,0],[1,0],[1,1],[0,0],[1,0],[1,0],[0,0],[0,0],[1,1],[1,0],[1,1],[0,1],[1,1],[0,1],[1,0],[0,1],[1,1],[1,1],[1,1],[0,0]];
    generateInstructionPayoffs();

    window.currentPeriod=43;
    for(k=0;k<window.currentHistory.length;k++){
        period=window.currentPeriod-window.currentHistory.length+k+1;
        if(isDivNotThere("regular_history_square_"+period+"_1")){
            drawHistoryPeriodLabels('regular',period);
            drawHistoryPeriod('regular',period,0);
            drawHistoryPeriod('regular',period,1);
            fillHistory('regular',period,0,actionFromInteger(window.currentHistory[k][0]));
            fillHistory('regular',period,1,actionFromInteger(window.currentHistory[k][1]));
            document.getElementById("regular_historyPayoffLabel_"+period).innerHTML=window.currentPayoffHistory[k][0];
        }
    }
    drawHistoryPeriod('regular',window.currentPeriod+1,0);
    document.getElementById("regular_historyIN").style.transform="translateX("+(1150-50*window.currentPeriod)+"px)";
    window.nextPeriodPlay=1;
    window.nextPeriodRuleLength=2;
    //window.currentPeriod
    window.nextPeriodRule=5;
    drawNextAction("regular");
    highlightRule("regular",window.nextPeriodRule,window.nextPeriodRuleLength);
  highlightPayoffs();


    drawInfo();
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);
    stopInstructions();

}





function drawInstructionDemo(){
    window.payoffs=[];
    window.payoffs[0]=[7,8,6,4];
    window.payoffs[1]=[3,4,19,4];
    window.payoffs[2]=[5,6,6,4];
    window.payoffs[3]=[1,2,6,4];
    window.actionProfileFrequencies=[6,19,6,6];
    window.lastPlay=2;
    drawHistory("regular");
    drawGame("regular");
    drawDefault("regular");
    window.ruleSets["regular"]=[[[1]],[[1,1],[0,0],[1,0],[0]],[[1,0],[0,1],[0,1],[0]],[[0,0],[1,0],[0]],[[1,1],[0,0],[1]]];//,[[1,1],[0]],[[0,1],[0]],[[1,0],[1]],[[0,0],[1]],[[1,0],[0,1],[1,0],[1]]];
    window.ruleNumbers["regular"]=[0,2,3,4,5];//,6,7,8,9,12];
    window.ruleLastUsed["regular"]=[0,2,3,4,5];//,6,7,8,9,12];
    window.ruleFrequency["regular"]=[0,2,3,4,5];//,6,7,8,9,12];
    window.firstPeriodRule["regular"]=0;
    window.state=[];
    window.state['page']!="quiz";
    window.state['page']="instructions";
    drawRules("regular")
    drawConstructor("regular");
    window.currentHistory=[[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[0,1],[1,0],[1,1],[0,1],[1,0],[0,1],[1,0],[1,0],[1,1],[0,0],[1,0],[1,0],[0,0],[0,0],[1,1],[1,0],[1,1],[0,1],[1,1],[0,1],[1,0],[0,1],[1,1],[1,1],[1,1],[0,0],[1,0]];
    generateInstructionPayoffs();

    window.currentPeriod=44;
    for(k=0;k<window.currentHistory.length;k++){
        period=window.currentPeriod-window.currentHistory.length+k+1;
        if(isDivNotThere("regular_history_square_"+period+"_1")){
            drawHistoryPeriodLabels('regular',period);
            drawHistoryPeriod('regular',period,0);
            drawHistoryPeriod('regular',period,1);
            fillHistory('regular',period,0,actionFromInteger(window.currentHistory[k][0]));
            fillHistory('regular',period,1,actionFromInteger(window.currentHistory[k][1]));
            document.getElementById("regular_historyPayoffLabel_"+period).innerHTML=window.currentPayoffHistory[k][0];
        }
    }
    drawHistoryPeriod('regular',window.currentPeriod+1,0);
    document.getElementById("regular_historyIN").style.transform="translateX("+(1150-50*window.currentPeriod)+"px)";
    window.nextPeriodPlay=0;
    window.nextPeriodRuleLength=3;
    //window.currentPeriod
    window.nextPeriodRule=2;
    drawNextAction("regular");
    highlightRule("regular",window.nextPeriodRule,window.nextPeriodRuleLength);
  highlightPayoffs();

    // thisPeriod=100;
    // updateType="all";
    // fillHistory("slider",historyIN,thisPeriod,updateType);
    // window.speed=10;
    // changeSliderSpeed("slider");
    // window.currentPeriod=100;
    // setInterval(function(){
    //     window.currentPeriod=window.currentPeriod+1;
    //     fillHistory("slider",[0,0],window.currentPeriod); 
    //     fakeMessage=[];
    //     fakeMessage['ruleType']="regular";
    //     fakeMessage['lastRuleNumber']=5;
    //     fakeMessage['lastRuleLastUsed']=2;
    //     fakeMessage['lastRuleFrequency']=24;
    //     fakeMessage['currentRules']=[[[1]],[[0,0],[1]],[[1,1],[0]],[[0,1],[0]],[[1,0],[0,1],[1]],[[0,1],[1,0],[0,1],[0]]];
    //     fakeMessage['currentRuleNumbers']=[0,2,3,4,5,6];
    //     fakeMessage['lastUsed']=[18,23,19,22,-1,-1];
    //     fakeMessage['ruleFrequency']=[6,5,5,7,0,0];
    //     fakeMessage['nextPeriodPlay']=0;
    //     fakeMessage['nextPeriodRule']=5;
    //     fakeMessage['nextPeriodRuleLength']=2;
    //     fakeMessage['firstPeriodRule']=2;
    //     fakeMessage['updateType']="everything";
    //     updateRules(fakeMessage);
    // },5000);
    drawInfo();
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);
    stopInstructions();

}





function drawInstructionDemo2(){
    drawHistory("regular");
    drawGame("regular");
    drawDefault("regular");
    window.ruleSets["regular"]=[[[1]],[[0,0],[1]],[[1,1],[1]],[[0,1],[0,0],[0]]];
    window.ruleNumbers["regular"]=[0,4,7,9];
    window.ruleLastUsed["regular"]=[5,3,7,2];
    window.ruleFrequency["regular"]=[9,3,5,4];
    window.firstPeriodRule["regular"]=0;
    window.state=[];
    drawRules("regular")
    drawConstructor("regular");
    window.currentHistory=[[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[1,0],[0,0],[0,1],[0,0],[0,0],[0,0],[1,1],[0,0],[1,1],[0,0],[1,1],[1,0],[0,1],[1,0],[0,1],[0,0],[0,0],[1,1],[0,0],[0,0],[0,1],[0,0]]
    generateInstructionPayoffs();
    window.currentPeriod=28;
    for(k=0;k<window.currentHistory.length;k++){
        period=window.currentPeriod-window.currentHistory.length+k+1;
        if(isDivNotThere("regular_history_square_"+period+"_1")){
            drawHistoryPeriodLabels('regular',period);
            drawHistoryPeriod('regular',period,0);
            drawHistoryPeriod('regular',period,1);
            fillHistory('regular',period,0,actionFromInteger(window.currentHistory[k][0]));
            fillHistory('regular',period,1,actionFromInteger(window.currentHistory[k][1]));
            document.getElementById("regular_historyPayoffLabel_"+period).innerHTML=window.currentPayoffHistory[k][0];
        }
    }
    drawHistoryPeriod('regular',window.currentPeriod+1,0);
    document.getElementById("regular_historyIN").style.transform="translateX("+(1150-50*window.currentPeriod)+"px)";
    window.nextPeriodPlay=0;
    window.nextPeriodRuleLength=2;
    //window.currentPeriod
    window.nextPeriodRule=9;
    window.state['page']="instructions";
    drawNextAction("regular");
    highlightRule("regular",window.nextPeriodRule,window.nextPeriodRuleLength);
    highlightPayoffs();

    window.state["match"]="Instructions";
    drawInfo();
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);
    stopInstructions();
}




function drawInstructionDemo3(){
    window.totalPayoff=1234;
    window.unlockCosts=250;
    window.ruleLockFixedCost=250;
    drawHistory("regular");
    drawGame("regular");
    drawDefault("regular");
    window.ruleSets["regular"]=[[[1]],[[0,0],[1]],[[1,1],[1]],[[0,1],[0,0],[0]]];
    window.ruleNumbers["regular"]=[0,4,7,9];
    window.ruleLastUsed["regular"]=[5,3,7,2];
    window.ruleFrequency["regular"]=[9,3,5,4];
    window.firstPeriodRule["regular"]=0;
    window.state=[];
    drawRules("regular")
    drawConstructor("regular");
    window.currentHistory=[[0,0],[1,1],[0,1],[1,0],[0,0],[1,1],[1,0],[0,0],[0,1],[0,0],[0,0],[0,0],[1,1],[0,0],[1,1],[0,0],[1,1],[1,0],[0,1],[1,0],[0,1],[0,0],[0,0],[1,1],[0,0],[0,0],[0,1],[0,0]]
    generateInstructionPayoffs();
    window.currentPeriod=28;
    for(k=0;k<window.currentHistory.length;k++){
        period=window.currentPeriod-window.currentHistory.length+k+1;
        if(isDivNotThere("regular_history_square_"+period+"_1")){
            drawHistoryPeriodLabels('regular',period);
            drawHistoryPeriod('regular',period,0);
            drawHistoryPeriod('regular',period,1);
            fillHistory('regular',period,0,actionFromInteger(window.currentHistory[k][0]));
            fillHistory('regular',period,1,actionFromInteger(window.currentHistory[k][1]));
            document.getElementById("regular_historyPayoffLabel_"+period).innerHTML=window.currentPayoffHistory[k][0];
        }
    }
    drawHistoryPeriod('regular',window.currentPeriod+1,0);
    document.getElementById("regular_historyIN").style.transform="translateX("+(1150-50*window.currentPeriod)+"px)";
    window.nextPeriodPlay=0;
    window.nextPeriodRuleLength=2;
    //window.currentPeriod
    window.nextPeriodRule=9;
    window.state['page']="instructions";
    drawNextAction("regular");
    highlightRule("regular",window.nextPeriodRule,window.nextPeriodRuleLength);
    highlightPayoffs();

    window.state["match"]="Instructions";
    drawInfo();
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);
    stopInstructions();
    drawLock();
    drawUnlockButton();
}









