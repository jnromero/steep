
mainDiv.style.width="1280px";
mainDiv.style.height="1024px";


function compareRuleAndRule(rule1,rule2){
    var error=1;//Same except output
    if(rule1.length!=rule2.length){
      error=0;//different
    }
    else{
      for(i=0;i<rule1.length-1;i++){
        if(rule1[i][0]!=rule2[i][0]){error=0;break;}
        if(rule1[i][1]!=rule2[i][1]){error=0;break;}
      }
      if(error==1 && rule1[rule1.length-1][0]==rule2[rule2.length-1][0]){
        error=2;//exactly the same
      }
    }
    return error;

}


//CONSTRUCTOR STUFF HERE
function makeConstructorButton(functionIN,buttonClass,buttonID,clickable){
    if(clickable==1){
        var s = document.createElement("a");
        var pf = partial(functionIN,buttonID);
        s.addEventListener("click",pf);
    }
    else{
        var s = document.createElement("div");        
    }
    s.href="#a";
    s.className = buttonClass;
    s.id=buttonID;
    s.title="click to do something"
    return s
}



function drawIfNeeded(divIN){
    if(divIN=="gameDiv"){if(isDivNotThere(divIN)){drawGame("regular");}}
    else if(divIN=="regularDefaultDiv"){if(isDivNotThere(divIN)){drawDefault("regular");}}
    else if(divIN=="regularConstructorDiv"){if(isDivNotThere(divIN)){drawConstructor("regular");}}
    else if(divIN=="regularRuleList"){if(isDivNotThere(divIN)){drawRules("regular");}}
    else if(divIN=="quizDiv"){if(isDivNotThere(divIN)){displayQuestion();}}
    else if(divIN=="hypothetical"){if(isDivNotThere("hypLeft")){drawHypothetical();}}
    else if(divIN=="regular_history"){if(isDivNotThere("regular_history")){drawHistory("regular");}}
}



function drawInfo(){
    var topInfoLeft=createDiv("topInfoLeft");
    topInfoLeft.innerHTML="Match #"+window.state["match"];
    if(window.state['page']=="instructions"){topInfoLeft.innerHTML="Match #: Instructions";}
    else if(window.state["match"]==0){topInfoLeft.innerHTML="Match #: Practice";}
    $("#mainDiv").append(topInfoLeft);

    var topInfoMiddle=createDiv("topInfoMiddle");
    if(window.matchPayoff!=undefined){
        topInfoMiddle.innerHTML="Payoff this match: "+window.matchPayoff[0];//You: "+window.matchPayoff[0];//+"  Other: "+window.matchPayoff[1];
    }
    else{
        topInfoMiddle.innerHTML="Payoff this match: 0";//You: 0";//  Other: 0";
    }
    $("#mainDiv").append(topInfoMiddle);

    var topInfoRight=createDiv("topInfoRight");
    if(window.totalPayoff!=undefined){
        topInfoRight.innerHTML="Total Earned Today: <span style='color:#008800'>"+window.totalPayoff+"</span> - <span style='color:#FF0000'>"+parseInt(window.unlockCosts)+"</span> = "+(window.totalPayoff-parseInt(window.unlockCosts));
    }
    else{
        topInfoRight.innerHTML="Total Earned Today: 0";
    }
    $("#mainDiv").append(topInfoRight);
}
function drawGame(type){
    //Create Game div
    gameDiv=createDiv("gameDiv");
    //if(type=="hyp"){gameDiv.id="hypGame";}
    if(window.payoffs==undefined){
        window.payoffs=[];
        window.payoffs[0]=[1,2,0,4];
        window.payoffs[1]=[1,2,0,4];
        window.payoffs[2]=[1,2,0,4];
        window.payoffs[3]=[1,2,0,4];
    }
    if (window.actionProfileFrequencies==undefined){
        window.actionProfileFrequencies=[0,0,0,0]
    }

    table=[   ['My Choice','wSquare','wSquare','ySquare','ySquare'],
        ['Other\'s Choice','wSquare','ySquare','wSquare','ySquare'],
        ['My Payoff',window.payoffs[0][0],window.payoffs[1][0],window.payoffs[2][0],window.payoffs[3][0]],
        ['Other\'s Payoff',window.payoffs[0][1],window.payoffs[1][1],window.payoffs[2][1],window.payoffs[3][1]],
        ['Total',window.actionProfileFrequencies[0],window.actionProfileFrequencies[1],window.actionProfileFrequencies[2],window.actionProfileFrequencies[3]]
    ]
    for(row=0;row<table.length;row++){
        for(col=0;col<table[row].length;col++){
            if(col==0){
                var entryDiv=createDiv("gameTable_"+row+"_"+col);
                entryDiv.className="entry entryTitle"
                entryDiv.innerHTML=table[row][col];
                entryDiv.style.transform="translate3d(0px,"+(row*50)+"px,0px)";
                gameDiv.appendChild(entryDiv);
            }
            else{
                var entryDiv=createDiv("gameTable_"+row+"_"+col);
                entryDiv.style.transform="translate3d("+(100+col*50)+"px,"+(row*50)+"px,0px)";
                if(table[row][col]=="wSquare"){
                    entryDiv.className="wSquare square"                
                }
                else if(table[row][col]=="ySquare"){
                    entryDiv.className="ySquare square"
                }
                else{
                    entryDiv.className="entry"
                    entryDiv.innerHTML=table[row][col];
                }
                gameDiv.appendChild(entryDiv);

            }
        }
    }
    $("#mainDiv").append(gameDiv);
}

function deleteRule(constructorIn,type){
    if(thisStatus["page"]=="quiz" && window.questionType==4 && thisStatus["stage"]=="question"){
        var confirmation=confirmAction("Are you sure you want to delete this rule as your answer??");
        if(confirmation){
            var message={"type":"quizAnswer","answer":constructorIn,"questionType":4};
            sock.send(JSON.stringify(message));
        }
    }
    else if(thisStatus["page"]=="quiz"){
        var confirmation=confirmAction("You can't delete rules right now.");
    }
    else{
        var message={"type":"deleteRule","rule":constructorIn,"rulesType":getRuleSet(type)};
        sock.send(JSON.stringify(message));
    }
}

function switchRules(type){
    if(thisStatus["page"]=="quiz" && window.questionType==5 && thisStatus["stage"]=="question"){
        var confirmation=confirmAction("Are you sure you want to switch this rule as your answer??");
        if(confirmation){
          var message={"type":"quizAnswer","answer":window.constructors[getRuleSet(type)],"questionType":5};
          sock.send(JSON.stringify(message));
        }
    }
    else if(thisStatus["page"]=="quiz"){
        var confirmation=confirmAction("You can't switch rules right now.");
    }
    else{
        var message={"type":"switchRuleOutput","thisRule":window.constructors[getRuleSet(type)],"rulesType":getRuleSet(type)};
        sock.send(JSON.stringify(message));
        window.constructors[type]=[[-1,-1],[-1]];
        drawConstructor(type);
    }

}

function addRule(type,constructorIN){
    if(thisStatus["page"]=="quiz" && window.questionType==3){
        var message={"type":"quizAnswer","answer":constructorIN,"questionType":3};
        sock.send(JSON.stringify(message));
    }
    else if(thisStatus["page"]=="quiz"){
        var confirmation=confirmAction("You can't ADD RULES for this question.");
    }
    else{
        var message={"type":"addRule","thisRule":constructorIN,"rulesType":getRuleSet(type)};
        sock.send(JSON.stringify(message));
        window.constructors[type]=[[-1,-1],[-1]];
        drawConstructor(type);
    }   
}

function addRuleFromHyp(type,constructorIN){
    switchRule=JSON.parse(JSON.stringify(constructorIN));
    switchRule[switchRule.length-1][0]=1-switchRule[switchRule.length-1][0];
    if(JSON.stringify(window.ruleSets["regular"]).indexOf(JSON.stringify(constructorIN))>-1){
        alert("That rule is already in your Actual Rule Set.");
    }
    else if(JSON.stringify(window.ruleSets["regular"]).indexOf(JSON.stringify(switchRule))>-1){
        var confirmation=confirmAction("There is a conflicting rule in your set, do you want to switch it with this rule?");
        if(confirmation){
            var message={"type":"switchRuleOutput","thisRule":constructorIN,"rulesType":getRuleSet(type)};
            sock.send(JSON.stringify(message));
        }
    }
    else{
        var message={"type":"addRule","thisRule":constructorIN,"rulesType":getRuleSet(type)};
        sock.send(JSON.stringify(message));
    }
 }


function setConstructor(constructorIn,type){
    thisConstructor=JSON.parse(JSON.stringify(constructorIn));
    if(thisStatus["page"]=="quiz" && window.questionType!=5){
        var confirmation=confirmAction("You can't COPY RULES right now.");
    }
    else{
        window.constructors[type]=thisConstructor;
        drawConstructor(type);
    }
}

function drawConstructor(type){
    divName=type+"ConstructorDiv";
    //Create entire Div
    constructorDiv=createDiv(divName);
    constructorDiv.className = "constructor";
    thisConstructor=window.constructors[getRuleSet(type)]

    //Create ConstructorIn div (so that you can scroll on long slider)
    var constructorIn2 = document.createElement("div");
    constructorIn2.className = "constructorIn2";


    var constructorIn = document.createElement("div");
    constructorIn.className = "constructorIn";
    if(thisConstructor.length*50>525){  
        constructorIn.setAttribute("style","width:"+(thisConstructor.length+3)*50+"px");
        constructorIn.style.left="0px";
    }
    else{
        constructorIn.setAttribute("style","width:"+(thisConstructor.length+1)*50+"px");        
        constructorIn.style.left=((730-(thisConstructor.length+1)*50)/2)+"px";
    }

    //plus button
    var plusButton = document.createElement("div");
    var pf = partial(constructorPlusMinus,"+",-1,getRuleSet(type));
    plusButton.addEventListener("mousedown",pf);
    plusButton.id=type+"_plusConstructorButton";
    plusButton.className="plusConstructorButton constructorButton";
    plusButton.style.transform="translate3d(0px,80px,0px)";
    constructorIn.appendChild(plusButton);


    for(col=0;col<thisConstructor.length;col++){
        if(thisConstructor.length-col>2 && thisConstructor.length>2){
            var minusButton = document.createElement("div");
            minusButton.className="minusConstructorButton constructorButton";
            minusButton.id=type+"_minusConstructorButton_"+col;
            var pf = partial(constructorPlusMinus,"-",col,getRuleSet(type));
            minusButton.addEventListener("click",pf);
            minusButton.style.transform="translate3d("+(col*50+60)+"px,0px,0px)";
            constructorIn.appendChild(minusButton);
        }
        for(row=0;row<thisConstructor[col].length;row++){
            action=actionFromInteger(thisConstructor[col][row]);
            var s = document.createElement("a");
            s.id="square_"+col+"_"+row;
            var pf = partial(changeConstructorEntry,s.id,row,col,getRuleSet(type));
            s.addEventListener("mousedown",pf);
            s.className=action+"Square square";
            s.style.transform="translate3d("+(50+col*50)+"px,"+(50*row+50)+"px,0px)";

            constructorIn.appendChild(s);
        }
    }

    constructorIn2.appendChild(constructorIn);
    constructorDiv.appendChild(constructorIn2);
    $("#mainDiv").append(constructorDiv);
    drawConstructorSubmitButton(type);
    if(thisStatus["page"]=="quiz"){
        document.getElementById(divName).style.backgroundColor="rgba(0,0,0,0)";
    }
}

