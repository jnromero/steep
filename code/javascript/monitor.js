
function goToPageNewTab(args){
  window.open(args[0],"_blank");
}


function drawPageTabs(currentPage){
  // placeText({"text":"Server Links","divid":"server2Button","top":"0px","left":"0px","width":"100px","height":"25px","fontSize":"100%","color":"black"});
  var consoleLeft="400px";
  var monitorLeft="200px";
  var serverLeft="0px";


  placeText({"parentDiv":"monitorHeaderRight","zIndex":"11","text":"Server Info","divid":"serverInfoButton","top":"0px","left":serverLeft,"width":"200px","height":"75px","fontSize":"20px","border":"0px solid rgba(0,0,0,.1)","color":"white"});
  placeText({"parentDiv":"monitorHeaderRight","zIndex":"11","text":"Monitor","divid":"monitorButton","top":"0px","left":monitorLeft,"width":"200px","height":"75px","fontSize":"20px","border":"0px solid rgba(0,0,0,.1)","color":"white"});
  placeText({"parentDiv":"monitorHeaderRight","zIndex":"11","text":"Console","divid":"consoleButton","top":"0px","left":consoleLeft,"width":"200px","height":"75px","fontSize":"20px","border":"0px solid rgba(0,0,0,.1)","color":"white"});

  clickButton("many","serverInfoButton",changeMonitorPage,"serverInfo");
  clickButton("many","monitorButton",changeMonitorPage,"monitor");
  clickButton("many","consoleButton",changeMonitorPage,"console");

  document.getElementById(currentPage+"Button").style.backgroundColor='rgba(255,255,255,.5)';
  var hoverInfo={"backgroundColor":"white","color":"navy"};
  hoverDiv("serverInfoButton",hoverInfo)
  hoverDiv("monitorButton",hoverInfo)
  hoverDivChangeOtherDiv("consoleButton","consoleButton",hoverInfo)
}




function drawMonitorHeader(){
    deleteDiv("monitorHeader");
    var thisDiv = document.createElement("div");
    thisDiv.id="monitorHeader";
    document.body.prepend(thisDiv);

    deleteDiv("monitorHeaderRight");
    var thisDiv = document.createElement("div");
    thisDiv.id="monitorHeaderRight";
    document.body.prepend(thisDiv);

  placeText({"parentDiv":"monitorHeader","text":"STEEP","divid":"steepTitle","top":"0px","left":"calc(50% - 800px)","width":"800px","height":"75px","fontSize":"30px","border":"0px solid rgba(0,0,0,.1)","color":"white"});  
}
function drawMainDivInside(){
  document.getElementById("mainDiv").style.height="100%";
  document.getElementById("mainDiv").style.backgroundColor="white";
  placeText({"divid":"mainDivInside","top":"100px","left":"0px","width":"1600px","height":"calc(100% - 100px)"});
  document.getElementById("mainDivInside").style.overflowY = "scroll";
}



function changeMonitorPage(args){
  sock.send(JSON.stringify({"type":"changeMonitorPage","page":args[0]}));
}


function goToPointInInstructions(args){
  var e=args[args.length-1];
  var pos=clickEvent(e);
  var pct=pos[0]/document.getElementById("monitorTableCaptionsRowEntry").offsetWidth;
  var msg={"type":"changeInstructionsTimeFromMonitor","percentage":pct}
  var statement="Are you sure change the instructions time?";
  sock.send(JSON.stringify(msg));

  // confirmAction(statement,msg);
  
}

