window.requestAnimFrame = (
  function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  }
)();

function messageManager(msg){
  var incoming = JSON.parse(msg);
  window.state=incoming['status'];
  eval(incoming['type']+'Message(incoming);');
}


function makeMonitorTable(msg){
  var table = document.getElementById("monitorTable");
  if(table!=null){ 
    document.getElementById('mainDiv').removeChild(table);
  }
  var table = document.createElement("table");
  table.id="monitorTable";

  var thisRow = document.createElement("tr");
  titles=msg['titles'];
  for(k=0;k<titles.length;k++){
    var cell = document.createElement("th");
    cell.innerHTML=titles[k];
    thisRow.appendChild(cell);
  }
  table.appendChild(thisRow);

  for(row=0;row<msg['table'].length;row++){
    var thisRow = document.createElement("tr");
    var cell = document.createElement("td");
    cell.innerHTML=row+1;
    thisRow.appendChild(cell);
    for(col=0;col<msg['table'][row].length;col++){
      var cell = document.createElement("td");
      cell.innerHTML=msg['table'][row][col];
      //var cellText = document.createTextNode(msg['table'][row][col]); 
      //cell.appendChild(cellText);
      thisRow.appendChild(cell);
    }
  table.appendChild(thisRow);
  }

  document.getElementById('mainDiv').appendChild(table);
}

function tableUpdateMessage(msg){
  window.accepting=msg['accepting'];
  makeMonitorTable(msg);
  makeTaskTable(msg)
}


function makeTaskTable(msg){
  var table = document.getElementById("taskTable");
  if(table!=null){ 
    document.getElementById('mainDiv').removeChild(table);
  }
  var table = document.createElement("table");
  table.id="taskTable";

  var thisRow = document.createElement("tr");
  var cell = document.createElement("td");
  cell.id="acceptingTitle"
  cell.innerHTML="Accepting Clients"
  cell.colSpan = "2";
  thisRow.appendChild(cell);
  
  var cell = document.createElement("td");
  cell.innerHTML='<div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" checked><label class="onoffswitch-label" for="myonoffswitch"></label></div>';
  cell.id="acceptingSwitch"
  cell.colSpan = "1";
  thisRow.appendChild(cell);
  table.appendChild(thisRow);

  var thisRow = document.createElement("tr");
  titles=['#','Task','Status']
  for(k=0;k<titles.length;k++){
    var cell = document.createElement("th");
    cell.innerHTML=titles[k];
    thisRow.appendChild(cell);
  }
  table.appendChild(thisRow);


  for(row=0;row<msg['taskTable'].length;row++){
    var thisRow = document.createElement("tr");
    var cell = document.createElement("td");
    cell.innerHTML=row+1;
    thisRow.appendChild(cell);
    var cell = document.createElement("td");
    window.taskTable=msg.taskTable;
    cell.innerHTML="<a href='javascript:void(0)' onclick='sendToServer(window.taskTable["+row+"]);'>"+msg['taskTable'][row].title+"</a>";
    thisRow.appendChild(cell);
    var cell = document.createElement("td");
    window.taskTable=msg.taskTable;
    cell.innerHTML=msg['taskTable'][row].status;
    thisRow.appendChild(cell);
    table.appendChild(thisRow);
  }




  var thisRow = document.createElement("tr");
  var cell = document.createElement("td");
  cell.colSpan="3";
  cell.align="center";
  var str = msg['dataFile'];
  var dataFileURL = msg['dataFileURL'];

  var res = str.substring(8);
  console.log(res);
  var str2 = window.location.href;
  console.log(str2);
  //str2 = str2.substring(0, str2.length - 10);
  cell.innerHTML="<a href=\""+dataFileURL+"\">Data File</a>";
  thisRow.appendChild(cell);
  table.appendChild(thisRow);

  var thisRow = document.createElement("tr");
  var cell = document.createElement("td");
  cell.colSpan="3";
  cell.align="center";
  cell.innerHTML="<a href='/console.html'>Console</a>";
  thisRow.appendChild(cell);
  table.appendChild(thisRow);

  var thisRow = document.createElement("tr");
  var cell = document.createElement("td");
  cell.colSpan="3";
  cell.align="center";
  cell.innerHTML="<a href='javascript:void(0)' onclick='refreshClient(\"all\");'>Refresh All</a>";
  thisRow.appendChild(cell);
  table.appendChild(thisRow);


  document.getElementById('mainDiv').appendChild(table);
  document.getElementById('myonoffswitch').addEventListener("click",changeAccepting);
  acceptingSwitch();
}



function acceptingSwitch(){
  if(window.accepting==0){
    thisCheck=false;
    thisTitle="Not Accepting Clients"
  }
  else if(window.accepting==1){
    thisCheck=true;
    thisTitle="Accepting Clients"
  }
  document.getElementById('acceptingTitle').innerHTML=thisTitle;
  document.getElementById('myonoffswitch').checked=thisCheck;
}


function changeAccepting(){
  console.log(window.accepting);
  msg={}
  if(window.accepting==0){
    window.accepting=1;
    msg['type']="startAccepting";
  }
  else if(window.accepting==1){
    window.accepting=0;
    msg['type']="stopAccepting";
  }
  acceptingSwitch();
  sock.send(JSON.stringify(msg));
}



function confirmAction(m){
  var confirmed = confirm(m);
  return confirmed;
}
function sendToServer(msg){
  console.log(msg);
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
  var username=$.urlParam('automatic');
  if(username!=undefined){
    var pf = partial(startIt,username);
    setTimeout(pf,300);
  }
}

getAutomatic();