thisStatus=[]

function drawDefault(type){
    divName=type+"DefaultDiv";
    defaultDiv=createDiv(divName);

    defaultRuleTitle=createDiv("defaultRuleTitle");
    defaultRuleTitle.className="defaultDivTitle";
    defaultRuleTitle.innerHTML="Default Rule"
    defaultRuleTitle.style.transform="translate3d(0px,125px,0px)";
    defaultDiv.appendChild(defaultRuleTitle);

    firstPeriodRuleTitle=createDiv("firstPeriodRuleTitle");
    firstPeriodRuleTitle.className="defaultDivTitle";
    firstPeriodRuleTitle.innerHTML="First Period Rule"
    firstPeriodRuleTitle.style.transform="translate3d(0px,0px,0px)";
    defaultDiv.appendChild(firstPeriodRuleTitle);


    //var defaultDivBottomEntry = document.createElement("div");
    //defaultDivBottomEntry.className="defaultDivBottomEntry";

    theseMessages=["chooseDefault0","chooseDefault1","chooseFirstPeriod0","chooseFirstPeriod1"]
    if(window.state!=undefined){
        if(window.state['page']=="defaultNotSet"){
            theseMessages=["beginDefault0","beginDefault1","beginFirstPeriod0","beginFirstPeriod1"]
        }
    }
    var s = createDiv("chooseDefault0");
    var pf = partial(defaultButtonPressed,theseMessages[0],type);
    s.addEventListener("click",pf);
    s.className = "wSquare square";
    s.style.transform="translate3d(35px,175px,0px)";
    defaultDiv.appendChild(s);


    var s = createDiv("chooseDefault1");
    var pf = partial(defaultButtonPressed,theseMessages[1],type);
    s.addEventListener("click",pf);
    s.className = "ySquare square";
    s.style.transform="translate3d(115px,175px,0px)";
    defaultDiv.appendChild(s);


    var s = createDiv("chooseFirstPeriod0");
    var pf = partial(defaultButtonPressed,theseMessages[2],type);
    s.addEventListener("click",pf);
    s.className = "wSquare square";
    s.style.transform="translate3d(35px,50px,0px)";
    defaultDiv.appendChild(s);


    var s = createDiv("chooseFirstPeriod1");
    var pf = partial(defaultButtonPressed,theseMessages[3],type);
    s.addEventListener("click",pf);
    s.className = "ySquare square";
    s.style.transform="translate3d(115px,50px,0px)";
    defaultDiv.appendChild(s);


    $("#mainDiv").append(defaultDiv);

    window.defaultRule=-1;
    if(window.ruleSets[type]!=undefined){
        if(window.ruleSets[type].length>0){
         window.defaultRule=window.ruleSets[type][0][0][0];
        }
    }

    if(window.defaultRule==0){
        document.getElementById('chooseDefault0').className += " defaultSelected";
    }
    else if(window.defaultRule==1){
        document.getElementById('chooseDefault1').className += " defaultSelected";
    }

    if(window.firstPeriodRule[type]==0){
        document.getElementById('chooseFirstPeriod0').className += " defaultSelected";
    }
    else if(window.firstPeriodRule[type]==1){
        document.getElementById('chooseFirstPeriod1').className += " defaultSelected";
    }

}

function drawPostMatch(){
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);
    rulesLockedDiv=createDiv("rulesLocked");
    rulesLockedINDiv=createDiv("rulesLockedIN");
    rulesLockedDiv.appendChild(rulesLockedINDiv)
    $("#mainDiv").append(rulesLockedDiv);
    rulesLockedINDiv.innerHTML="Match Finished <br><br> Click Here To Continue";
    rulesLockedDiv.addEventListener("click",function(e){
        e.target.removeEventListener(e.type, arguments.callee);
        moveToNextMatch();
    });
}

function moveToNextMatch(){
    var message={"type":"confirmedMatchOver"};
    sock.send(JSON.stringify(message));
    document.getElementById("rulesLockedIN").innerHTML="Match Finished <br><br> Please Wait For Other Participants to Finish";
}


function drawLock(){
    var noButtonOverlay = createDiv("noButtonOverlay");
    $("#mainDiv").append(noButtonOverlay);
    rulesLockedDiv=createDiv("rulesLocked");
    rulesLockedINDiv=createDiv("rulesLockedIN");
    rulesLockedDiv.appendChild(rulesLockedINDiv)
    $("#mainDiv").append(rulesLockedDiv);
    rulesLockedINDiv.innerHTML="Rules are Locked";
    // var pf = partial(unlockRules);
    // rulesLockedDiv.addEventListener("click",pf);
}


function drawLockButton(){
    lockRulesButton=createDiv("lockRulesButton");
    $("#mainDiv").append(lockRulesButton);
    //lockRulesButton.innerHTML="Click Here Lock Rules <br> Time Unlocked: <time id='unlockTimer'>0:00</time><br> Cost: <a id='unlockCosts'>0</a>";
    lockRulesButton.innerHTML="<br>Click Here to Lock Rules";// <br> Cost: <a id='unlockCosts'>"+window.ruleLockFixedCost+"</a>";
    var pf = partial(lockRules);
    lockRulesButton.addEventListener("click",pf);
}

function drawUnlockButton(){
    lockRulesButton=createDiv("lockRulesButton");
    $("#mainDiv").append(lockRulesButton);
    lockRulesButton.innerHTML="Click Here to <br>Unlock Rules<br> Cost: "+window.ruleLockFixedCost;
    var pf = partial(unlockRules);
    lockRulesButton.addEventListener("click",pf);
}


function updateUnlockTime(){
    if(window.rulesUnlocked==1){
        document.getElementById('unlockTimer').innerHTML=makeTimePretty(window.currentUnlockedTime+((new Date()).getTime()-window.unlockedTimeUpdate)/1000);
        document.getElementById('unlockCosts').innerHTML=window.ruleLockFixedCost+" + "+window.ruleLockMarginalCost*parseInt(window.currentUnlockedTime+((new Date()).getTime()-window.unlockedTimeUpdate)/1000);
        setTimeout(updateUnlockTime,1000);
    }
}
    window.rulesUnlocked=0;


function unlockRules(){
    //document.getElementById('topInfoRight').style.transform="scale(.75)"
    window.rulesUnlocked=1;
    //setTimeout(updateUnlockTime,1000);
    window.currentUnlockedTime=0;
    window.unlockedTimeUpdate=(new Date()).getTime();
    var message={"type":"unlockRules"};
    sock.send(JSON.stringify(message));
}

function lockRules(){
    window.rulesUnlocked=0;
    var message={"type":"lockRules"};
    sock.send(JSON.stringify(message));
}

function actionFromInteger(actionIN){
    if(actionIN==0){action="w";}
    else if(actionIN==1){action="y";}
    else if(actionIN==-1){action="q";}
    return action
}

function constructorButtons(){}

function drawRule(type,constructor,clickable,ruleNumber,highlight){
    //Create ConstructorIn div
    var ruleDiv = createDiv(type+"_rule_"+ruleNumber)
    ruleDiv.className = "rule";
    ruleDiv.setAttribute("style","width:"+(constructor.length)*50+"px");        
    for(col=0;col<constructor.length;col++){
        for(row=0;row<constructor[col].length;row++){
            high=""
            action=actionFromInteger(constructor[col][row]);
            if(highlight==1){high=" highlight";}
            thisButton=makeConstructorButton(constructorButtons,action+"Square square"+high,"square_"+col+"_"+row+"_"+ruleNumber,clickable)
            thisButton.style.transform="translate3d("+(col*50)+"px,"+(row*50)+"px,0px)";
            ruleDiv.appendChild(thisButton);
        }
    }
    return ruleDiv
}


function drawFirstPeriodEntry(type){
    var listEntry = createDiv(type+"_listEntry_firstPeriod")
    listEntry.className = "listEntry";
    listEntry.setAttribute("style","width:"+(1+1.5)*50+"px"); 
    ruleNumber=9999;       
    if(type!="hyp"){
        var listEntryButtons = document.createElement("div");
        listEntryButtons.className = "listEntryNoButtons";
    }
    else if(type=="hyp"){
        listEntry.setAttribute("style","width:"+(3)*50+"px");        
        var listEntryButton3=createDiv(type+"_listEntryMoveButton_"+ruleNumber);
        listEntryButton3.className = "listEntryMoveButton listEntryButton";
        listEntryButton3.innerHTML=String.fromCharCode(parseInt('2794',16));
        thisNumber=window.firstPeriodRule['hyp'];
        var pf = partial(defaultButtonPressed,"chooseFirstPeriod"+thisNumber,"regular");
        listEntryButton3.addEventListener("click",pf);
        listEntryButton3.style.transform="translate3d(10px,60px,0px)";
        listEntry.appendChild(listEntryButton3);
    }
    constructor=[[window.firstPeriodRule[getRuleSet(type)]]];
    thisRule=drawRule(type,constructor,0,ruleNumber,0);
    if(type=="hyp"){
        thisRule.style.transform="translate3d(60px,50px,0px)";
    }
    else{
        thisRule.style.transform="translate3d(37px,50px,0px)";
    }
    listEntry.appendChild(thisRule);
    
    var listEntryTitle = document.createElement("div");
    listEntryTitle.className = "listEntryTitle";
    listEntryTitle.id = "listEntryTitle_"+ruleNumber;
    listEntryTitle.innerHTML = "First Period Rule";


    // var listEntryStats = document.createElement("div");
    // listEntryStats.className = "listEntryStats";
    // listEntryStats.id = type+"_listEntryStats_"+ruleNumber;
    // listEntryStats.setAttribute("style","width:"+listEntry.width+"px");        
    // listEntryStats.innerHTML = "Last: "+lastPlayed+"  Total: "+totalPlayed;


    listEntry.appendChild(listEntryTitle);
    //listEntry.appendChild(listEntryStats);

    return listEntry
}