function makeMonitorTable(msg){
  var subjectIDs=msg['table']['subjectIDs'];
  var titles=msg['table']['titles'];
  var connected=msg['table']['connected'];

  //Redraw whole table to make sure rows don't stay after subject is deleted.  
  if(document.getElementById("monitorTable")!=null && document.getElementById("monitorTable").childElementCount!=msg['table']['subjectIDs'].length){
    deleteDiv("monitorTableHolder");
  }
  if(isDivNotThere("monitorTableHolder")){
    placeText({"parentDiv":"mainDivInside","divid":"monitorTableHolder","width":"1300px","height":"100%","top":"0px","left":"0px"});
    var table=createAndAddElement("table","monitorTable","monitorTableHolder");
  }


  if(window.serverStatus['page']=="instructions"){
    var captionRow=createAndAddElement("tr","monitorTableCaptionsRow","monitorTable");
    var captionEntry=createAndAddElement("td","monitorTableCaptionsRowEntry","monitorTableCaptionsRow");
    captionEntry.colSpan=titles.length+1;
    captionEntry.innerHTML=window.serverStatus['instructions']['lastCaption'];

    var instructionsStatusBar=createAndAddDiv("instructionsStatusBar","monitorTableCaptionsRowEntry");
    instructionsStatusBar.style.width=serverStatus['instructions']['time']*document.getElementById("monitorTableCaptionsRowEntry").offsetWidth;
      clickButton("many","monitorTableCaptionsRowEntry",goToPointInInstructions);

  }
  else{
    deleteDiv("instructionsStatusBar");
  }


  if(isDivNotThere("monitorTableHeaderRow")){
    var thisRow=createAndAddElement("tr","monitorTableHeaderRow","monitorTable");
  }

  if(isDivNotThere("monitorTableHeader_"+0)){
    var thisHeader=createAndAddElement("th","monitorTableHeader_"+0,"monitorTableHeaderRow");
    thisHeader.innerHTML="#";
  }

  for(k=0;k<titles.length;k++){
    if(isDivNotThere("monitorTableHeader_"+(k+1))){
      var thisHeader=createAndAddElement("th","monitorTableHeader_"+(k+1),"monitorTableHeaderRow");
    }
    if(document.getElementById("monitorTableHeader_"+(k+1)).innerHTML!=titles[k]){
      document.getElementById("monitorTableHeader_"+(k+1)).innerHTML=titles[k];
      clickButton("many","monitorTableHeader_"+(k+1),sortMonitorTable,k);
    }
  }

  for(var s=0;s<subjectIDs.length;s++){
    var thisRow=createAndAddElement("tr","monitorTableRow_"+s,"monitorTable");
    if(connected[subjectIDs[s]]=="disconnected"){
      console.log("@#$@#$",s);
      thisRow.style.backgroundColor="rgba(255,0,0,.2)";
    }
    var thisEntry=createAndAddElement("td","monitorTableEntry_"+s+"-0","monitorTableRow_"+s);
    thisEntry.innerHTML=s+1;
    for(var k=0;k<titles.length;k++){
      var thisEntry=createAndAddElement("td","monitorTableEntry_"+s+"-"+(k+1),"monitorTableRow_"+s);
      thisEntry.innerHTML=msg['table'][subjectIDs[s]][titles[k]];
    }
  }
}





function sortMonitorTable(args){
  col=args[0];
  msg={'type':"sortMonitorTableMessage",'col':col};
  sock.send(JSON.stringify(msg));
}

function changeMonitorTable(args){
  newTable=args[0];
  msg={'type':"changeMonitorTable",'table':newTable};
  sock.send(JSON.stringify(msg));
}



function stopPythonServer(){
  var statement="Are you sure you want to stop the python server??  Only do this if you are done with the experiment or you have an error.  You might be able to restart, but only maybe.";
  var msg={'type':"stopPythonServer"};
  confirmAction(statement,msg);
}


function restartPythonServer(){
  var statement="Are you sure you want to restart the python server??  Only do this if you are done with the experiment or you have an error.  You might be able to restart, but only maybe.";
  var msg={'type':"restartPythonServer"};
  confirmAction(statement,msg);
}

function makeTaskTable(msg){
  placeText({"parentDiv":"mainDivInside","divid":"taskTableHolder","width":"300px","height":"100%","top":"0px","right":"0px"});
  drawAcceptingSwitch();
  for(row=0;row<msg['taskList'].length;row++){
    var thisTask=msg['taskList'][row];
    var taskTitle=msg['taskStatus'][thisTask]['title'];
    var taskStatus=msg['taskStatus'][thisTask]['status'];
    var taskType=msg['taskStatus'][thisTask]['type'];
    if(taskTitle=="Load Instructions"){
      drawInstructionsController();
    }
    else{
      drawGenericTask(row,thisTask,taskTitle,taskStatus,taskType);
    }
  }

  drawDataFileButton(msg);
  drawStopServerButton(msg);
  drawRestartServerButton(msg);
  drawRefreshAllButton(msg);

}


