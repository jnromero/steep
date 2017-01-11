function tableUpdate(msg){
  window.serverStatus=msg['serverStatus'];
  window.lastTimeCheck=(new Date()).getTime();
  makeMonitorTable(msg);
  makeTaskTable(msg)
}



function makeMonitorTable(msg){
  var subjectIDs=msg['table']['subjectIDs'];
  var titles=msg['table']['titles'];

  var table=createAndAddElement("table","monitorTable","mainDiv");
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
  // for(row=0;row<msg['table'].length;row++){
  //   var thisRow = document.createElement("tr");
  //   var cell = document.createElement("td");
  //   cell.innerHTML=row+1;
  //   thisRow.appendChild(cell);
  //   for(col=0;col<msg['table'][row].length;col++){
  //     var cell = document.createElement("td");
  //     cell.innerHTML=msg['table'][row][col];
  //     //var cellText = document.createTextNode(msg['table'][row][col]); 
  //     //cell.appendChild(cellText);
  //     thisRow.appendChild(cell);
  //   }
  // table.appendChild(thisRow);
  // }

  // document.getElementById('mainDiv').appendChild(table);
}
function sortMonitorTable(args){
  col=args[0];
  msg={'type':"sortMonitorTableMessage",'col':col};
  console.log(msg);
  sock.send(JSON.stringify(msg));
}

function makeTaskTable(msg){
  drawAcceptingSwitch();
  for(row=0;row<msg['taskTable'].length;row++){
    var thisTask=msg['taskTable'][row].title;
    if(thisTask=="Load Instructions"){
      drawInstructionsController();
    }
    else{
      drawGenericTask(msg['taskTable'][row],row);
    }
  }

  drawDataFileButton(msg);
  // drawRefreshAllButton();

  // var thisRow = document.createElement("tr");
  // var cell = document.createElement("td");
  // cell.colSpan="3";
  // cell.align="center";
  // var str = msg['dataFile'];
  // var dataFileURL = msg['dataFileURL'];

  // var res = str.substring(8);
  // console.log(res);
  // var str2 = window.location.href;
  // console.log(str2);
  // //str2 = str2.substring(0, str2.length - 10);
  // cell.innerHTML="<a href=\""+dataFileURL+"\">Data File</a>";
  // thisRow.appendChild(cell);
  // table.appendChild(thisRow);

  // var thisRow = document.createElement("tr");
  // var cell = document.createElement("td");
  // cell.colSpan="3";
  // cell.align="center";
  // cell.innerHTML="<a href='/console.html'>Console</a>";
  // thisRow.appendChild(cell);
  // table.appendChild(thisRow);

  // var thisRow = document.createElement("tr");
  // var cell = document.createElement("td");
  // cell.colSpan="3";
  // cell.align="center";
  // cell.innerHTML="<a href='javascript:void(0)' onclick='refreshClient(\"all\");'>Refresh All</a>";
  // thisRow.appendChild(cell);
  // table.appendChild(thisRow);


  // document.getElementById('mainDiv').appendChild(table);
  // document.getElementById('myonoffswitch').addEventListener("click",changeAccepting,{});
  // toggleAcceptingSwitch();
}


function drawGenericTask(msg,row){
  var divName="taskDiv_"+msg.type;
  var thisDiv=createAndAddDiv(divName,"mainDiv");
  thisDiv.className="taskButton";
  thisDiv.style.top=(85+60*row)+"px";
  thisDiv.innerHTML=msg.title;
  console.log(divName);
  console.log(msg.status);
  if(msg.status=="Done"){
      thisDiv.style.backgroundColor="rgba(0,255,0,.2)";
  }
  else{
      thisDiv.style.backgroundColor="rgba(255,0,0,.2)";
      clickButton("many",divName,sendToServer,msg);
  }
}


function drawDataFileButton(msg){
  var dataFileButton=createAndAddDiv("dataFileButton","mainDiv");
  dataFileButton.className="taskButton";
  dataFileButton.innerHTML="Download Data File";
  dataFileButton.style.top=(85+60*msg['taskTable'].length)+"px";
  dataFileButton.href=msg['dataFileURL'];
}





function toggleAcceptingSwitch(){
  msg={'type':"toggleAcceptingSwitch"};
  sock.send(JSON.stringify(msg));
}

function drawAcceptingSwitch(){
  var acceptingButton=createAndAddDiv("acceptingButton","mainDiv");
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
  var loadInstructionsButton=createAndAddDiv("loadInstructionsButton","mainDiv");
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
      clickButton("once","instructionsPlayButton",stopInstructions);
    }
    else if(window.serverStatus['instructions']['playing']==0){
      var instructionsPlayButton=createAndAddDiv("instructionsPlayButton","loadInstructionsButton");
      instructionsPlayButton.innerHTML="Play";
      clickButton("once","instructionsPlayButton",resumeInstructions);
    }


    var instructionsRestartButton=createAndAddDiv("instructionsRestartButton","loadInstructionsButton");
    instructionsRestartButton.innerHTML="Restart";
    clickButton("many","instructionsRestartButton",restartInstructions);

    var instructionsEndButton=createAndAddDiv("instructionsEndButton","loadInstructionsButton");
    instructionsEndButton.innerHTML="End";
    clickButton("many","instructionsEndButton",monitorEndInstructions);

    var instructionsTime=createAndAddDiv("instructionsTime","loadInstructionsButton");
    instructionsTime.style.width=serverStatus['instructions']['time']*280;

    var instructionsCaption=createAndAddDiv("instructionsCaption","loadInstructionsButton");
    instructionsCaption.innerHTML=window.serverStatus['instructions']['lastCaption'];
  }
}


function confirmAction(m){
  var confirmed = confirm(m);
  return confirmed;
}
function sendToServer(args){
  msg=args[0];
  var confirmation=confirmAction("Are you sure you want to "+msg['title']+"??");
  if(confirmation){
    sock.send(JSON.stringify(msg));
  }
}

function refreshClient(sid){
  msg={}
  msg['type']="refreshMyPage";
  msg['sid']=sid;
  var confirmation=confirmAction("Are you sure you want to refresh "+sid+"??");
  if(confirmation){
    sock.send(JSON.stringify(msg));
  }
}


function startIt(type){
  if(window.taskTable!=undefined){
    for(k=0;k<window.taskTable.length;k++){
      if(window.taskTable[k]['type']==type){
        sock.send(JSON.stringify(window.taskTable[k]));
      }
    }
  }
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
        var pf = partial(startIt,username);
        setTimeout(pf,timeDelay);        
      }
    }
  }
}

getAutomatic();