function drawListEntry(type,ruleIndex){
    constructor=window.ruleSets[getRuleSet(type)][ruleIndex];
    ruleNumber=window.ruleNumbers[getRuleSet(type)][ruleIndex];
    lastPlayed=window.ruleLastUsed[getRuleSet(type)][ruleIndex];
    totalPlayed=window.ruleFrequency[getRuleSet(type)][ruleIndex];

    var listEntry = createDiv(type+"_listEntry_"+ruleNumber)
    listEntry.className = "listEntry";
    listEntry.setAttribute("style","width:"+(constructor.length+1.5)*50+"px");        
    if(ruleNumber>1){
        var listEntryButton1 = createDiv(type+"_listEntryCopyButton_"+ruleNumber)
        listEntryButton1.className = "listEntryCopyButton listEntryButton";
        listEntryButton1.style.transform="translate3d(15px,35px,0px)";
        listEntryButton1.innerHTML=String.fromCharCode(parseInt('2398',16));
        if(type=="hypActual"){
            var pf = partial(setConstructor,constructor,"hyp");
        }                    
        else{
            var pf = partial(setConstructor,constructor,type);
        }
        listEntryButton1.addEventListener("click",pf);
        listEntry.appendChild(listEntryButton1);

        var listEntryButton2 = createDiv(type+"_listEntryDeleteButton_"+ruleNumber)
        listEntryButton2.style.transform="translate3d(15px,85px,0px)";
        listEntryButton2.className = "listEntryDeleteButton listEntryButton";
        listEntryButton2.innerHTML=String.fromCharCode(parseInt('2718',16));
        var pf = partial(deleteRule,constructor,type);
        listEntryButton2.addEventListener("click",pf);
        listEntry.appendChild(listEntryButton2);

        if(type=="hyp"){
            var listEntryButton3 = createDiv(type+"_listEntryMoveButton_"+ruleNumber)
            listEntryButton3.className = "listEntryMoveButton listEntryButton";
            listEntryButton3.innerHTML=String.fromCharCode(parseInt('2794',16));
            var pf = partial(addRuleFromHyp,"regular",constructor);
            listEntryButton3.addEventListener("click",pf);
            listEntry.appendChild(listEntryButton3);
            listEntryButton1.style.transform="translate3d(15px,15px,0px)";
            listEntryButton2.style.transform="translate3d(15px,55px,0px)";
            listEntryButton3.style.transform="translate3d(15px,95px,0px)";

        }
    }
    if(ruleNumber<2 && type!="hyp"){
        var listEntryButtons = document.createElement("div");
        listEntryButtons.className = "listEntryNoButtons";
    }
    else if(ruleNumber<2 && type=="hyp"){
        listEntry.setAttribute("style","width:"+(3)*50+"px");        
        var listEntryButton3=createDiv(type+"_listEntryMoveButton_"+ruleNumber);
        listEntryButton3.className = "listEntryMoveButton listEntryButton";
        listEntryButton3.innerHTML=String.fromCharCode(parseInt('2794',16));
        thisNumber=window.ruleSets['hyp'][0][0][0];
        var pf = partial(defaultButtonPressed,"chooseDefault"+thisNumber,"regular");
        listEntryButton3.addEventListener("click",pf);
        listEntryButton3.style.transform="translate3d(10px,60px,0px)";
        listEntry.appendChild(listEntryButton3);
    }

    thisRule=drawRule(type,constructor,0,ruleNumber,0);
    thisRule.style.transform="translate3d(60px,25px,0px)";
    if(ruleIndex<1){
        if(type=="hyp"){
            thisRule.style.transform="translate3d(60px,50px,0px)";
        }
        else{
            thisRule.style.transform="translate3d(37px,50px,0px)";
        }
    }
    listEntry.appendChild(thisRule);
    
    var listEntryTitle = document.createElement("div");
    listEntryTitle.className = "listEntryTitle";
    listEntryTitle.id = "listEntryTitle_"+ruleNumber;    
    if(ruleNumber>1){listEntryTitle.innerHTML = "Rule #"+ruleNumber;}
    else if(ruleNumber<2){listEntryTitle.innerHTML = "Default Rule";}


    var listEntryStats = document.createElement("div");
    listEntryStats.className = "listEntryStats";
    listEntryStats.id = type+"_listEntryStats_"+ruleNumber;
    listEntryStats.setAttribute("style","width:"+listEntry.width+"px");        
    listEntryStats.innerHTML = "Last: "+lastPlayed+"  Total: "+totalPlayed;


    listEntry.appendChild(listEntryTitle);
    listEntry.appendChild(listEntryStats);

    return listEntry
}


function updateRuleStats(type,ruleNumber,lastPlayed,totalPlayed){
    if(document.getElementById(type+"_listEntryStats_"+ruleNumber)!=null){
        document.getElementById(type+"_listEntryStats_"+ruleNumber).innerHTML = "Last: "+lastPlayed+"  Total: "+totalPlayed;
    }
}


function drawRules(type){
    if(getRuleSet(type) in window.ruleSets){
        // console.log(type);
        // console.log(JSON.stringify(window.ruleSets[getRuleSet(type)]));
        divName=type+"RuleList";
        div=createDiv(divName);
        var div2 = document.createElement("div");
        div2.id = divName+"In";
        div.appendChild(div2);
        $("#mainDiv").append(div);

        thisRule=drawFirstPeriodEntry(type)
        $("#"+divName+"In").append(thisRule);

        for(i=0;i<window.ruleSets[getRuleSet(type)].length;i++){
            var thisRule=window.ruleSets[getRuleSet(type)][i]
            var thisRuleNumber=window.ruleNumbers[getRuleSet(type)][i]
            thisRule=drawListEntry(type,i);
            $("#"+divName+"In").append(thisRule);
        }
    }
    if(type!="hypActual" && window.state['page']!="quiz"){
        drawDefault(type);
    }
}



function highlightHistory(type,ruleLength,currentPeriod){
    var ruleHighlight = createDiv(type+"_historyRuleHighlight");
    ruleHighlight.className="ruleHighlight";

    width=ruleLength*50+50;
    if(width>50){
        var ruleHighlightTopleft = document.createElement("div");
        ruleHighlightTopleft.className="ruleHighlightTopleft";
        var ruleHighlightBottom = document.createElement("div");
        ruleHighlightBottom.className="ruleHighlightBottom";
        var ruleHighlightRight = document.createElement("div");
        ruleHighlightRight.className="ruleHighlightRight";


        borderWidth=4;
        ruleHighlight.style.width=width+"px";
        ruleHighlightTopleft.style.width=width+"px";
        ruleHighlightBottom.style.width=(width-50)+"px";
        ruleHighlightRight.style.left=(width-50-borderWidth)+"px";
    
        ruleHighlight.appendChild(ruleHighlightTopleft);
        ruleHighlight.appendChild(ruleHighlightBottom);
        ruleHighlight.appendChild(ruleHighlightRight);
    }
    else{
        var ruleHighlightDefault = document.createElement("div");
        ruleHighlightDefault.className="ruleHighlightDefault";
        ruleHighlight.appendChild(ruleHighlightDefault);
    }

    ruleHighlight.style.transform="translate3d("+(50*currentPeriod-ruleLength*50)+"px,25px,0px)";
    $('#'+type+'_historyIN').append(ruleHighlight);
}


function highlightGame(){
    if(document.getElementById("gameHighlight")!=null){
        var element = document.getElementById("gameHighlight");
        element.parentNode.removeChild(element);
    }

    var gameHighlight = document.createElement("div");
    gameHighlight.className="gameHighlight";
    gameHighlight.id="gameHighlight";
    gameHighlight.style.left=200+"px"
    $('#gameDiv').append(gameHighlight);
}

function highlightRule(ruleType,ruleNumber,ruleLength){
    var ruleHighlight = createDiv(ruleType+"_ruleListRuleHighlight");
    ruleHighlight.className="ruleHighlight";
    width=ruleLength*50+50;
    if(width>50){
        var ruleHighlightTopleft = document.createElement("div");
        ruleHighlightTopleft.className="ruleHighlightTopleft";
        var ruleHighlightBottom = document.createElement("div");
        ruleHighlightBottom.className="ruleHighlightBottom";
        var ruleHighlightRight = document.createElement("div");
        ruleHighlightRight.className="ruleHighlightRight";

        borderWidth=4;
        ruleHighlight.style.width=width+"px";
        ruleHighlightTopleft.style.width=width+"px";
        ruleHighlightBottom.style.width=(width-50)+"px";
        ruleHighlightRight.style.left=(width-50-borderWidth)+"px";
    
        ruleHighlight.appendChild(ruleHighlightTopleft);
        ruleHighlight.appendChild(ruleHighlightBottom);
        ruleHighlight.appendChild(ruleHighlightRight);
        ruleHighlight.style.left=(60)+"px"
        ruleHighlight.style.top=(24)+"px"
    }
    else if(ruleType=="hyp" && ruleNumber<2){
        var ruleHighlightDefault = document.createElement("div");
        ruleHighlightDefault.className="ruleHighlightDefault";
        ruleHighlight.appendChild(ruleHighlightDefault);
        ruleHighlight.style.left=(60)+"px"
        ruleHighlight.style.top=(49)+"px"        
    }
    else{
        var ruleHighlightDefault = document.createElement("div");
        ruleHighlightDefault.className="ruleHighlightDefault";
        ruleHighlight.appendChild(ruleHighlightDefault);
        ruleHighlight.style.left=(37.5)+"px"
        ruleHighlight.style.top=(49)+"px"
    }
    if(ruleNumber==-1){
        ruleNumber="firstPeriod";
    }
    $('#'+ruleType+'_listEntry_'+ruleNumber).append(ruleHighlight);
    if(window.ruleNumbers[getRuleSet(ruleType)]!=undefined){
        var M=window.ruleNumbers[getRuleSet(ruleType)].length;
        thisElement=document.getElementById(ruleType+'_listEntry_firstPeriod');
        thisElement.style.backgroundColor="rgba(255,255,255,1)";
        for(j=0;j<M;j++){
            thisElement=document.getElementById(ruleType+'_listEntry_'+window.ruleNumbers[getRuleSet(ruleType)][j]);
            thisElement.style.backgroundColor="rgba(255,255,255,1)";
        }
        thisElement=document.getElementById(ruleType+'_listEntry_'+ruleNumber);
        thisElement.style.transition="all .2s ease-out";
        document.getElementById(ruleType+'_listEntry_'+ruleNumber).style.backgroundColor="rgba(235,255,235,1)";
    }
}


function testConstructorComplete(constructor){
    specified=true;
    for(k=0;k<constructor.length;k++){
        for(j=0;j<constructor[k].length;j++){
            if(constructor[k][j]==-1){
                specified=false;
            }
        }
    }
    return specified
}


