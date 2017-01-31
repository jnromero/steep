mainDiv = createDiv("mainDiv");
$("body").prepend(mainDiv);

function parameters(message){
    window['rowColors']=message['rowColors'];
    window['colColors']=message['colColors'];
    window['pays']=message['pays'];
    window['rowActions']=message['rowActions'];
    window['colActions']=message['colActions'];
    window['numberOfRows']=message['numberOfRows'];
    window['numberOfCols']=message['numberOfCols'];
}

//
// Draw interface
//

function drawStatus(){
    var statusBar=createAndAddDiv("statusBar","mainDiv");
    var theirChoices="(";
    for(var col in window.colActions){
        theirChoices=theirChoices+window.colActions[col]+", "
    }
    theirChoices=theirChoices.substring(0, theirChoices.length - 2)+")";


    myChoices="(";
    for(var row in window.rowActions){
        myChoices=myChoices+window.rowActions[row]+", "
    }
    myChoices=myChoices.substring(0, myChoices.length - 2)+")";

    statusBar.innerHTML="Please select \"My Choice\" "+myChoices+" and your guess for \"Other's Choice\" "+theirChoices+".";
}

function drawGame(){
    //Create Game div
    var gameDiv = createAndAddDiv("gameDiv","mainDiv")
    for(var col in window.colActions){
        var gameTableColLabel = createAndAddDiv("gameTableColLabel_"+col,"gameDiv");
        gameTableColLabel.className="gameTableItem gameTableColLabel active";
        gameTableColLabel.innerHTML=window.colActions[col];
        gameTableColLabel.style.left=120+200*(col-1)+5+"px";
        gameTableColLabel.style.top="25px";
        gameTableColLabel.style.color=window.colColors[col];
    }

    if(thisStatus['colSelected']=="No"){
        for(var col in window.colActions){
            clickButton("once","gameTableColLabel_"+col,makeSelection,"col",col);
        }
    }
    else{
        summaryOthersChoiceEntryGuess=document.getElementById("summaryOthersChoiceEntryGuess");
        summaryOthersChoiceEntryGuess.innerHTML=window.colActions[thisStatus['colSelected']] +" (guess)";
        summaryOthersChoiceEntryGuess.style.color=window.colColors[thisStatus['colSelected']];
    
        selectedColumn=createAndAddDiv("selectedColumnDiv","gameDiv");
        selectedColumn.className="selectedColumnDiv";
        selectedColumn.style.left=-80+200*thisStatus['colSelected']+"px";
        selectedColumn.style.color=window.colColors[thisStatus['colSelected']];
        selectedColumn.style.borderColor=window.colColors[thisStatus['colSelected']];

        selectedColumnLabel=createAndAddDiv("selectedColumnLabel","selectedColumnDiv");
        selectedColumnLabel.className="selectedColumnLabel";
        selectedColumnLabel.innerHTML="My Guess";

        selectedColumn.style.height=(200*window.numberOfRows+150)+"px";
        selectedColumnLabel.style.top=(200*window.numberOfRows+100)+"px";
        for(col=1;col<=window.numberOfCols;col++){
            document.getElementById("gameTableColLabel_"+col).className="gameTableItem gameTableColLabel";
        }
    }

    for(var row in window.rowActions){
        var gameTableRowLabel = createAndAddDiv("gameTableRowLabel_"+row,"gameDiv");
        gameTableRowLabel.className="gameTableItem gameTableRowLabel active";
        gameTableRowLabel.innerHTML=window.rowActions[row];
        gameTableRowLabel.style.left="25px";
        gameTableRowLabel.style.top=120+200*(row-1)+5+"px";
        gameTableRowLabel.style.color=window.rowColors[row];
    }


    if(thisStatus['rowSelected']=="No"){
        for(var row in window.rowActions){
            clickButton("once","gameTableRowLabel_"+row,makeSelection,"row",row);
        }
    }
    else{
        summaryMyChoiceEntry=document.getElementById("summaryMyChoiceEntry");
        summaryMyChoiceEntry.innerHTML=window.rowActions[thisStatus['rowSelected']];
        summaryMyChoiceEntry.style.color=window.rowColors[thisStatus['rowSelected']];
        selectedRow=createAndAddDiv("selectedRowDiv","gameDiv");
        selectedRow.style.color=window.rowColors[thisStatus['rowSelected']];
        selectedRow.style.borderColor=window.rowColors[thisStatus['rowSelected']];

        selectedRowLabel=createAndAddDiv("selectedRowLabel",'selectedRowDiv');
        selectedRowLabel.innerHTML="My Choice";

        window.numberOfCols=Object.keys(window.colActions).length;
        selectedRow.style.top=-55-100*window.numberOfCols+200*thisStatus['rowSelected']+"px";
        selectedRow.style.left=window.numberOfCols*100+"px";

        selectedRow.style.height=(200*window.numberOfCols+150)+"px";
        selectedRowLabel.style.top=(200*window.numberOfCols+100)+"px";

        document.getElementById("historyEntry_"+window.currentPeriod+"_1").innerHTML=window.rowActions[thisStatus['rowSelected']];
        document.getElementById("historyEntry_"+window.currentPeriod+"_1").style.color=window.rowColors[thisStatus['rowSelected']];
        for(row=1;row<=window.numberOfRows;row++){
            document.getElementById("gameTableRowLabel_"+row).className="gameTableItem gameTableRowLabel";
        }
    }

    gameDiv.style.top=((3-window.numberOfRows)*50+25)+"px";
    gameDiv.style.left=((3-window.numberOfCols)*50+175)+"px";

    for(var row in window.rowActions){
        for(var col in window.colActions){

            var testEntry = createAndAddDiv("gameTableEntry_"+row+"_"+col,"gameDiv");
            testEntry.className="gameTableItem gameTableEntry";
            testEntry.style.left=120+200*(col-1)+5+"px";
            testEntry.style.top=120+200*(row-1)+5+"px";

            var testEntryPay1 = createAndAddDiv("gameTableEntryPay1_"+row+"_"+col,"gameTableEntry_"+row+"_"+col);
            testEntryPay1.className="gameTableEntryPay1";
            testEntryPay1.innerHTML=pays[row][col][0];
            testEntryPay1.style.color=window.rowColors[row];

            var testEntryPay2 = createAndAddDiv("gameTableEntryPay2_"+row+"_"+col,"gameTableEntry_"+row+"_"+col);
            testEntryPay2.className="gameTableEntryPay2";
            testEntryPay2.innerHTML=pays[row][col][1];
            testEntryPay2.style.color=window.colColors[col];
       }
    }
}



