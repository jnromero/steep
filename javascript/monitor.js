// function tableUpdate(msg){
//   console.log("TABLE UPDATES@!!!!")
//   window.serverStatus=msg['serverStatus'];
//   window.lastTimeCheck=(new Date()).getTime();
//   if(window.serverPage=="monitor"){
//     makeMonitorTable(msg);
//     makeTaskTable(msg);
//   }
// }



function makeMonitorTable(msg){
  var subjectIDs=msg['table']['subjectIDs'];
  var titles=msg['table']['titles'];


  var table=createAndAddElement("table","monitorTable","mainDivInside");


  if(window.serverStatus['page']=="instructions"){
    var captionRow=createAndAddElement("tr","monitorTableCaptionsRow","monitorTable");
    var captionEntry=createAndAddElement("td","monitorTableCaptionsRowEntry","monitorTableCaptionsRow");
    captionEntry.colSpan=titles.length;
    captionEntry.innerHTML=window.serverStatus['instructions']['lastCaption'];

    var instructionsStatusBar=createAndAddDiv("instructionsStatusBar","mainDivInside");
    instructionsStatusBar.style.width=serverStatus['instructions']['time']*1250;
  }
  else{
    deleteDiv("instructionsStatusBar");
  }

  var thisRow=createAndAddElement("tr","monitorTableHeaderRow","monitorTable");


  for(k=0;k<titles.length;k++){
    var thisHeader=createAndAddElement("th","monitorTableHeader_"+k,"monitorTableHeaderRow");
    thisHeader.innerHTML=titles[k];
    clickButton("many","monitorTableHeader_"+k,sortMonitorTable,k);
  }

  for(var s=0;s<subjectIDs.length;s++){
    var thisRow=createAndAddElement("tr","monitorTableRow_"+s,"monitorTable");
    for(var k=0;k<titles.length;k++){
      var thisEntry=createAndAddElement("td","monitorTableEntry_"+s+"-"+k,"monitorTableRow_"+s);
      thisEntry.innerHTML=msg['table'][subjectIDs[s]][titles[k]];
    }
  }
}



function makeMonitorTableOld(msg){
  var subjectIDs=msg['table']['subjectIDs'];
  var titles=msg['table']['titles'];


  var table=createAndAddElement("table","monitorTable","mainDiv");


  if(window.serverStatus['page']=="instructions"){
    var captionRow=createAndAddElement("tr","monitorTableCaptionsRow","monitorTable");
    var captionEntry=createAndAddElement("td","monitorTableCaptionsRowEntry","monitorTableCaptionsRow");
    captionEntry.colSpan=titles.length;
    captionEntry.innerHTML=window.serverStatus['instructions']['lastCaption'];

    var instructionsStatusBar=createAndAddDiv("instructionsStatusBar","mainDiv");
    instructionsStatusBar.style.width=serverStatus['instructions']['time']*1250;
  }
  else{
    deleteDiv("instructionsStatusBar");
  }

  var thisRow=createAndAddElement("tr","monitorTableHeaderRow","monitorTable");


  for(k=0;k<titles.length;k++){
    var thisHeader=createAndAddElement("th","monitorTableHeader_"+k,"monitorTableHeaderRow");
    thisHeader.innerHTML=titles[k];
    clickButton("many","monitorTableHeader_"+k,sortMonitorTable,k);
  }

  for(var s=0;s<subjectIDs.length;s++){
    var thisRow=createAndAddElement("tr","monitorTableRow_"+s,"monitorTable");
    for(var k=0;k<titles.length;k++){
      var thisEntry=createAndAddElement("td","monitorTableEntry_"+s+"-"+k,"monitorTableRow_"+s);
      thisEntry.innerHTML=msg['table'][subjectIDs[s]][titles[k]];
    }
  }
}