function defaultButtonPressed(elementID,type){
    if(elementID=="chooseDefault0"){
        window.selectedDefault=0;
        var message={"type":"setDefault","thisRule":0,"rulesType":getRuleSet(type)};
        sock.send(JSON.stringify(message));
    }
    else if(elementID=="chooseDefault1"){
        window.selectedDefault=1;
        var message={"type":"setDefault","thisRule":1,"rulesType":getRuleSet(type)};
        sock.send(JSON.stringify(message));
    }
    else if(elementID=="chooseFirstPeriod0"){
        window.selectedDefault=0;
        var message={"type":"setFirstPeriod","thisRule":0,"rulesType":getRuleSet(type)};
        sock.send(JSON.stringify(message));
    }
    else if(elementID=="chooseFirstPeriod1"){
        window.selectedDefault=1;
        var message={"type":"setFirstPeriod","thisRule":1,"rulesType":getRuleSet(type)};
        sock.send(JSON.stringify(message));
    }
    else if(elementID=="beginDefault0"){
        window.selectedDefault=0;
        var message={"type":"setRulesBeginning","thisRule":["default",0],"rulesType":getRuleSet(type)};
        sock.send(JSON.stringify(message));
    }
    else if(elementID=="beginDefault1"){
        window.selectedDefault=1;
        var message={"type":"setRulesBeginning","thisRule":["default",1],"rulesType":getRuleSet(type)};
        sock.send(JSON.stringify(message));
    }
    else if(elementID=="beginFirstPeriod0"){
        window.selectedDefault=0;
        var message={"type":"setRulesBeginning","thisRule":["firstPeriod",0],"rulesType":getRuleSet(type)};
        sock.send(JSON.stringify(message));
    }
    else if(elementID=="beginFirstPeriod1"){
        window.selectedDefault=1;
        var message={"type":"setRulesBeginning","thisRule":["firstPeriod",1],"rulesType":getRuleSet(type)};
        sock.send(JSON.stringify(message));
    }
}





function constructorPlusMinus(changeType,column,type){
    if(changeType=="+"){
        var additional=[[-1,-1]];
        var added=additional.concat(window.constructors[type]);
        window.constructors[type]=added;
    }    
    else if(changeType=="-"){
        window.constructors[type].splice(column,1);
    }
    drawConstructor(type);
}

function changeConstructorEntry(squareId,row,column,type){
    var thisSquare=document.getElementById(squareId);
    if(window.constructors[getRuleSet(type)][column][row]==0){
        window.constructors[getRuleSet(type)][column][row]=1;
    }
    else if(window.constructors[getRuleSet(type)][column][row]==1){
        window.constructors[getRuleSet(type)][column][row]=0;
    }
    else if(window.constructors[getRuleSet(type)][column][row]==-1){
        window.constructors[getRuleSet(type)][column][row]=Math.floor(Math.random()*2);
    }

    if(window.constructors[getRuleSet(type)][column][row]==0){
        thisSquare.className="wSquare square";        
    }
    else if(window.constructors[getRuleSet(type)][column][row]==1){
        thisSquare.className="ySquare square";
    }
    drawConstructorSubmitButton(type);
    //drawConstructor(constructorDivName);
}



function setConstructorEntry(squareId,row,column,entry){
    var thisSquare=document.getElementById(squareId);
    window.constructors["regular"][column][row]=entry;
    if(window.constructors["regular"][column][row]==0){
        thisSquare.className="wSquare square";        
    }
    else if(window.constructors["regular"][column][row]==1){
        thisSquare.className="ySquare square";
    }
    drawConstructorSubmitButton("regular");
    //drawConstructor(constructorDivName);
}




function testConstructor(type){
// console.log(JSON.stringify(window.constructors[getRuleSet(type)]));
  var error=0;
  if(testConstructorComplete(window.constructors[getRuleSet(type)])==false){
    var error=1;
  }
  else{
    var M=window.ruleSets[getRuleSet(type)].length;
    for(j=0;j<M;j++){
      var rule1=window.constructors[getRuleSet(type)];
      var rule2=window.ruleSets[getRuleSet(type)][j];
      var thisError=compareRuleAndRule(rule1,rule2);
      if(thisError>0){error=thisError+1;}
    }
  }
  return error;
}

function drawConstructorSubmitButton(type){
    error=testConstructor(type);
    drawAdditional=0;
    constructorSubmitButton=createDiv("constructorSubmitButton");
    switchRulesButton=createDiv("switchRulesButton");
    if(error==1){
        constructorSubmitButton.innerHTML="You must set an action in each box of the rule.";
        constructorSubmitButton.style.backgroundColor="rgba(255,0,0,.2)";
    }
    else if(error==2){
        constructorSubmitButton.innerHTML="Conflicting rule in set.";
        constructorSubmitButton.style.backgroundColor="rgba(255,0,0,.2)";

        switchRulesButton.innerHTML="Switch Rules";
        switchRulesButton.style.backgroundColor="rgba(0,255,0,.2)";
        var pf = partial(switchRules,type);
        switchRulesButton.addEventListener("click",pf);

        drawAdditional=1;
    }
    else if(error==3){
        constructorSubmitButton.innerHTML="Rule already in set.";
        constructorSubmitButton.style.backgroundColor="rgba(255,0,0,.2)";
    }
    else{
        constructorSubmitButton.innerHTML="Add Rule";
        constructorSubmitButton.style.backgroundColor="rgba(0,255,0,.2)";
        var pf = partial(addRule,type,window.constructors[type]);
        constructorSubmitButton.addEventListener("click",pf);
    }

    constructorSubmitButton.style.fontSize="125%";
    document.getElementById(type+"ConstructorDiv").appendChild(constructorSubmitButton);
    if(drawAdditional==1){
        document.getElementById(type+"ConstructorDiv").appendChild(switchRulesButton);
    }
}



function drawHistory(type){
    historyDiv=createDiv(type+"_history");
    historyDiv.className="history";
    historyDivIN=createDiv(type+"_historyIN");
    historyDivIN.className="historyIN";
    historyDiv.appendChild(historyDivIN);
    $("#mainDiv").append(historyDiv);
    drawHistoryLabels(type);

    if(type=="hyp" || type=="hypActual"){
        for(k=1;k<16;k++){
            drawHistoryPeriod(type,k,0);
            drawHistoryPeriod(type,k,1);
            drawHistoryPeriodLabels(type,k);
        }
        drawHistoryPeriod(type,16,0);
        drawHistoryPeriodLabels(type,16);
        historyDivIN.style.transform="translateX(150px)";
    }

    //     drawHistoryPeriod(type,10,0);
    //     drawHistoryPeriodLabels(type,10,0);
    // //var thisSquare = document.getElementById(type+"_history_square_10_0");
    // //thisSquare.className ="wSquare square";
    // drawHistoryPeriod(type,11,0);
    // var thisSquare = document.getElementById(type+"_history_square_11_0");
    // thisSquare.className ="wSquare square";
    // drawHistoryPeriod(type,12,0);
    // var thisSquare = document.getElementById(type+"_history_square_12_0");
    // thisSquare.className ="wSquare square";
    // //drawHistoryPeriod(type,11);
    // setTimeout(function(){historyDivIN.style.transform="translateX(-5200px)";},0);
    //historyDivIN.style.transition="20s linear";
}


function drawHistoryPeriodLabels(type,period){
    var historyDivIN = document.getElementById(type+"_historyIN");
    //Add titles blocks
    historyLabel=createDiv(type+"_historyPeriodLabel_"+period);
    historyLabel.style.transform="translateX("+((period-1)*50)+"px)";
    historyLabel.innerHTML=period;
    historyLabel.className="historyPeriodLabel";
    historyDivIN.appendChild(historyLabel);

    payoffLabel=createDiv(type+"_historyPayoffLabel_"+period);
    payoffLabel.style.transform="translate3d("+((period-1)*50)+"px,125px,0px)";
    payoffLabel.className="historyPayoffLabel";
    historyDivIN.appendChild(payoffLabel);
}

function drawHistoryPeriod(type,period,row){
    var historyDivIN = document.getElementById(type+"_historyIN");
    s=createDiv(type+"_history_square_"+period+"_"+row);
    s.className ="qSquare square";
    if(type=="hyp" || type=="hypActual" && period<16){
        if(window.hypHistoryList[period-1][row]==0){s.className ="wSquare square";}
        else if(window.hypHistoryList[period-1][row]==1){s.className ="ySquare square";}
        var pf = partial(changeSquareHyp,period,row);
        //s.addEventListener("mouseover",pf);
        s.addEventListener("mousedown",pf);
    }
    s.style.transform="translate3d("+((period-1)*50)+"px,"+(row*50+25)+"px,0px)";
    historyDivIN.appendChild(s);
}



function drawHistoryLabels(type){
    var historyLabels = createDiv(type+"_historyLabels");
    historyLabels.className = "historyLabels";
    labels=["Period","My Choice","Other's Choice","My Payoff"];
    ids=["period","myChoice","theirChoice","myPayoff"];
    classes=["historyLabelEntryShort","historyLabelEntry","historyLabelEntry","historyLabelEntryShort"];
    y=[0,25,75,125];
    for(k=0;k<4;k++){
        var historyLabelEntry = document.createElement("div");
        historyLabelEntry.className = classes[k];
        historyLabelEntry.id = type+"_historyLabel_"+ids[k];
        historyLabelEntry.innerHTML=labels[k];
        historyLabelEntry.style.transform="translate3d(0px,"+y[k]+"px,0px)";
        historyLabels.appendChild(historyLabelEntry);
    }
    $("#"+type+"_history").append(historyLabels);
}