function drawHistory(){
    //Create Game div
    historyDiv=createAndAddDiv("historyDiv","mainDiv");
    historyDivIn=createAndAddDiv("historyDivIn","historyDiv");
    historyLabels=createAndAddDiv("historyLabels","mainDiv");
    
    historyLabelPeriod=createAndAddDiv("historyLabelPeriod","historyLabels");
    historyLabelPeriod.className="historyLabel";
    historyLabelPeriod.style.top="10px";
    historyLabelPeriod.innerHTML="Period";

    historyLabelMyChoice=createAndAddDiv("historyLabelMyChoice","historyLabels");
    historyLabelMyChoice.className="historyLabel";
    historyLabelMyChoice.style.top="70px";
    historyLabelMyChoice.innerHTML="My Choice";

    historyLabelOthersChoice=createAndAddDiv("historyLabelOthersChoice","historyLabels");
    historyLabelOthersChoice.className="historyLabel";
    historyLabelOthersChoice.style.top="130px";
    historyLabelOthersChoice.innerHTML="Other's Choice";

    historyLabelMyPayoff=createAndAddDiv("historyLabelMyPayoff","historyLabels");
    historyLabelMyPayoff.className="historyLabel";
    historyLabelMyPayoff.style.top="190px";
    historyLabelMyPayoff.innerHTML="My Payoff";

    historyLabelOthersPayoff=createAndAddDiv("historyLabelOthersPayoff","historyLabels");
    historyLabelOthersPayoff.className="historyLabel";
    historyLabelOthersPayoff.style.top="250px";
    historyLabelOthersPayoff.innerHTML="Other's Payoff";

    for(period=window.currentPeriod;period>0;period--){
        for(row=0;row<5;row++){
            historyEntry=createAndAddDiv("historyEntry_"+period+"_"+row,"historyDivIn");
            historyEntry.className="historyEntry";
            historyEntry.style.top=10+row*60+"px";
            historyEntry.style.left=-100+(period)*75+"px";
            if(row==0){historyEntry.innerHTML=period;}
            else if(period>window.currentPeriod-1){historyEntry.innerHTML="?";}
            else if(row==1){
                thisChoice=window.historyOfPlay[period-1][0];
                historyEntry.innerHTML=window.rowActions[thisChoice];
                historyEntry.style.color=window.rowColors[thisChoice]
            }
            else if(row==2){
                thisChoice=window.historyOfPlay[period-1][1];
                historyEntry.innerHTML=window.colActions[thisChoice];
                historyEntry.style.color=window.colColors[thisChoice]
            }

            else if(row==3){
                myChoice=window.historyOfPlay[period-1][0];
                theirChoice=window.historyOfPlay[period-1][1];
                myPay=pays[myChoice][theirChoice][0];
                historyEntry.innerHTML=myPay;
                historyEntry.style.color=window.rowColors[myChoice]
            }
            else if(row==4){
                myChoice=window.historyOfPlay[period-1][0];
                theirChoice=window.historyOfPlay[period-1][1];
                theirPay=pays[myChoice][theirChoice][1];
                historyEntry.innerHTML=theirPay;
                historyEntry.style.color=window.colColors[theirChoice]
            }
        }
    }
    historyDivIn.style.width=75*(window.currentPeriod+3)+"px";
    $("#mainDiv").append(historyDiv);
    $("#mainDiv").append(historyLabels);
}