function drawGenericTask(row,thisTask,taskTitle,taskStatus,taskType){

  var divName="taskDiv_"+thisTask;
  var thisDiv=createAndAddDiv(divName,"taskTableHolder");
  thisDiv.className="taskButton";
  thisDiv.style.top=(60+60*row)+"px";
  thisDiv.innerHTML=taskTitle;
  if(taskStatus=="Done"){
      thisDiv.style.backgroundColor="var(--w3-green)";
  }
  else if(taskType=="textInput"){
      thisDiv.style.backgroundColor="var(--w3-red)";
      clickButton("many",divName,sendTextToServer,thisTask,taskTitle);    
  }
  else{
      thisDiv.style.backgroundColor="var(--w3-red)";
      clickButton("many",divName,sendToServer,thisTask,taskTitle);
  }
}


function drawDataFileButton(msg){
  var dataFileButton=createAndAddDiv("dataFileButton","taskTableHolder");
  dataFileButton.className="taskButton alwaysThere";
  dataFileButton.innerHTML="Download Data Folder (.zip)";
  dataFileButton.style.top=(100+60*msg['taskList'].length)+"px";
  dataFileButton.href=msg['dataFolderURL'];
  clickButton("many","dataFileButton",downloadDataFile,msg['dataFolderURL']);
}

function downloadDataFile(args){
  window.location.href=args[0];
}



function drawStopServerButton(msg){
  var stopPythonServerButton=createAndAddDiv("stopPythonServerButton","taskTableHolder");
  stopPythonServerButton.className="taskButton alwaysThere";
  stopPythonServerButton.innerHTML="Stop Python Server";
  stopPythonServerButton.style.top=(220+60*msg['taskList'].length)+"px";
  clickButton("once","stopPythonServerButton",stopPythonServer);

}


function drawRestartServerButton(msg){
  var stopPythonServerButton=createAndAddDiv("restartPythonServerButton","taskTableHolder");
  stopPythonServerButton.className="taskButton alwaysThere";
  stopPythonServerButton.innerHTML="Restart Python Server";
  stopPythonServerButton.style.top=(280+60*msg['taskList'].length)+"px";
  clickButton("once","restartPythonServerButton",restartPythonServer);

}

function drawRefreshAllButton(msg){
  var refreshAllButton=createAndAddDiv("refreshAllButton","taskTableHolder");
  refreshAllButton.className="taskButton alwaysThere";
  refreshAllButton.innerHTML="Refresh All Clients";
  refreshAllButton.style.top=(160+60*msg['taskList'].length)+"px";
  clickButton("once","refreshAllButton",refreshClient,"all");
    // var thisRow = document.createElement("tr");
  // var cell = document.createElement("td");
  // cell.colSpan="3";
  // cell.align="center";
  // cell.innerHTML="<a href='javascript:void(0)' onclick='refreshClient(\"all\");'>Refresh All</a>";
  // thisRow.appendChild(cell);
  // table.appendChild(thisRow);

}

function toggleAcceptingSwitch(){
  msg={'type':"toggleAcceptingSwitch"};
  sock.send(JSON.stringify(msg));
}

function drawAcceptingSwitch(){
  var acceptingButton=createAndAddDiv("acceptingButton","taskTableHolder");
  acceptingButton.className="taskButton";
  clickButton("once","acceptingButton",toggleAcceptingSwitch);
  if(window.serverStatus['acceptingClients']==0){
    acceptingButton.innerHTML="Not Accepting Clients"
    acceptingButton.style.backgroundColor="var(--w3-green)";
  }
  else if(window.serverStatus['acceptingClients']==1){
    acceptingButton.innerHTML="Accepting Clients"
    acceptingButton.style.backgroundColor="var(--w3-red)";
  }
}

function loadInstructions(){
  msg={'type':"loadInstructions"};
  sock.send(JSON.stringify(msg));
}

function resumeInstructions(){
  msg={'type':"resumeInstructions"};
  sock.send(JSON.stringify(msg));
}

function restartInstructions(){
  msg={'type':"restartInstructions"};
  sock.send(JSON.stringify(msg));
}
function stopInstructions(){
  msg={'type':"stopInstructions"};
  sock.send(JSON.stringify(msg));
}


function monitorEndInstructions(){
  msg={'type':"endInstructionsMessage"};
  sock.send(JSON.stringify(msg));
}

// function moveInstrutionsMonitorTimer(){
//   var timerSeconds=serverStatus['instructions']['time']+((new Date()).getTime()-window.lastTimeCheck)/1000;
//   document.getElementById('instructionsTime').innerHTML=makeTimePretty(timerSeconds);
//   if(serverStatus['instructions']['playing']==1){
//     setTimeout(moveInstrutionsMonitorTimer,100);
//   }
// }