function displayHypHistory(incoming){
    types=["hyp","hypActual"]
    for(t=0;t<2;t++){
        type=types[t];
        longest=1;
        //console.log("hypmessage",type,getRuleSet(type));
        for(k=0;k<window.ruleSets[getRuleSet(type)].length;k++){
            if(window.ruleSets[getRuleSet(type)][k].length>longest){
                longest=window.ruleSets[getRuleSet(type)][k].length;
            }
        }

        complete=1;
        for(k=15-longest+1;k<15;k++){
            if(window.hypHistoryList[k][0]==-1){complete=0;}
            if(window.hypHistoryList[k][1]==-1){complete=0;}
        }

        if(complete==1){//0){
            deleteDiv(type+"_historyRuleHighlight");
            deleteDiv(type+"_ruleListRuleHighlight");
        }

        if(isDivNotThere(type+"HistoryMessage")==true){
            thisMessage=createDiv(type+"HistoryMessage");
            if(complete==-10){
                display1="History #"+window.hypTab+" is <a id='incompleteHypotheticalHistory'>incomplete</a>.  Your history must be at least as long as your longest rule.";
            }
            else if(complete<=1){
                display1="With History <a id='"+type+"HypTabNumber'>#"+window.hypTab+"</a>, <a id='"+type+"ChoiceRuleNumber'>Rule #</a> will be selected and will play <a id='"+type+"ChoiceRuleOutput' class='makeSpace ySquare sqaure'></a> next period.";
            }
            display1=display1+"<br><div id='"+type+"Addendum' class='hypHistoryMessageAddendum'>Since you have rules longer than the history, those rules are not applicable for this choice.</div>";
            thisMessage.innerHTML=display1;
            $('#mainDiv').append(thisMessage);
        }

        if(complete==0){
            document.getElementById(type+'Addendum').innerHTML="Since you have rules longer than the history, those rules are not applicable for this choice.";
        }
        else{
            document.getElementById(type+'Addendum').innerHTML="";
        }


        if(incoming[getRuleSet(type)+'RuleOutput']!=undefined){
            if(document.getElementById(type+'ChoiceRuleNumber')!=null){
                document.getElementById(type+'ChoiceRuleNumber').innerHTML="Rule #"+incoming[getRuleSet(type)+'RuleNumber'];
                document.getElementById(type+'HypTabNumber').innerHTML="#"+window.hypTab;
                if(incoming[getRuleSet(type)+'RuleOutput']==0){thisChoice="w";}
                else{thisChoice="y";}
                document.getElementById(type+'ChoiceRuleOutput').className=thisChoice+"Square square makeSpace";
                document.getElementById(type+'ChoiceRuleOutput').style.transform="scale(.75)"
                highlightRule(type,incoming[getRuleSet(type)+'RuleNumber'],incoming[getRuleSet(type)+'RuleLength']);
                if(document.getElementById(type+'_history_square_16_0')!=null){
                    document.getElementById(type+'_history_square_16_0').className=thisChoice+"Square square proposed";
                    highlightHistory(type,incoming[getRuleSet(type)+'RuleLength'],15);
                    //highlightRule("hyp",window.nextPeriodRule,window.nextPeriodRuleLength);
                }
            }
        }
    }
}



function changeSquareHyp(period,player){
    button1="hyp_history_square_"+period+"_"+player;
    button2="hypActual_history_square_"+period+"_"+player;
    var thisSquare=document.getElementById(button1);
    var w = thisSquare.className.indexOf("wSquare");
    var y = thisSquare.className.indexOf("ySquare");
    if(w==-1 && y==-1){
        if(Math.random()>.5){
            w=1;
        }
        else{
            y=1
        }
    }    

    if(w==-1 && y>-1){
        document.getElementById(button1).className="wSquare square";
        document.getElementById(button2).className="wSquare square";
        newChoice=0;
    }
    else if(w>-1 && y==-1){
        document.getElementById(button1).className="ySquare square";
        document.getElementById(button2).className="ySquare square";
        newChoice=1;
    }

    window.hypHistoryList[period-1][player]=newChoice;
    updateHypHistoryOnServer();
    displayHypHistory({"nothing":"nothing"});
}

function updateHypHistoryOnServer(){
    var message={"type":"hypotheticalHistory","history":window.hypHistoryList,"historyNumber":window.hypTab};
    sock.send(JSON.stringify(message));
}



function fillHistory(type,period,row,action){
    document.getElementById(type+'_history_square_'+period+'_'+row).className=action+"Square square";
}


function deleteHistoryPeriod(type,period){
    deleteDiv(type+'_historyPayoffLabel_'+period);
    deleteDiv(type+'_historyPeriodLabel_'+period);
    deleteDiv(type+'_history_square_'+period+'_0');
    deleteDiv(type+'_history_square_'+period+'_1');
}


function fillHistoryOld(divName,historyIN,thisPeriod,updateType){
    //console.log("fillHistory");
    if(document.getElementById("slider")==null){
        drawHistory("regular");
        updateType="all";
    }
    target=200;
    if(updateType=="all"){
        for(k=1;k<=historyIN.length;k++){
            period=thisPeriod+k-historyIN.length
            for(j=0;j<2;j++){
                document.getElementById(divName+'_history_square_'+(period)+'_'+j).className=actionFromInteger(historyIN[k-1][j])+"Square square";
            }
            document.getElementById(divName+'_historyPayoffEntry_'+(period)).innerHTML=window.currentPayoffHistory[k-1][0];
        }
        thisOffset=1280-target-thisPeriod.length*50;
        allHistoryDiv=document.getElementById(divName+"_allHistoryDiv");
        tn=thisPeriod*50;
        allHistoryDiv.style.left=-tn+"px";
        //fill all
    }
    else{
        for(j=0;j<2;j++){
            document.getElementById(divName+'_history_square_'+(thisPeriod)+'_'+j).className=actionFromInteger(historyIN[historyIN.length-1][j])+"Square square";
        }
        document.getElementById(divName+'_historyPayoffEntry_'+(thisPeriod)).innerHTML=window.currentPayoffHistory[historyIN.length-1][0];
        allHistoryDiv=document.getElementById(divName+"_allHistoryDiv");
        thisVal=parseInt(allHistoryDiv.style.left,10)+thisPeriod*50;
        if(Math.abs(thisVal)>100){
            tn=thisPeriod*50;
            allHistoryDiv.style.left=-tn+"px";
        }
        else{
            window.speed=window.speed*(1-.05*(thisVal/100));
        }
        window.speed=2;
        //tn=thisPeriod*50;
        //allHistoryDiv.style.left=-tn+"px";
    }
    changeSliderSpeed(divName);
}

function changeSliderSpeed(divName){
    newTime=1000000*window.speed;
    $("#"+divName+"_allHistoryDiv").stop();
    if(window.speed<100){
        $("#"+divName+"_allHistoryDiv").animate({left:"-50000px"},newTime,"linear");
    }
}


function testAlert(stringIN){
    alert(stringIN);
}

function removeListeners(divIN){
    if(isDivNotThere(divIN)==false){
        var old_element = document.getElementById(divIN);
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
    }
}

function alreadySubmitted(message){
    thisDiv=createDiv("alreadySubmitted");
    thisDiv.innerHTML=message;
    document.getElementById("mainDiv").appendChild(thisDiv);
    setTimeout(function(){
        document.getElementById("alreadySubmitted").classList.add('didLoad');
    },10);
    // thisDiv.style.transform="translateX(100px)";
    // thisDiv.style.transition="all .15s ease";
    // thisDiv.style.transitionDelay=".0015s";
}

function drawNextAction(divName){
    divID=divName+'_history_square_'+(window.currentPeriod+1)+'_0';
    removeListeners(divID);
    nextActionSquare=document.getElementById(divID);
    if(nextActionSquare!=null){
        if(window.state["page"]=="instructions"){
            nextActionSquare.className=actionFromInteger(window.nextPeriodPlay)+"Square square proposed";
        }
        else if(window.state["page"]=="game" && window.state["confirmed"]=="no"){
            nextActionSquare.className=actionFromInteger(window.nextPeriodPlay)+"Square square proposed";
            nextActionSquare.addEventListener("click",function(e){
                submitChoice(divID);
                e.target.removeEventListener(e.type, arguments.callee);
            });
        }
        else if(window.state["page"]=="game" && window.state["confirmed"]=="yes"){
            nextActionSquare.className=actionFromInteger(window.nextPeriodPlay)+"Square square confirmed";
            pf=partial(alreadySubmitted,"Already made choice");
            nextActionSquare.addEventListener("click",pf);
        }
        // else if(window.state["page"]=="game" && window.state["confirmed"]=="no" && window.state["locked"]=="no"){
        //     nextActionSquare.className=actionFromInteger(window.nextPeriodPlay)+"Square square proposed";
        //     pf=partial(alreadySubmitted,"Must lock rules.");
        //     nextActionSquare.addEventListener("click",pf);
        // }
        highlightHistory(divName,window.nextPeriodRuleLength,window.currentPeriod);
    }
    $("#"+divID).off("click");

}

function submitChoice(e,divID){
    console.log("submitingShoices");
    deleteWarning();
    var message={"type":"confirmChoice"};
    sock.send(JSON.stringify(message));
}

// function moveTimer(timerName){
//     timerSeconds=window.timer-((new Date()).getTime()-window.timerCheck)/1000;
//     if(timerSeconds>0){
//         var pretty = makeTimePretty(timerSeconds);
//         if(document.getElementById(timerName)!=null){document.getElementById(timerName).innerHTML=pretty;}
//         var pf = partial(moveTimer,timerName);
//         setTimeout(pf,1000);
//     }
//     else{
//         if(document.getElementById(timerName)!=null){
//             document.getElementById(timerName).innerHTML="0:00";
//         }
//     }
// }


function moveSelfTimer(timerName){
    timerSeconds=window.selfTimer-((new Date()).getTime()-window.timerCheck)/1000;
    if(timerSeconds>0){
        var pretty = makeTimePretty(timerSeconds);
        if(document.getElementById(timerName)!=null){document.getElementById(timerName).innerHTML=pretty;}
        var pf = partial(moveSelfTimer,timerName);
        setTimeout(pf,1000);
    }
    else{
        if(document.getElementById(timerName)!=null){
            document.getElementById(timerName).innerHTML="0:00";
        }
    }
}



// function changeSliderSpeedODL(divName){
//     console.log("changeSliderSpeed");
//     newTime=1000000*window.speed;
// document.getElementById("slider_allHistoryDiv").style.transform="translate3d(19500px,0px,0px)";
// document.getElementById("slider_allHistoryDiv").style.transition="all 100s linear";
// setTimeout(function(){document.getElementById("slider_allHistoryDiv").style.transform="translate3d(19300px,0px,0px)";},20);

//     // document.getElementById(divName+"_allHistoryDiv").style.transform="translate3d(-200px,0px,0px)";
//     // document.getElementById(divName+"_allHistoryDiv").style.transition="all 5s linear";
//     // setTimeout(function(){document.getElementById(divName+"_allHistoryDiv").style.transform="translate3d(-250px,0px,0px)";},2000);
// }

//drawSlider();
// window.setTimeout(startSlider,10);
// window.setInterval(changeSliderSpeed,500);


// constructor=[["w","y"],["w","y"],["w","y"],["y","q"],["w","q"],["w","y"],["w","y"],["w","y"],["y","q"],["w","q"],["w","w"],["y","w"],["w","y"],["y","q"],["w","q"],["y"]]
// constructor=[["w","w"],["y","w"],["w","y"],["y","q"],["w","q"],["y"]]
// drawConstructor(constructor);
// drawGame();

// thispos=0;
// timerSeconds=(new Date()).getTime()/1000;
// for(k=0;k<100000;k++){
//     if(1000*((new Date()).getTime()/1000-timerSeconds)>100){
//         timerSeconds=(new Date()).getTime()/1000;
//         thispos=thispos-10;
//         document.getElementById('historyDiv').style.left=thispos+"px";
//         document.getElementById('historyLabelsDiv').style.left=thispos+"px";
//     }
// }