function drawPeriodSummary(){
    //Create Game div

    matchNumberTitle=createAndAddDiv("matchNumberTitle","mainDiv");
    matchNumberTitle.innerHTML="Match #"+(window.currentMatch+1)+" out of 5";

    questionsDiv=createAndAddDiv("questionsDiv","mainDiv");

    periodSummaryLabel=createAndAddDiv("periodSummaryLabel","questionsDiv");
    periodSummaryLabel.innerHTML="Period "+window.currentPeriod+" Summary:";
    
    summaryLabel=createAndAddDiv("summaryLabel","questionsDiv");
    summaryLabel.innerHTML="Overall Summary:";

    totalPayoffMineLabel=createAndAddDiv("totalPayoffMineLabel","questionsDiv");
    totalPayoffMineLabel.innerHTML="My Match Payoff:";

    totalPayoffMine=createAndAddDiv("totalPayoffMine","questionsDiv");
    totalPayoffMine.innerHTML=window.myMatchPay;

    totalPayoffOthersLabel=createAndAddDiv("totalPayoffOthersLabel","questionsDiv");
    totalPayoffOthersLabel.innerHTML="Other's Match Payoff:";

    totalPayoffOthers=createAndAddDiv("totalPayoffOthers","questionsDiv");
    totalPayoffOthers.innerHTML=window.theirMatchPay;

    correctGuessesLabel=createAndAddDiv("correctGuessesLabel","questionsDiv");
    correctGuessesLabel.innerHTML="Correct Guesses:";

    correctGuessesDiv=createAndAddDiv("correctGuesses","questionsDiv");
    correctGuessesDiv.innerHTML=window.correctGuesses;

    totalPayoffLabel=createAndAddDiv("totalPayoffLabel","questionsDiv");
    totalPayoffLabel.innerHTML="My Total Payoff:";

    totalPayoff=createAndAddDiv("totalPayoff","questionsDiv");
    totalPayoff.innerHTML=window.myTotalPay;

    summaryMyChoice=createAndAddDiv("summaryMyChoice","questionsDiv");
    summaryMyChoice.className="summaryEntry";
    summaryMyChoice.style.left="50px";

    summaryMyChoiceLabel=createAndAddDiv("summaryMyChoiceLabel","summaryMyChoice");
    summaryMyChoiceLabel.innerHTML="My Choice:";
    summaryMyChoiceLabel.className="summaryEntryLabel";

    summaryMyChoiceEntry=createAndAddDiv("summaryMyChoiceEntry","summaryMyChoice");
    summaryMyChoiceEntry.innerHTML="?";
    summaryMyChoiceEntry.style.lineHeight="100px";
    summaryMyChoiceEntry.style.height="100px";
    summaryMyChoiceEntry.className="summaryEntryEntry";

    summaryOtherChoice=createAndAddDiv("summaryOtherChoice","questionsDiv");
    summaryOtherChoice.className="summaryEntry";
    summaryOtherChoice.style.left="275px";

    summaryOthersChoiceLabel=createAndAddDiv("summaryOthersChoiceLabel","summaryOtherChoice");
    summaryOthersChoiceLabel.innerHTML="Other's Choice:";
    summaryOthersChoiceLabel.className="summaryEntryLabel";

    summaryOthersChoiceEntryGuess=createAndAddDiv("summaryOthersChoiceEntryGuess","summaryOtherChoice");
    summaryOthersChoiceEntryGuess.innerHTML="? (guess)";
    summaryOthersChoiceEntryGuess.className="summaryEntryEntry";

    summaryOthersChoiceEntryActual=createAndAddDiv("summaryOthersChoiceEntryActual","summaryOtherChoice");
    summaryOthersChoiceEntryActual.style.top="100px";
    summaryOthersChoiceEntryActual.innerHTML="? (actual)";
    summaryOthersChoiceEntryActual.className="summaryEntryEntry";



    summaryPayoffs=createAndAddDiv("summaryPayoffs","questionsDiv");
    summaryPayoffs.className="summaryEntry";
    summaryPayoffs.style.left="500px";

    summaryPayoffsLabel=createAndAddDiv("summaryPayoffsLabel","summaryPayoffs");
    summaryPayoffsLabel.innerHTML="Payoffs:";
    summaryPayoffsLabel.className="summaryEntryLabel";

    summaryPayoffsEntryMine=createAndAddDiv("summaryPayoffsEntryMine","summaryPayoffs");
    summaryPayoffsEntryMine.innerHTML="? (mine)";
    summaryPayoffsEntryMine.className="summaryEntryEntry";

    summaryPayoffsEntryOthers=createAndAddDiv("summaryPayoffsEntryOthers","summaryPayoffs");
    summaryPayoffsEntryOthers.style.top="100px";
    summaryPayoffsEntryOthers.innerHTML="? (other's)";
    summaryPayoffsEntryOthers.className="summaryEntryEntry";

}


// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // //  Actions // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

function makeSelection(args){
    var rowOrColumn=args[0];
    var value=args[1];
    var message={"type":"makeChoice","selectionType":rowOrColumn,"value":value};
    sendMessage(message);
}



// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // //  Messages // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

function updateStatus(msg){
    statusManager();
}

function finishPeriod(send){
    var othersChoice=window.state['othersChoice'];
    var myGuess=window.state['colSelected'];
    var myChoice=window.state['rowSelected'];

    if(othersChoice==myGuess){
        deleteDiv("selectedColumnDiv");
        deleteDiv("selectedColumnLabel");
        selectedColumn=createAndAddDiv("selectedColumnDivBoth","gameDiv");
        selectedColumn.style.color="rgba(255,255,0,1)";
        selectedColumn.style.borderColor="yellow";
    }
    else{
        selectedColumn=createAndAddDiv("selectedColumnDiv2","gameDiv");
        selectedColumn.style.color=window.colColors[othersChoice];
        selectedColumn.style.borderColor=window.colColors[othersChoice];
    }

    selectedColumn.className="selectedColumnDiv";
    selectedColumn.style.left=-80+200*othersChoice+"px";

    selectedColumnLabel=createDiv("selectedColumnLabel2");
    selectedColumnLabel.className="selectedColumnLabel";
    selectedColumnLabel.innerHTML="Other's Choice";
    selectedColumn.appendChild(selectedColumnLabel);

    selectedColumn.style.height=(200*window.numberOfRows+150)+"px";
    selectedColumnLabel.style.top=(200*window.numberOfRows+100)+"px";

    summaryOthersChoiceEntryGuess=document.getElementById("summaryOthersChoiceEntryActual");
    summaryOthersChoiceEntryGuess.innerHTML=window.colActions[othersChoice] +" (actual)";
    summaryOthersChoiceEntryGuess.style.color=window.colColors[othersChoice];

    document.getElementById("summaryPayoffsEntryMine").innerHTML=window.pays[myChoice][othersChoice][0]+" (mine)";
    document.getElementById("summaryPayoffsEntryMine").style.color=window.rowColors[myChoice];
    document.getElementById("summaryPayoffsEntryOthers").innerHTML=window.pays[myChoice][othersChoice][1]+" (other's)";
    document.getElementById("summaryPayoffsEntryOthers").style.color=window.colColors[othersChoice];

    document.getElementById("historyEntry_"+window.currentPeriod+"_2").innerHTML=window.colActions[othersChoice];
    document.getElementById("historyEntry_"+window.currentPeriod+"_3").innerHTML=window.pays[myChoice][othersChoice][0];
    document.getElementById("historyEntry_"+window.currentPeriod+"_4").innerHTML=window.pays[myChoice][othersChoice][1];
    document.getElementById("historyEntry_"+window.currentPeriod+"_2").style.color=window.colColors[othersChoice];
    document.getElementById("historyEntry_"+window.currentPeriod+"_3").style.color=window.rowColors[myChoice];
    document.getElementById("historyEntry_"+window.currentPeriod+"_4").style.color=window.colColors[othersChoice];

    document.getElementById("gameTableEntry_"+myChoice+"_"+othersChoice).className="gameTableItem gameTableEntry active";
    document.getElementById("gameTableEntry_"+myChoice+"_"+othersChoice).style.backgroundColor="rgba(220,255,220,1)";

    if(send==1){
        clickButton("once","gameTableEntry_"+myChoice+"_"+othersChoice,runServerFunction,"nextPeriod");
        document.getElementById("statusBar").innerHTML="Click on the payoffs for this period (in green) in the game table to move to next period.";
    }
    if(send==2){
        clickButton("once","statusBar",runServerFunction,"confirmMatchOver");
        document.getElementById("statusBar").innerHTML="Match Over! Click here to continue.";
        document.getElementById("statusBar").className="highlightStatus";
    }
    if(send==3){
        document.getElementById("statusBar").innerHTML="Match Over! Please wait for the other subjects to finish.";
    }
    if(send==4){
        document.getElementById("statusBar").innerHTML="Click on the payoffs for this period (in green) in the game table to move to next period.";
    }

    document.getElementById("gameTableEntry_"+myChoice+"_"+othersChoice).style.zIndex="5";
    //drawHistory();
}