function drawInstructionsController(){
  var loadInstructionsButton=createAndAddDiv("loadInstructionsButton","taskTableHolder");
  loadInstructionsButton.className="taskButton";
  if(window.serverStatus['instructions']['loaded']==0 && window.serverStatus['instructions']['finished']==0){
    loadInstructionsButton.innerHTML="Load Instructions";
    clickButton("once","loadInstructionsButton",loadInstructions);
    loadInstructionsButton.style.backgroundColor="var(--w3-red)";
  }
  else if(window.serverStatus['instructions']['loaded']==0 && window.serverStatus['instructions']['finished']==1){
    loadInstructionsButton.innerHTML="Finished (Click to load again)";
    clickButton("once","loadInstructionsButton",loadInstructions);
    loadInstructionsButton.style.backgroundColor="var(--w3-green)";
  }
  else if(window.serverStatus['instructions']['loaded']==1){
    if(window.serverStatus['instructions']['playing']==1){
      var instructionsPlayButton=createAndAddDiv("instructionsPlayButton","loadInstructionsButton");
      instructionsPlayButton.innerHTML="Pause";
      instructionsPlayButton.className="instructionsControlButton";
      clickButton("once","instructionsPlayButton",stopInstructions);
    }
    else if(window.serverStatus['instructions']['playing']==0){
      var instructionsPlayButton=createAndAddDiv("instructionsPlayButton","loadInstructionsButton");
      instructionsPlayButton.innerHTML="Play";
      instructionsPlayButton.className="instructionsControlButton";
      clickButton("once","instructionsPlayButton",resumeInstructions);
    }


    var instructionsRestartButton=createAndAddDiv("instructionsRestartButton","loadInstructionsButton");
    instructionsRestartButton.innerHTML="Restart";
    instructionsRestartButton.className="instructionsControlButton";
    clickButton("many","instructionsRestartButton",restartInstructions);

    var instructionsEndButton=createAndAddDiv("instructionsEndButton","loadInstructionsButton");
    instructionsEndButton.innerHTML="End";
    instructionsEndButton.className="instructionsControlButton";
    clickButton("many","instructionsEndButton",monitorEndInstructions);

  }
}

function sendTextToServer(args){
  var thisTask=args[0];
  var taskTitle=args[1];
  var statement="Are you sure you want to "+taskTitle+"??";
  var message={"type":thisTask};
  confirmActionText(statement,message);
}


function sendToServer(args){
  var thisTask=args[0];
  var taskTitle=args[1];
  var statement="Are you sure you want to "+taskTitle+"??";
  var message={"type":thisTask};
  confirmAction(statement,message);
}

function refreshClient(args){
  var sid=args[0];
  msg={}
  msg['type']="refreshMyPage";
  msg['subjectIDIncoming']=sid;
  var statement="Are you sure you want to refresh "+sid+"??";
  confirmAction(statement,msg);
}

function deleteClient(args){
  var sid=args[0];
  msg={}
  msg['type']="deleteThisClient";
  msg['subjectIDIncoming']=sid;
  var statement="Are you sure you want to delete subject "+sid+"??";
  confirmAction(statement,msg);
}

function chooseVolunteer(args){
  var sid=args[0];
  msg={}
  msg['type']="chooseVolunteer";
  msg['subjectIDIncoming']=sid;
  sock.send(JSON.stringify(msg));
}




function startIt(type){
  msg={"type":type};
  sock.send(JSON.stringify(msg));
}


function getAutomatic(){
  $.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if(results==null){return null;}
    else{return results[1] || 0;}
  }
  for(var k=0;k<5;k++){
    var timeDelay=300*(k+1);
    var username=$.urlParam('automatic'+k);
    if(username!=undefined){
      console.log("running",username);
      if(username=="stopAccepting"){
        setTimeout(toggleAcceptingSwitch,timeDelay);        
      }   
      else if(username=="loadInstructions"){
        setTimeout(loadInstructions,timeDelay);        
      }   
      else if(username=="resumeInstructions"){
        setTimeout(resumeInstructions,timeDelay);        
      }   
      else{
        console.log(username,"!!!!!!");
        var pf = partial(startIt,username);
        setTimeout(pf,timeDelay);        
      }
    }
  }
}



