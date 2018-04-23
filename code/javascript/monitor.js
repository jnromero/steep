


function makeMonitorTable(msg){
  placeText({"parentDiv":"mainDivInside","divid":"monitorTableHolder","width":"1300px","height":"100%","top":"0px","left":"0px"});
  var subjectIDs=msg['table']['subjectIDs'];
  var titles=msg['table']['titles'];
  var connected=msg['table']['connected'];


  var table=createAndAddElement("table","monitorTable","monitorTableHolder");


  if(window.serverStatus['page']=="instructions"){
    var captionRow=createAndAddElement("tr","monitorTableCaptionsRow","monitorTable");
    var captionEntry=createAndAddElement("td","monitorTableCaptionsRowEntry","monitorTableCaptionsRow");
    captionEntry.colSpan=titles.length;
    captionEntry.innerHTML=window.serverStatus['instructions']['lastCaption'];

    var instructionsStatusBar=createAndAddDiv("instructionsStatusBar","monitorTableHolder");
    instructionsStatusBar.style.width=serverStatus['instructions']['time']*1170;
  }
  else{
    deleteDiv("instructionsStatusBar");
  }

  var thisRow=createAndAddElement("tr","monitorTableHeaderRow","monitorTable");


  var thisHeader=createAndAddElement("th","monitorTableHeader_"+0,"monitorTableHeaderRow");
  thisHeader.innerHTML="#";
  for(k=0;k<titles.length;k++){
    var thisHeader=createAndAddElement("th","monitorTableHeader_"+(k+1),"monitorTableHeaderRow");
    thisHeader.innerHTML=titles[k];
    clickButton("many","monitorTableHeader_"+(k+1),sortMonitorTable,k);
  }

  for(var s=0;s<subjectIDs.length;s++){
    var thisRow=createAndAddElement("tr","monitorTableRow_"+s,"monitorTable");
    if(connected[s]=="disconnected"){
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
  var confirmation=confirmAction("Are you sure you want to stop the python server??  Only do this if you are done with the experiment or you have an error.  You might be able to restart, but only maybe.");
  if(confirmation){
    msg={'type':"stopPythonServer"};
    sock.send(JSON.stringify(msg));
  }
}


function restartPythonServer(){
  var confirmation=confirmAction("Are you sure you want to restart the python server??  Only do this if you are done with the experiment or you have an error.  You might be able to restart, but only maybe.");
  if(confirmation){
    msg={'type':"restartPythonServer"};
    sock.send(JSON.stringify(msg));
  }
}

      // msg['taskList']=self.monitorTaskList
      // msg['taskStatus']=self.data['taskStatus']


function makeTaskTable(msg){
  placeText({"parentDiv":"mainDivInside","divid":"taskTableHolder","width":"300px","height":"100%","top":"0px","right":"0px"});
  drawAcceptingSwitch();
  for(row=0;row<msg['taskList'].length;row++){
    var thisTask=msg['taskList'][row];
    var taskTitle=msg['taskStatus'][thisTask]['title'];
    var taskStatus=msg['taskStatus'][thisTask]['status'];
    if(taskTitle=="Load Instructions"){
      drawInstructionsController();
    }
    else{
      drawGenericTask(row,thisTask,taskTitle,taskStatus);
    }
  }

  drawDataFileButton(msg);
  drawStopServerButton(msg);
  drawRestartServerButton(msg);
  drawRefreshAllButton(msg);

}


function drawGenericTask(row,thisTask,taskTitle,taskStatus){
  var divName="taskDiv_"+thisTask;
  var thisDiv=createAndAddDiv(divName,"taskTableHolder");
  thisDiv.className="taskButton";
  thisDiv.style.top=(60+60*row)+"px";
  thisDiv.innerHTML=taskTitle;
  if(taskStatus=="Done"){
      thisDiv.style.backgroundColor="var(--w3-green)";
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


function confirmAction(m){
  var confirmed = confirm(m);
  return confirmed;
}
function sendToServer(args){
  var thisTask=args[0];
  var taskTitle=args[1];
  var confirmation=confirmAction("Are you sure you want to "+taskTitle+"??");
  if(confirmation){
    sock.send(JSON.stringify({"type":thisTask}));
  }
}

function refreshClient(args){
  var sid=args[0];
  msg={}
  msg['type']="refreshMyPage";
  msg['subjectIDIncoming']=sid;
  var confirmation=confirmAction("Are you sure you want to refresh "+sid+"??");
  if(confirmation){
    sock.send(JSON.stringify(msg));
  }
}

function deleteClient(args){
  var sid=args[0];
  msg={}
  msg['type']="deleteThisClient";
  msg['subjectIDIncoming']=sid;
  var confirmation=confirmAction("Are you sure you want to delete subject "+sid+"??");
  if(confirmation){
    sock.send(JSON.stringify(msg));
  }
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
drawPageTabs("monitor");
drawMainDivInside();

function getMonitorTablesInfo(msg){
  window.monitorTables=msg['monitorTables'];
  window.currentMonitorTable=msg['currentMonitorTable']
  window.serverStatus=msg['serverStatus'];
  window.consoleTabsInfo=msg['consoleTabs'];
}

function updateMonitorTable(msg){
  deleteDiv("serverInfoContainer");
  deleteDiv("configInfoContainer");
  deleteDiv("mainInfoHolder");
  deleteDiv("consoleLinesHolder");
  getMonitorTablesInfo(msg);
  drawPageTabs("monitor");
  drawMonitorPageLinks();
  drawConsoleTabs();
  window.lastTimeCheck=(new Date()).getTime();
  makeMonitorTable(msg);
}

function updateTaskTable(msg){
  deleteDiv("consoleLinesHolder")
  window.serverStatus=msg['serverStatus'];
  makeTaskTable(msg);
}