function sortMonitorTable(args){
  col=args[0];
  msg={'type':"sortMonitorTableMessage",'col':col};
  console.log(msg);
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
  var thisDiv=createAndAddDiv(divName,"mainDivInside");
  thisDiv.className="taskButton";
  thisDiv.style.top=(85+60*row)+"px";
  thisDiv.innerHTML=taskTitle;
  if(taskStatus=="Done"){
      thisDiv.style.backgroundColor="rgba(0,255,0,.2)";
  }
  else{
      thisDiv.style.backgroundColor="rgba(255,0,0,.2)";
      clickButton("many",divName,sendToServer,thisTask,taskTitle);
  }
}


function drawDataFileButton(msg){
  var dataFileButton=createAndAddDiv("dataFileButton","mainDivInside");
  dataFileButton.className="taskButton";
  dataFileButton.innerHTML="Download Data Folder (.zip)";
  dataFileButton.style.top=(85+60*msg['taskList'].length)+"px";
  dataFileButton.href=msg['dataFolderURL'];
  clickButton("many","dataFileButton",downloadDataFile,msg['dataFolderURL']);
}

function downloadDataFile(args){
  window.location.href=args[0];
}



function drawStopServerButton(msg){
  var stopPythonServerButton=createAndAddDiv("stopPythonServerButton","mainDivInside");
  stopPythonServerButton.className="taskButton";
  stopPythonServerButton.innerHTML="Stop Python Server";
  stopPythonServerButton.style.top=(205+60*msg['taskList'].length)+"px";
  clickButton("once","stopPythonServerButton",stopPythonServer);

}


function drawRestartServerButton(msg){
  var stopPythonServerButton=createAndAddDiv("restartPythonServerButton","mainDivInside");
  stopPythonServerButton.className="taskButton";
  stopPythonServerButton.innerHTML="Restart Python Server";
  stopPythonServerButton.style.top=(265+60*msg['taskList'].length)+"px";
  clickButton("once","restartPythonServerButton",restartPythonServer);

}

function drawRefreshAllButton(msg){
  var refreshAllButton=createAndAddDiv("refreshAllButton","mainDivInside");
  refreshAllButton.className="taskButton";
  refreshAllButton.innerHTML="Refresh All Clients";
  refreshAllButton.style.top=(145+60*msg['taskList'].length)+"px";
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
  var acceptingButton=createAndAddDiv("acceptingButton","mainDivInside");
  clickButton("once","acceptingButton",toggleAcceptingSwitch);
  if(window.serverStatus['acceptingClients']==0){
    acceptingButton.innerHTML="Not Accepting Clients"
    acceptingButton.style.backgroundColor="rgba(0,255,0,.2)";
  }
  else if(window.serverStatus['acceptingClients']==1){
    acceptingButton.innerHTML="Accepting Clients"
    acceptingButton.style.backgroundColor="rgba(255,0,0,.2)";
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
  var loadInstructionsButton=createAndAddDiv("loadInstructionsButton","mainDivInside");
  if(window.serverStatus['instructions']['loaded']==0 && window.serverStatus['instructions']['finished']==0){
    loadInstructionsButton.innerHTML="Load Instructions";
    clickButton("once","loadInstructionsButton",loadInstructions);
    loadInstructionsButton.style.backgroundColor="rgba(255,0,0,.2)";
  }
  else if(window.serverStatus['instructions']['loaded']==0 && window.serverStatus['instructions']['finished']==1){
    loadInstructionsButton.innerHTML="Finished (Click to load again)";
    clickButton("once","loadInstructionsButton",loadInstructions);
    loadInstructionsButton.style.backgroundColor="rgba(0,255,0,.2)";
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
  sid=args[0];
  msg={}
  msg['type']="refreshMyPage";
  msg['sid']=sid;
  var confirmation=confirmAction("Are you sure you want to refresh "+sid+"??");
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

getAutomatic();


drawPageTabs("monitor");
drawMainDivInside();
function updateMonitorTable(msg){
  window.serverStatus=msg['serverStatus'];
  window.lastTimeCheck=(new Date()).getTime();
  makeMonitorTable(msg);
}

function updateTaskTable(msg){
  window.serverStatus=msg['serverStatus'];
  makeTaskTable(msg);
}