function drawMonitorPageLinks(){
  placeText({"zIndex":"6","color":"white","fontSize":"20px","lineHeight":"75px","text":"Other Monitor Pages - Current Page: "+camelCaseToRegular(window.currentMonitorTable),"divid":"otherMonitorPagesHolder","top":"-250px","left":"775px","width":"650px","height":(100+75*Math.floor(1+(window.monitorTables.length-1)/3))+"px","fontSize":"20px","backgroundColor":"var(--w3-purple)","transition":"all .25s ease"});
  for(var k=0;k<window.monitorTables.length;k++){
    if(window.currentMonitorTable==window.monitorTables[k]){
      var backgroundColor="var(--w3-lightblue2)";
    }
    else{
      var backgroundColor="var(--w3-lightblue)";
    }
    var y=Math.floor(1+k/3)*75
    var x=25+(k%3)*200;
    placeText({"parentDiv":"otherMonitorPagesHolder","text":camelCaseToRegular(window.monitorTables[k]),"divid":"otherMonitorPage"+k,"top":y+"px","left":x+"px","width":"200px","height":"75px","fontSize":"20px","color":'white',"backgroundColor":backgroundColor});
    clickButton("many","otherMonitorPage"+k,changeMonitorTable,window.monitorTables[k]);
    var hoverInfo={"backgroundColor":"white","color":"navy"};
    hoverDivChangeOtherDiv("otherMonitorPage"+k,"otherMonitorPage"+k,hoverInfo);
  }

  if(window.currentMonitorTable!=undefined){
    placeText({"parentDiv":"monitorHeaderRight","zIndex":"11","divid":"currentMonitorPage","text":camelCaseToRegular(window.currentMonitorTable),"fontSize":"100%","color":"white","top":"50px","left":"200px","width":"200px","height":"25px",});
    hoverDivChangeOtherDiv("currentMonitorPage","otherMonitorPagesHolder",{"top":"70px","left":"775px"});
    clickButton("many","currentMonitorPage",changeMonitorPage,"monitor");
  }
  hoverDivChangeOtherDiv("monitorButton","otherMonitorPagesHolder",{"top":"70px","left":"775px"});
  hoverDivChangeOtherDiv("otherMonitorPagesHolder","otherMonitorPagesHolder",{"top":"70px","left":"775px"});
}


getAutomatic();

drawMonitorHeader();
drawMainDivInside();

function getMonitorTablesInfo(msg){
  window.monitorTables=msg['monitorTables'];
  window.currentMonitorTable=msg['currentMonitorTable']
  window.serverStatus=msg['serverStatus'];
  window.consoleTabsInfo=msg['consoleTabs'];
}

function updateMonitorHeader(msg){
  clearAll();
  drawMonitorHeader();
  drawMainDivInside();
  getMonitorTablesInfo(msg);
  drawPageTabs(msg['currentPage']);
  drawConsoleTabs();
  drawMonitorPageLinks();
}

function updateMonitorTable(msg){
  deleteDiv("serverInfoContainer");
  deleteDiv("configInfoContainer");
  deleteDiv("mainInfoHolder");
  deleteDiv("consoleLinesHolder");
  getMonitorTablesInfo(msg);
  window.lastTimeCheck=(new Date()).getTime();
  makeMonitorTable(msg);
}

function updateTaskTable(msg){
  deleteDiv("consoleLinesHolder")
  window.serverStatus=msg['serverStatus'];
  makeTaskTable(msg);
}


function getColor(outputType){
  if(outputType=="stderr"){
    background="rgba(255,0,0,.1)";
    text="rgba(255,0,0,1)";
  }
  else if(outputType=="stdout"){
    background="rgba(0,255,0,.05)";
    text="rgba(0,150,0,1)";
  }
  else if(outputType=="twisted"){
    background="rgba(0,0,255,.1)";
    text="rgba(0,150,0,1)";
  }
  else if(outputType=="twistedError"){
    background="rgba(0,0,255,.1)";
    text="rgba(200,0,0,1)";
  }
  else{
    background="rgba(255,255,255,.1)";
    text="rgba(255,0,0,1)";

  }
  return [background,text]
}