function parameters(incoming){
    //console.log("oparamersMEssage");
  speed=incoming['speed']
  payoffs=incoming['payoffs']
  choices=incoming['choices']
  window.speed=incoming['speed'];
  window.ruleLockFixedCost=incoming['ruleLockFixedCost'];
  window.ruleLockMarginalCost=incoming['ruleLockMarginalCost'];
  window.actions=choices;
  window.payoffs=payoffs;
  window.constructorChoices=choices;
}

function reconnecting(incoming){
  //console.log("reconnectingMessage");
  window.state=incoming['status'];
  window.currentUnlockedTime=incoming['currentUnlockedTime'];
  window.unlockedTimeUpdate=(new Date()).getTime();
  statusManager();
}


function hypotheticalChoice(incoming){
  // window.hypotheticalChoiceRuleNumber=incoming['ruleNumber'];
  // window.hypotheticalChoiceRuleOutput=incoming['ruleOutput'];

// hypRuleNumber']=hypRuleOut.number
//       msg['hypRuleOutput']=hypRuleOut.output
//       msg['hypRuleLength']=hypRuleOut.length
//       msg['regularRuleNumber']=regularRuleOut.number
//       msg['regularRuleOutput']=regularRuleOut.output
//       msg['regularRuleLength
    displayHypHistory(incoming)
}





function drawMessage(message,fontColorIN){
    div=createDiv("inGameMessage")
    var div2 = document.createElement("div");
    div2.id = "inGameMessageInside";
    var div3 = document.createElement("div");
    div3.id = "inGameMessageText";
    div3.innerHTML=message;
    div3.style.color=fontColorIN;

    div2.appendChild(div3);
    div.appendChild(div2);
    document.getElementById("mainDiv").appendChild(div);

}


function getRuleSet(type){
    if(type=="hypHyp"){
        typeOut="hyp";
    }
    else if(type=="hypActual"){
        typeOut="regular";
    }
    else if(type=="regular"){
        typeOut="regular";
    }
    else{
        typeOut=type;
    }
    return typeOut
}










function addHypHistory(){
    var message={"type":"addHypHistory"};
    sock.send(JSON.stringify(message));
}


window.ruleSets=[]
window.ruleNumbers=[]
window.ruleLastUsed=[]
window.ruleFrequency=[]
window.firstPeriodRule=[]
window.constructors=[]
window.constructors["hyp"]=[[-1,-1],[-1]];
window.constructors["regular"]=[[-1,-1],[-1]];


function getHypHistory(number){
    var message={"type":"getHypHistory","number":number};
    sock.send(JSON.stringify(message));

}


function drawHypTabs(){
    for(k=1;k<=window.hypHistories;k++){
        var hypSliderButton = createDiv("hypSliderButton_"+k);
        hypSliderButton.className="hypSliderSwitchButton";
        hypSliderButton.style.left=(10+65*(k-1))+"px";
        hypSliderButton.innerHTML="History "+k;
        hypSliderButton.style.backgroundColor="rgba(225,225,225,1)";
        hypSliderButton.style.border="1px solid rgba(255,0,0,.3)";
        var pf = partial(getHypHistory,k);
        hypSliderButton.addEventListener("click",pf);
        $("#mainDiv").append(hypSliderButton);
    }

    document.getElementById("hypSliderButton_"+window.hypTab).style.backgroundColor="rgba(255,255,255,1)";
    document.getElementById("hypSliderButton_"+window.hypTab).style.border="1px solid red";

    if(window.hypHistories<9){
        var hypSliderButton = createDiv("hypSliderButton_Add");
        hypSliderButton.className="hypSliderSwitchButton";
        hypSliderButton.style.left=(10+65*(window.hypHistories))+"px";
        hypSliderButton.innerHTML="New History";
        hypSliderButton.addEventListener("click",addHypHistory);
        $("#mainDiv").append(hypSliderButton);
    }
    // var hypSliderButton = createDiv("hypActualSliderButton_"+number);
    // hypSliderButton.className="actualSliderSwitchButton";
    // hypSliderButton.style.left=(650+65*(number-1))+"px";
    // hypSliderButton.innerHTML="History "+number;
    // var pf = partial(showHypHistory,number);
    // hypSliderButton.addEventListener("click",pf);
    // $("#mainDiv").append(hypSliderButton);
}


function showHypothetical(incoming){
    window.hypHistoryList=incoming['hypHistory'];
    window.hypHistories=incoming['totalHypHistories'];
    window.hypTab=incoming['hypHistoryNumber'];
}

function hypHistory(incoming){
    window.hypHistoryList=incoming['hypHistory'];
    window.hypHistories=incoming['totalHypHistories'];
    window.hypTab=incoming['hypHistoryNumber'];
    window.hypHistoryListComplete=incoming['hypHistoryComplete'];
    drawHistory("hyp");
    drawHistory("hypActual");
    drawHypTabs();
    displayHypHistory({"nothing":"nothing"});
}



function deleteHypothetical(){
    deleteDiv("hypLeft");
    deleteDiv("hypRight");
    deleteDiv("hypTitle");
    deleteDiv("hypActualTitle");
    deleteDiv("hypConstructorDiv");
    deleteDiv("hypDefaultDiv");
    deleteDiv("hypDefaultDiv");
    deleteDiv("hypActualRuleList");
    deleteDiv("hypRuleList");
    deleteDiv("hypActual_history");
    deleteDiv("hyp_history");
}


function drawHypothetical(){
    clearAll();
    hypLeft=createDiv("hypLeft");
    $("#mainDiv").append(hypLeft);
    hypRight=createDiv("hypRight");
    $("#mainDiv").append(hypRight);

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
    getHypHistory(-1);


    var topInfoLeft=createDiv("topInfoLeft");
    var topInfoMiddle=createDiv("topInfoMiddle");
    topInfoMiddle.innerHTML="The match will start in <time id='timer'>5:00</time>";
    $("#mainDiv").append(topInfoLeft);
    $("#mainDiv").append(topInfoMiddle);

}





function warningMessage(incoming){
    thisDiv=createDiv("makeChoiceWarning");
    thisDiv.className = "arrow-box-up";
    thisDiv.innerHTML = "Choice will be made automatically in <br> <time id='warningTimer'>1:00</time>";
    document.getElementById("mainDiv").appendChild(thisDiv);
    moveSelfTimer("warningTimer");
    setTimeout(deleteWarningMessage,incoming['waitingTime']-200);
}

function deleteWarning(){
    deleteDiv("makeChoiceWarning");
}





function statusManager(){
  thisStatus=window.state;
  console.log(thisStatus);
  if(thisStatus[0]==-1){
    message="Loading...";
    genericScreen(message);
  }
  else if(thisStatus["page"]=="generic"){
    clearAll();
    genericScreen(thisStatus["message"]);
  }
  else if(thisStatus["page"]=="quiz"){//quiz
    clearAll();
    drawRules("regular");
    window.speed=100;
    drawHistory("regular");

    for(k=0;k<window.currentHistory.length;k++){
        period=28-window.currentHistory.length+k+1;
        if(isDivNotThere("regular_history_square_"+period+"_1")){
            drawHistoryPeriodLabels('regular',period);
            drawHistoryPeriod('regular',period,0);
            drawHistoryPeriod('regular',period,1);
            fillHistory('regular',period,0,actionFromInteger(window.currentHistory[k][0]));
            fillHistory('regular',period,1,actionFromInteger(window.currentHistory[k][1]));
            //document.getElementById("regular_historyPayoffLabel_"+period).innerHTML=window.currentPayoffHistory[k][0];
        }
    }
    document.getElementById("regular_historyIN").style.transform="translateX("+(-200)+"px)";

    // fillHistory("slider",window.currentHistory,28,"all");
    drawGame("regular");
    if(thisStatus["stage"]=="question"){
      displayQuestion();
      if(window.questionType==3 || window.questionType==5){
        drawConstructor("regular");
      }
    }
    else if(thisStatus["stage"]!="question"){
      displaySolution();
    }
  }
  else if(thisStatus["page"]=="quizSummary"){
    message="Please wait for others finish the quiz. <br> You earned "+window.state["summary"]+".";
    genericScreen(message);
  }
  else if(thisStatus["page"]=="payoffsOnly"){//Show only payoff table for a bit
    clearAll();
    $("#genericScreen").hide();

    // window.timerMessage="You will be able to make rules in "
    // window.timerLocation=[0,125,1280,75]
    window.actionProfileFrequencies=[0,0,0,0];
    // window.stop=0;
    //drawMessage("Please take this time to review the payoff table.","#FF0000");
    drawMessage("Please take this time to review the payoff table. <br> You will be able to make rules in <time id='timer'>1:00</time>","#FF0000");
    moveTimer("timer");
    drawGame("regular");
    document.getElementById("gameDiv").style.transform="scale(3)";
    document.getElementById("gameDiv").style.transformOrigin="bottom right";
  }
  else if(thisStatus["page"]=="defaultNotSet"){//default Rule Not Set yet
    window.ruleSets=[];
    window.ruleNumbers=[];
    window.ruleLastUsed=[];
    window.ruleFrequency=[];
    window.firstPeriodRule=[];
    deleteDiv("genericScreen");
    deleteDiv("regularRuleList");
    drawIfNeeded("gameDiv");
    document.getElementById("gameDiv").style.transform="scale(1)";
    document.getElementById("gameDiv").style.transition="all .5s ease-out";
    drawIfNeeded("regularDefaultDiv");
    document.getElementById("regularDefaultDiv").style.transform="scale(3)";
    document.getElementById("regularDefaultDiv").style.transformOrigin="bottom left";
    document.getElementById("regularDefaultDiv").style.transition="all .5s ease-out";
    drawInfo();
    drawMessage("Match will start in <time id='timer'>1:00</time><br>You must set your default rule before play can begin.","#FF0000");
    moveTimer("timer");
  }
  else if(thisStatus["page"]=="hypothetical"){
    console.log(thisStatus);
    clearAll();
    drawIfNeeded("hypothetical");
    moveTimer("timer");
  }
  else if(thisStatus["page"]=="preMatch"){//prematch
    clearAll();
    //deleteHypothetical();
    drawIfNeeded("gameDiv");
    drawIfNeeded("defaultDiv");
    drawIfNeeded("regularConstructorDiv");
    drawIfNeeded("regularRuleList");
    drawInfo();
    drawMessage("Match will start in <time id='timer'>1:00</time>","#FF0000");
    moveTimer("timer");
  }
  else if(thisStatus["page"]=="game"){
    drawIfNeeded("gameDiv");
    drawIfNeeded("defaultDiv");
    drawIfNeeded("regularConstructorDiv");
    drawIfNeeded("regularRuleList");
    drawIfNeeded("regular_history");
    drawInfo();
    if(thisStatus["locked"]=="no"){
        if(thisStatus["animate"]=="yes"){
            doCostAnimation();
        }
        deleteDiv("rulesLocked");
        deleteDiv("noButtonOverlay");
        deleteDiv("inGameMessage");
        drawLockButton();
        window.rulesUnlocked=1;
        //updateUnlockTime();
    }
    else if(thisStatus["locked"]=="yes"){
        drawLock();
        drawUnlockButton();
    }
    drawNextAction("regular");
  }
  else if(thisStatus["page"]=="postMatch"){//MatchOver
    drawIfNeeded("gameDiv");
    // drawIfNeeded("defaultDiv");
    // drawIfNeeded("regularConstructorDiv");
    drawIfNeeded("regularRuleList");
    drawIfNeeded("regular_history");
    // deleteDiv("rulesLocked");
    // deleteDiv("noButtonOverlay");
    // deleteDiv("inGameMessage");
    // deleteDiv("lockRulesButton");
    drawInfo();
    drawPostMatch();
  }
}