window.historyOfPlay=[]
window.currentPeriod=0;
window.correctGuesses=14;


function runServerFunction(args){
    var message={"type":args[0]};
    sendMessage(message);
}

function confirmAction(m){
  var confirmed = confirm(m);
  return confirmed;
}



function statusManager(){
  console.log(window.state);
  thisStatus=window.state;
  window.currentPeriod=thisStatus['period']+1;
  window.currentMatch=thisStatus['match'];
  window.correctGuesses=thisStatus['correctGuesses'];
  window.historyOfPlay=thisStatus['history'];
  window.myMatchPay=thisStatus['myMatchPay'];
  window.theirMatchPay=thisStatus['theirMatchPay'];
  window.myTotalPay=thisStatus['myTotalPay'];

  if(thisStatus[0]==-1){
    message="Loading...";
    genericScreen(message);
  }
  else if(thisStatus["page"]=="generic"){
    genericScreen(thisStatus["message"]);
  }
  else if(thisStatus["page"]=="getName"){
    getNames(thisStatus["html"]);
  }
  else if(thisStatus["page"]=="quiz"){//quiz
    //drawQuizMessage();
  }
  else if(thisStatus["page"]=="game"){//quiz
    clearAllInstructions();
    drawPeriodSummary();
    drawHistory();
    drawGame();
    drawStatus();
    if(thisStatus["stage"]=="bothSelected"){
        document.getElementById("statusBar").innerHTML="Please wait for the other subject to finish making their choices.";
    }
    else if(thisStatus["stage"]=="periodSummary"){
        finishPeriod(1);
    }
    else if(thisStatus["stage"]=="matchOver"){
        finishPeriod(2);
    }
    else if(thisStatus["stage"]=="matchOverConfirmed"){
        finishPeriod(3);
    }
  }
    else if(thisStatus["page"]=="experimentSummary"){
        finishPeriod(0);
        document.getElementById("statusBar").innerHTML=thisStatus["summary"];
    }

    else if(thisStatus["page"]=="questionnaire"){
        runServerFunction("startQuestionnaire");
        pay=thisStatus["payment"];
        sid=thisStatus["subjectID"];
//        showQuestionnaire(sid,pay);
    }

}