function drawConsoleLines(){
  var currentY=0;
  var lineHeight=0;
  placeText({"parentDiv":"mainDivInside","divid":"consoleLinesHolder","width":"100%","height":"100%","top":"0px","left":"0px",});
  for(var k=0;k<window.consoleLines.length;k++){

    //getLine height
    if(window.consoleLines[k][3]['sameLine']!="True"){
      currentY+=lineHeight;
    }

    if(window.consoleLines[k][3]['height']!=undefined){
      var lineHeight=parseInt(window.consoleLines[k][3]['height'].substring(0,window.consoleLines[k][3]['height'].length-2));
    }
    else{
      var lineHeight=25;
    }




    if(window.consoleLines[k][3]['sameLine']!="True"){
      //draw background
      var thisFormat={
        "parentDiv":"consoleLinesHolder",
        "divid":"lineBackground"+k,
        "text":"",
        "top":currentY+"px",
        "left":"0px",
        "textAlign":"left",
        "height":"25px",
        "fontSize":"125%",
        "backgroundColor":getColor(window.consoleLines[k][0])[0],
        "paddingLeft":"10px",
      }
      for(j in window.consoleLines[k][3]){
        thisFormat[j]=window.consoleLines[k][3][j];
        // thisFormat["backgroundColor"]="rgba(255,0,0,.1)";
        thisFormat["width"]="100%";
        thisFormat["left"]="0px";
        thisFormat["borderBottom"]="1px solid rgba(0,0,0,.1)";
      }
      placeText(thisFormat);


      //draw line numbers
        placeText({
          "parentDiv":"consoleLinesHolder",
          "divid":"lineNumber"+k,
          "text":window.consoleLines[k][2]+":",
          "top":currentY+"px",
          "left":"0px",
          "width":'25px',
          "height":"25px",
          "color":getColor(window.consoleLines[k][0])[1],
          "textAlign":"right"
        });
    }

    //draw text
    var thisFormat={
      "parentDiv":"consoleLinesHolder",
      "divid":"line"+k,
      "text":window.consoleLines[k][1],
      "top":currentY+"px",
      "left":"25px",
      "textAlign":"left",
      "height":"25px",
      "fontSize":"125%",
      "paddingLeft":"10px",
      "color":getColor(window.consoleLines[k][0])[1],
    }
    for(j in window.consoleLines[k][3]){
      thisFormat[j]=window.consoleLines[k][3][j];
      thisFormat["backgroundColor"]="";
    }
    placeText(thisFormat);
  }
}




function drawConsoleTabs(){
  placeText({
    "zIndex":"6",
    "color":"white",
    "fontSize":"20px",
    "lineHeight":"75px",
    "text":"Console Navigator - Current Page"+(window.consoleTabsInfo[0])+" out of "+window.consoleTabsInfo[1],
    "divid":"consoleTabsHolder",
    "top":"-250px",
    "left":"675px",
    "width":"850px",
    "height":"175px",
    "fontSize":"20px",
    "backgroundColor":"white",
      "backgroundColor":"var(--w3-purple)",
    "transition":"all .25s ease"
    });


  placeText({
      "parentDiv":"consoleTabsHolder",
      "divid":"firstPageTab",
      "text":"First Page",
      "fontSize":"20px",
      "color":'white',
      "top":75+"px",
      "left":25+"px",
      "width":"200px",
      "height":"75px",
      "backgroundColor":"var(--w3-lightblue)"
    });


  placeText({
      "parentDiv":"consoleTabsHolder",
      "divid":"previousPageTab",
      "text":"Previous Page",
      "fontSize":"20px",
      "color":'white',
      "top":75+"px",
      "left":225+"px",
      "width":"200px",
      "height":"75px",
      "backgroundColor":"var(--w3-lightblue)"
    });


  placeText({
      "parentDiv":"consoleTabsHolder",
      "divid":"nextPageTab",
      "text":"Next Page",
      "fontSize":"20px",
      "color":'white',
      "top":75+"px",
      "left":425+"px",
      "width":"200px",
      "height":"75px",
      "backgroundColor":"var(--w3-lightblue)"
    });


  placeText({
      "parentDiv":"consoleTabsHolder",
      "divid":"lastPageTab",
      "text":"Last Page",
      "fontSize":"20px",
      "color":'white',
      "top":75+"px",
      "left":625+"px",
      "width":"200px",
      "height":"75px",
      "backgroundColor":"var(--w3-lightblue)"
    });

  if(window.consoleTabsInfo!=undefined){
  placeText({
      "zIndex":"11",
      "divid":"pagenumber",
      "text":"Page "+(window.consoleTabsInfo[0])+" out of "+window.consoleTabsInfo[1],
      "fontSize":"100%",
      "color":"white",
      "top":"50px",
      "left":"1200px",
      "width":"200px",
      "height":"25px",
      // "border":"1px solid rgba(0,0,0,.1)"
    });
    hoverDivChangeOtherDiv("pagenumber","consoleTabsHolder",{"top":"70px"});
    clickButton("many","pagenumber",changeMonitorPage,"console");
    }


    var nextTab=Math.min(window.currentTab+1,window.totalPages);
    var previousTab=Math.max(window.currentTab-1,1);
    clickButton("many","firstPageTab",changeConsoleTab,"first");
    clickButton("many","previousPageTab",changeConsoleTab,"previous");
    clickButton("many","nextPageTab",changeConsoleTab,"next");
    clickButton("many","lastPageTab",changeConsoleTab,"last");
  var hoverInfo={"backgroundColor":"white","color":"navy"};
    hoverDiv("firstPageTab",hoverInfo)
    hoverDiv("previousPageTab",hoverInfo)
    hoverDiv("nextPageTab",hoverInfo)
    hoverDiv("lastPageTab",hoverInfo)
    hoverDivChangeOtherDiv("consoleButton","consoleTabsHolder",{"top":"70px"});
    hoverDivChangeOtherDiv("consoleTabsHolder","consoleTabsHolder",{"top":"70px"});


}