function doCostAnimation(){
    costAnimation=createDiv("costAnimation");
    costAnimation.innerHTML=window.ruleLockFixedCost;
    document.getElementById("mainDiv").appendChild(costAnimation);
    document.getElementById('costAnimation').style.transform="translate(-125px,750px) scale(2.75)";
    setTimeout(function(){
        document.getElementById('costAnimation').style.transform="scale(1)";
        document.getElementById("costAnimation").style.transition="all 1.25s ease";
        document.getElementById('topInfoRight').innerHTML="Total Earned Today: <span style='color:#008800'>"+window.totalPayoff+"</span> - <span style='color:#FF0000'>"+parseInt(window.unlockCosts-window.ruleLockFixedCost)+"</span> = "+(window.totalPayoff-parseInt(window.unlockCosts-window.ruleLockFixedCost));

    },1);
    setTimeout(function(){
        deleteDiv("costAnimation");
        document.getElementById('topInfoRight').innerHTML="Total Earned Today: <span style='color:#008800'>"+window.totalPayoff+"</span> - <span style='color:#FF0000'>"+parseInt(window.unlockCosts)+"</span> = "+(window.totalPayoff-parseInt(window.unlockCosts));
    },1000)
}

function beginRules(incoming){
    //console.log(incoming);
    thisFirst=eval(JSON.parse(JSON.stringify(incoming['firstPeriodRule'])));
    thisDefault=eval(JSON.parse(JSON.stringify(incoming['defaultRule'])));
    if(window.thisDefault==0){
        document.getElementById('chooseDefault0').className += " defaultSelected";
        document.getElementById('chooseDefault1').className = "ySquare square";
    }
    else if(window.thisDefault==1){
        document.getElementById('chooseDefault0').className = "wSquare square";
        document.getElementById('chooseDefault1').className += " defaultSelected";
    }

    if(window.thisFirst==0){
        document.getElementById('chooseFirstPeriod0').className += " defaultSelected";
        document.getElementById('chooseFirstPeriod1').className = "ySquare square";
    }
    else if(window.thisFirst==1){
        document.getElementById('chooseFirstPeriod0').className = "wSquare square";
        document.getElementById('chooseFirstPeriod1').className += " defaultSelected";
    }

}


function updateRules(incoming){
    //console.log("updateRulesMessage",incoming['ruleType'],getRuleSet(incoming['ruleType']),getRuleSet(incoming['ruleType']) in window.ruleSets);
    ruleType=getRuleSet(incoming['ruleType']);
    window.ruleSets[ruleType]=eval(JSON.parse(JSON.stringify(incoming['currentRules'])));
    //console.log('updateRulesMessage',ruleType,incoming['ruleType']);
    window.ruleNumbers[ruleType]=eval(JSON.parse(JSON.stringify(incoming['currentRuleNumbers'])));
    window.ruleLastUsed[ruleType]=eval(JSON.parse(JSON.stringify(incoming['lastUsed'])));
    window.ruleFrequency[ruleType]=eval(JSON.parse(JSON.stringify(incoming['ruleFrequency'])));
    window.firstPeriodRule[ruleType]=eval(JSON.parse(JSON.stringify(incoming['firstPeriodRule'])));
    if(incoming['updateType']=="everything"){
        if(thisStatus["page"]=="hypothetical"){
            drawRules("hyp");            
            drawRules("hypActual");    
            if(window.hypHistoryList!=undefined){updateHypHistoryOnServer();}
        }  
        else{
            drawRules("regular");            
            drawInfo();
        }
    }
    else{
        window.nextPeriodPlay=incoming['nextPeriodPlay'];
        window.nextPeriodRule=incoming['nextPeriodRule'];
        window.nextPeriodRuleLength=incoming['nextPeriodRuleLength'];
        updateRuleStats(ruleType,incoming['lastRuleNumber'],incoming['lastRuleLastUsed'],incoming['lastRuleFrequency']);
    }
  window.nextPeriodPlay=incoming['nextPeriodPlay'];
  window.nextPeriodRule=incoming['nextPeriodRule'];
  window.nextPeriodRuleLength=incoming['nextPeriodRuleLength'];

  if(ruleType=="regular" && window.state['page']=="game"){
      drawNextAction("regular");
      type=incoming['ruleType'];
      highlightRule(ruleType,incoming['nextPeriodRule'],incoming['nextPeriodRuleLength']);
  }

    if(thisStatus["page"]=="game" && thisStatus["stage"]=="defaultNotSet"){
        statusManager();
    }

}


function quizQuestion(incoming){
  window.questionType=incoming['questionType'];
  window.questionNumber=incoming['questionNumber'];
  window.question=incoming['question'];
  window.questionParams=incoming['questionParams'];
  window.tries=incoming['tries']
  window.price=incoming['price']
  window.quizEarnings=incoming['quizEarnings']
  window.currentHistory=incoming['history'];
  window.actualX=-100;
  window.deltaX=-100;
  window.targetX=-100;
  window.lastTimeCheck=(new Date()).getTime();

    window.ruleSets=[]
    window.ruleNumbers=[]
    window.ruleLastUsed=[]
    window.ruleFrequency=[]
    window.firstPeriodRule=[]
    window.firstPeriodRule['regular']=0;
    window.ruleSets['regular']=incoming['rules'];
    window.ruleNumbers['regular']=incoming['ruleNumbers'];
    window.ruleLastUsed['regular']=incoming['ruleLastUsed'];
    window.ruleFrequency['regular']=incoming['ruleFrequency'];
  window.lastRule=-1;
  window.lastRuleLength=-1;
  window.constructors['regular']=[[-1,-1],[-1]];
  window.answerStatement=incoming['answerStatement'];
  window.questionStatement=incoming['questionStatement'];
  statusManager();
}


function newHistory(incoming){
  window.currentHistory=incoming['history'];
  window.currentPayoffHistory=incoming['payoffHistory'];
  window.currentPeriod=incoming['period'];
  window.actionProfileFrequencies=incoming['actionProfileFrequencies'];
  window.lastPlay=incoming['lastPlay'];

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

  for(k=0;k<window.currentPeriod-21;k++){
    deleteHistoryPeriod('regular',k);
  }
  document.getElementById("regular_historyIN").style.transform="translateX("+(1150-window.currentPeriod*50)+"px)";
  document.getElementById("regular_historyIN").style.transition="all .15s ease";
  document.getElementById("regular_historyIN").style.transitionDelay=".0015s";


  if(window.state['page']=="game"){
      drawHistoryPeriod('regular',window.currentPeriod+1,0);
      drawHistoryPeriodLabels('regular',window.currentPeriod+1);
    }
    // window.currentPeriod=window.currentPeriod+1;
  for(k=0;k<4;k++){
    document.getElementById("gameTable_4_"+(k+1)).innerHTML=window.actionProfileFrequencies[k];
  }
  highlightPayoffs();
  window.matchPayoff=incoming['matchPayoff'];
  window.unlockCosts=incoming['unlockCosts'];
  window.totalPayoff=incoming['totalPayoff'];
  window.lockCosts=incoming['lockCosts'];
  window.lastRule=incoming['lastRule'];
  window.lastRuleLength=incoming['lastRuleLength'];
  if(isNaN(window.actualX)){
    window.actualX=-100;
  }
  else{
    window.actualX=window.actualX+50
  }
  window.targetX=-100
  window.lastTimeCheck=(new Date()).getTime();
  window.serverTime=incoming['elapsed']*1000;
  //statusManager();
    drawInfo();
}

function highlightPayoffs(){
  for(k=0;k<4;k++){
    if(k==window.lastPlay){
        document.getElementById("gameTable_4_"+(k+1)).style.color="red";
        document.getElementById("gameTable_4_"+(k+1)).style.fontSize="200%";
        document.getElementById("gameTable_4_"+(k+1)).style.transition = "all .5s ease-out";

        document.getElementById("gameTable_2_"+(k+1)).style.color="green";
        document.getElementById("gameTable_2_"+(k+1)).style.fontSize="200%";
        document.getElementById("gameTable_2_"+(k+1)).style.transition = "all .5s ease-out";
    }
    else{
        for(j=2;j<5;j++){
            document.getElementById("gameTable_"+j+"_"+(k+1)).style.color="black";
            document.getElementById("gameTable_"+j+"_"+(k+1)).style.fontSize="125%";
        }
    }

    if(window.currentPeriod>0){
        document.getElementById("regular_historyPayoffLabel_"+(window.currentPeriod)).style.color="green";
        document.getElementById("regular_historyPayoffLabel_"+(window.currentPeriod)).style.fontSize="200%";
        document.getElementById("regular_historyPayoffLabel_"+(window.currentPeriod)).style.transition = "all .5s ease-out";
    }
    if(window.currentPeriod>1){
        document.getElementById("regular_historyPayoffLabel_"+(window.currentPeriod-1)).style.color="black";
        document.getElementById("regular_historyPayoffLabel_"+(window.currentPeriod-1)).style.fontSize="100%";
    }
  }
}