function changeConsoleTab(args){
  sock.send(JSON.stringify({"type":"changeConsoleTab","tab":args[0]}));
}


function consoleLinesNoUpdate(msg){
  console.log("consoleLinesNoUpdate")
}

function consoleLinesUpdate(msg){
  deleteDiv("serverInfoContainer")
  deleteDiv("configInfoContainer")
  deleteDiv("monitorTableHolder");
  deleteDiv("taskTableHolder");
  deleteDiv("mainInfoHolder");
  getMonitorTablesInfo(msg)
  window.consoleLines=msg['consoleLines'];
  drawConsoleLines();
  document.getElementById("mainDivInside").scrollTop= (0,20000);
}


function drawServerInfo(){

  var incoming={
    "parentDiv":"mainDivInside",
    "divid":"serverInfoContainer",
    "fontSize":"300%",
    "color":"black",
    "height":"400px",
    "width":"750px",
    "left":"800px",
    "top":"275px",
    "backgroundColor":"white"
  };
  placeText(incoming);


  placeText({
    "parentDiv":"serverInfoContainer",
    "text":"Server Information",
    "color":"black",
    "height":"50px",
    "top":"0px",
  });


  placeText({
    "parentDiv":"serverInfoContainer",
    "text":"Python Version:",
    "fontSize":"70%",
    "color":"blue",
    "height":"50px",
    "width":"250px",
    "textAlign":"right",
    "top":"50px",
  });
  placeText({
    "parentDiv":"serverInfoContainer",
    "text":window.pythonVersion,
    "fontSize":"70%",
    "color":"black",
    "height":"50px",
    "left":"270px",
    "textAlign":"left",
    "top":"50px",
    "width":"unset",
  });

  placeText({
    "parentDiv":"serverInfoContainer",
    "text":"Python Executable:",
    "fontSize":"70%",
    "color":"blue",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":"100px",
  });

  placeText({
    "parentDiv":"serverInfoContainer",
    "text":window.pythonExecutable,
    "fontSize":"70%",
    "color":"black",
    "height":"50px",
    "width":"unset",
    "left":"270px",
    "textAlign":"left",
    "top":"100px",
  });

  placeText({
    "parentDiv":"serverInfoContainer",
    "text":"Server IP Address:",
    "fontSize":"70%",
    "color":"red",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":"150px",
  });


  var y=150;
  if(window.ipAddresses==undefined){window.ipAddresses=[["0","Error Getting IP (server is still running fine)"]];}
  for(var k=0;k<window.ipAddresses.length;k++){
    placeText({
      "parentDiv":"serverInfoContainer",
      "text":window.ipAddresses[k][1],
      "fontSize":"70%",
      "color":"black",
      "height":"50px",
      "width":"unset",
      "left":"270px",
      "textAlign":"left",
      "top":(y)+"px",
    });
    y+=50;
  }

  placeText({
    "parentDiv":"serverInfoContainer",
    "text":"Config IP Address:",
    "fontSize":"70%",
    "color":"red",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":y+"px",
  });

  placeText({
    "parentDiv":"serverInfoContainer",
    "text":window.config['domain'],
    "fontSize":"70%",
    "color":"black",
    "height":"50px",
    "width":"unset",
    "left":"270px",
    "textAlign":"left",
    "top":(y)+"px",
  });

  y+=50;


  placeText({
    "parentDiv":"mainDivInside",
    "divid":"mainInfoHolder",
    "height":"250px",
    "width":"100%",
    "top":"0px",
    "left":"0px",
    "overflow":"hidden",
    "backgroundColor":"rgba(255,0,0,.1)",
    });

  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"Launcher String:",
    "fontSize":"20px",
    "color":"green",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":25+"px",
  });

  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe -kiosk --no-default-browser-check --autoplay-policy=no-user-gesture-required --disk-cache-size=1 --media-cache-size=1 "+window.config['domain']+"/client.html",
    "fontSize":"20px",
    "color":"black",
    "height":"50px",
    "left":"270px",
    "whiteSpace":"nowrap",
    "overflow":"none",
    "width":"calc(100% - 270px)",
    "textAlign":"left",
    "top":25+"px",
    "userSelect":"text",
    "zIndex":"5",
  });
  y+=50;

  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"Restart String:",
    "fontSize":"20px",
    "color":"green",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":75+"px",
  });


  placeText({
    "parentDiv":"mainInfoHolder",
    "text":config['restartString'],
    "fontSize":"20px",
    "color":"black",
    "height":"50px",
    "width":"1000px",
    "left":"270px",
    "textAlign":"left",
    "top":75+"px",
    "userSelect":"text",
  });



  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"New Client Link:",
    "fontSize":"20px",
    "color":"green",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":125+"px",
  });


  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"<a href='"+config['domain']+"/client.html' target='_blank'>"+config['domain']+"/client.html</a>",
    "fontSize":"20px",
    "color":"black",
    "height":"50px",
    "width":"1000px",
    "left":"270px",
    "textAlign":"left",
    "top":125+"px",
    "userSelect":"text",
  });


  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"New Video Link:",
    "fontSize":"20px",
    "color":"green",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":175+"px",
  });


  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"<a href='"+config['domain']+"/video.html'>"+config['domain']+"/video.html</a>",
    "fontSize":"20px",
    "color":"black",
    "height":"50px",
    "width":"1000px",
    "left":"270px",
    "textAlign":"left",
    "top":175+"px",
    "userSelect":"text",
  });



}



function Comparator(a, b) {
  if (a[0] < b[0]) return -1;
  if (a[0] > b[0]) return 1;
  return 0;
}

function drawConfigInfo(){
  placeText({
    "parentDiv":"mainDivInside",
    "divid":"configInfoContainer",
    "fontSize":"300%",
    "color":"black",
    "height":"800px",
    "width":"800px",
    "left":"00px",
    "top":"275px",
  });


  placeText({
    "parentDiv":"configInfoContainer",
    "text":"Config File Information",
    "color":"black",
    "height":"50px",
    "top":"0px",
  });

  y=50

  myArray=[]
  for(k in window.config){
    myArray.push([window.config[k].length,k,window.config[k]]);
  }
  myArray = myArray.sort(Comparator);

  var first=["location","currentExperiment","packageFolder","domain","webServerRoot","dataFolder","serverType"]
  var second=[]
  for(var k in window.config){
      if(first.indexOf(k)==-1){
        second.push(k)
      }
  }
  var all=first.concat(second);
  for(var k in myArray){
    thisColor="black"
    if(first.indexOf(myArray[k][1])>-1){
      thisColor="red";
    } 
    placeText({
    "parentDiv":"configInfoContainer",
    "text":myArray[k][1]+":",
    "fontSize":"25px",
    "color":"green",
    "height":"50px",
    "width":"300px",
    "left":"0px",
    "textAlign":"right",
    "top":y+"px",
  });

  placeText({
    "parentDiv":"configInfoContainer",
    "text":myArray[k][2],
    "fontSize":"25px",
    "color":thisColor,
    "height":"50px",
    "width":"unset",
    "left":"320px",
    "textAlign":"left",
    "top":(y)+"px",
  });
  y+=50;
}
}




function showServerInfo(msg){
  deleteDiv("monitorTableHolder")
  deleteDiv("taskTableHolder")
  deleteDiv("consoleLinesHolder")
  getMonitorTablesInfo(msg)
  drawServerInfo();
  drawConfigInfo();
}