function displayQuestion(){
    quizDiv=createDiv("quizDiv");
    $('#mainDiv').append(quizDiv);
    deleteDiv("quizAnswerDiv");
    deleteWarning();
    quizEarningsDiv=createDiv("quizEarningsDiv");
    quizEarningsDiv.innerHTML="Quiz Earnings: "+window.quizEarnings;
    quizDiv.appendChild(quizEarningsDiv);

    if(window.questionType==1){
        quizQuestionDiv=createDiv("quizQuestionDiv");
        quizQuestionDiv.innerHTML=window.questionNumber+". Given the current history, what action will be played in the next period?";

        quizQuestionHint=createDiv("quizQuestionHint");
        quizQuestionHint.innerHTML="Hint: for an example see lines 139-141 of the instructions.";
        quizQuestionDiv.appendChild(quizQuestionHint);
        var listEntryButton1 = document.createElement("a");
        listEntryButton1.className = "wSquare square answerW";
        answer=0;
        confirmationStatement="Are you sure you want to submit W as your answer??";
        if(thisStatus["stage"]=="question"){
            var pf = partial(submitAnswer,confirmationStatement,answer,window.questionType);
            listEntryButton1.addEventListener("click",pf);
        }
        quizDiv.appendChild(listEntryButton1);

        var listEntryButton2 = document.createElement("a");
        listEntryButton2.className = "ySquare square answerY";
        answer=1;
        confirmationStatement="Are you sure you want to submit Y as your answer??";
        if(thisStatus["stage"]=="question"){
            var pf = partial(submitAnswer,confirmationStatement,answer,window.questionType);
            listEntryButton2.addEventListener("click",pf);
        }
        quizDiv.appendChild(listEntryButton2);
    }
    else if(window.questionType==2){
        quizQuestionDiv=createDiv("quizQuestionDiv");
        quizQuestionDiv.innerHTML=window.questionNumber+". "+window.questionStatement;


        quizQuestionHint=createDiv("quizQuestionHint");
        quizQuestionHint.innerHTML="Hint: for an example see lines 57-65 of the instructions.";
        quizQuestionDiv.appendChild(quizQuestionHint);

        for(k=1;k<=8;k++){
            var answerButton = document.createElement("a");
            answerButton.className = "blankSquare square answerW";
            answerButton.style.top=(125)+"px";
            answerButton.style.left=(-10+k*100)+"px";
            answerButton.innerHTML=k;
            answer=k;
            confirmationStatement="Are you sure you want to submit "+k+" as your answer??";
            if(thisStatus["stage"]=="question"){
                var pf = partial(submitAnswer,confirmationStatement,answer,window.questionType);
                answerButton.addEventListener("click",pf);
            }
            quizDiv.appendChild(answerButton);
        }
    }
    else if(window.questionType==3){
        quizQuestionDiv=createDiv("quizQuestionLeftDiv");
        quizQuestionDiv.innerHTML=window.questionNumber+". ADD a rule to the set to ensure that "+window.actions[window.questionParams[0]]+" will be played next period.";
        quizQuestionHint=createDiv("quizQuestionHint2");
        quizQuestionHint.innerHTML="Hint: for an example see lines 142-148 of the instructions.";
        quizQuestionDiv.appendChild(quizQuestionHint);

    }
    else if(window.questionType==4){
        quizQuestionDiv=createDiv("quizQuestionDiv");
        quizQuestionDiv.innerHTML=window.questionNumber+". DELETE a rule from the set to ensure that "+window.actions[window.questionParams[0]]+" will be played next period.";
        quizQuestionHint=createDiv("quizQuestionHint");
        quizQuestionHint.innerHTML="Hint: for an example see lines 142-148 of the instructions.";
        quizQuestionDiv.appendChild(quizQuestionHint);
    }
    else if(window.questionType==5){
        quizQuestionDiv=createDiv("quizQuestionLeftDiv");
        quizQuestionDiv.innerHTML=window.questionNumber+". COPY and SWITCH a rule from the set to ensure that "+window.actions[window.questionParams[0]]+" will be played next period.";
        quizQuestionHint=createDiv("quizQuestionHint2");
        quizQuestionHint.innerHTML="Hint: for an example see lines 108-117 of the instructions on how to COPY and SWITCH a rule.";
        quizQuestionDiv.appendChild(quizQuestionHint);

    }
    quizDiv.appendChild(quizQuestionDiv);
}


function submitAnswer(confirmationStatement,answer,questionType){
    var confirmation=confirmAction(confirmationStatement);
    if(confirmation){
        var message={"type":"quizAnswer","answer":answer,"questionType":questionType};
        sock.send(JSON.stringify(message));
    }
}

function confirmAction(m){
  var confirmed = confirm(m);
  return confirmed;
}

function answerSolution(incoming){
  window.answerMessage=incoming;
  window.quizEarnings=incoming['quizEarnings']
  statusManager();
}


         // msg['solution']="correct"
         // msg['solutionText']="The answer is correct."
         // msg['buttonText']="Next Question."



function sendSimpleMessage(input){
    var message={"type":input};
    sock.send(JSON.stringify(message));    
}



//         sendSimpleMessage("nextQuestion")
// sendSimpleMessage("tryAgain")



function displaySolution(){
    drawIfNeeded("quizDiv");
    quizAnswerDiv=createDiv("quizAnswerDiv");
    quizAnswerDiv.innerHTML=window.answerMessage['solutionText'];
    quizAnswerDivButton=createDiv("quizAnswerDivButton");
    quizAnswerDivButton.innerHTML=answerMessage['buttonText'];
    if(window.answerMessage['solution']=="incorrect" && window.tries<2){
        quizAnswerDiv.style.borderColor = "red";
        quizAnswerDivButton.style.borderColor = "red";
        quizAnswerDivButton.style.backgroundColor = "rgba(255,0,0,.2)";
        var pf = partial(sendSimpleMessage,"tryAgain");
        quizAnswerDivButton.addEventListener("click",pf);
    }


    else if(window.tries>1 && window.answerMessage['solution']=="incorrect"){
        quizAnswerDiv.innerHTML=quizAnswerDiv.innerHTML+"<br>"+window.answerStatement
        quizAnswerDiv.style.borderColor = "red";
        quizAnswerDivButton.style.borderColor = "red";
        quizAnswerDivButton.style.backgroundColor = "rgba(255,0,0,.2)";
        var pf = partial(sendSimpleMessage,"tryAgain");
        quizAnswerDivButton.addEventListener("click",pf);
    }


    else if(window.answerMessage['solution']=="correct"){
        quizAnswerDiv.innerHTML=quizAnswerDiv.innerHTML+"<br>"+window.answerStatement
        quizAnswerDiv.style.borderColor = "green";
        quizAnswerDivButton.style.borderColor = "green";
        quizAnswerDivButton.style.backgroundColor = "rgba(0,255,0,.2)";
        var pf = partial(sendSimpleMessage,"nextQuestion");
        quizAnswerDivButton.addEventListener("click",pf);
    }

    $('#mainDiv').append(quizAnswerDiv);
    $('#quizAnswerDiv').append(quizAnswerDivButton);
}
//     quizQuestionDiv=createDiv("quizQuestionDiv");





//   if(window.answerMessage['solution']=="correct"){
//     var x=0;
//     var y=255;
//     thisText="Next Question";
//   }
//   else if(window.answerMessage['solution']=="incorrect"){
//     var x=255;
//     var y=0;
//     thisText="Try Again";
//   }



//   var myRectangle={
//     start:[0,774],
//     end:[930,1024],
//     text:"",
//     context:window.context3,
//     borderWidth:4,
//     backgroundColor:"white",
//     borderColor:"rgba("+x+","+y+",0,1)",
//     fontType:"40px Proxima Nova"
//   };
//   drawRectangle2(myRectangle);

//   var myRectangle={
//     start:[0,774],
//     end:[930,824],
//     text:window.answerMessage['solutionText'],
//     context:window.context3,
//     borderWidth:4,
//     backgroundColor:"transparent",
//     borderColor:"transparent",
//     fontType:"26px Proxima Nova"
//   };
//   drawRectangle2(myRectangle);

//   var myRectangle={
//     start:[730,974],
//     end:[930,1024],
//     text:thisText,
//     context:window.context3,
//     borderWidth:4,
//     backgroundColor:"rgba("+x+","+y+",0,.2)",
//     borderColor:"rgba("+x+","+y+",0,1)",
//     fontType:"16px Proxima Nova"
//   };
//   drawRectangle2(myRectangle);

//   window.buttons['solution']=[]
//   if(window.answerMessage['solution']=="correct"){
//     fontStyle = {};
//     fontStyle['font'] = "24px Proxima Nova";
//     fontStyle['color'] = '#008800';
//     wrapText(window.context3,window.answerStatement,465,874,465,30,fontStyle);
//     window.buttons['solution'].push([730,924,200,100,["nextQuestion"]])
//   }
//   else if(window.tries>1 && window.answerMessage['solution']=="incorrect"){
//     fontStyle = {};
//     fontStyle['font'] = "24px Proxima Nova";
//     fontStyle['color'] = '#008800';
//     wrapText(window.context3,window.answerStatement,465,874,465,30,fontStyle);
//     window.buttons['solution'].push([730,924,200,100,["tryAgain"]])
//   }
//   else{
//     window.buttons['solution'].push([730,924,200,100,["tryAgain"]])    
//   }

//   // var myRectangle={x:615,y:175,action:window.answerMessage['buttonText'],context:window.context3,borderWidth:1,borderColor:color,h:30,w:150};
//   // drawRectangle(myRectangle);
// }

// drawTopInfo();
// historySequence=[["y","w"],["w","y"]]
// drawHistory(historySequence,5);
// document.getElementById('history_square_2_0').className="ySquare square";
// highlightHistory(1,3,6);

//document.getElementById('historyDiv').classList.add('horizTranslate');

// window.setInterval(addHistory,4000);
// addHistory();
// function addHistory(){
//     historySequence.push(['w','w']);
//     drawHistory(historySequence,3);
// }


//window.setInterval(testing,10);
// testing();
// function testing(){
//     thispos=thispos-.125;
//     document.getElementById('historyLabelsDiv').style.left=thispos+"px"
//     document.getElementById('historyDiv').style.left=thispos+"px"
// }



// var testDiv = document.createElement("div");
// testDiv.className = "testDiv";
// $("body").append(testDiv);


// testDiv.style.transition = "all .5s ease-out";
// testDiv.style.transform = "translate(100px,0px)";

//drawInstructionDemo(0


function newPeriodTest(){
    input=window.instructionInput[window.instructionDemoIndex%window.instructionInput.length];
    window.currentPeriod=window.currentPeriod+1;
    drawHistoryPeriod('regular',window.currentPeriod+1,0);
    drawHistoryPeriod('regular',window.currentPeriod,1);
    drawHistoryPeriodLabels('regular',window.currentPeriod);

    fillHistory("regular",window.currentPeriod,0,input[0][0]);
    fillHistory("regular",window.currentPeriod,1,input[0][1]);
        window.nextPeriodPlay=input[1];
        window.nextPeriodRuleLength=input[2];
    //window.currentPeriod
        window.nextPeriodRule=input[3];
        drawNextAction("regular");
  document.getElementById("regular_historyIN").style.transform="translateX("+(1150-window.currentPeriod*50)+"px)";
  document.getElementById("regular_historyIN").style.transition="all .5s ease";
  document.getElementById("regular_historyIN").style.transitionDelay=".5s";
    window.instructionDemoIndex=window.instructionDemoIndex+1;
}




// window.elapsed=.00001*1000;
// window.startTime=(new Date()).getTime()-window.elapsed;
// pf=partial(doInstructions);
// setTimeout(pf,100);



