
function makeConsoleTab(){
  var pythonConsole = document.createElement("a");
  pythonConsole.id="pythonConsole";
  var pageName=location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
  if(pageName=="server.html"){
    pythonConsole.href=window.config['domain']+"/console.html";
  }

  var pythonConsoleIN = document.createElement("div");
  pythonConsoleIN.id="pythonConsoleIN";
  pythonConsole.appendChild(pythonConsoleIN);
  document.getElementById('mainDiv').appendChild(pythonConsole);
}
makeConsoleTab();

window.numberTabs=0;
window.dataLength=0;
function checkFile(){
    jQuery.get(window.currentLogURL, function(data) {
        if(data.length>window.dataLength){
            addText(window.dataLength,data);
            window.dataLength=data.length;
        }
        else if(data.length<window.dataLength){
            document.getElementById("pythonConsoleIN").innerHTML="";
            addText(0,data);
            window.dataLength=data.length;
        }
    });

    if(window.totalPages!=window.numberTabs){
      window.numberTabs=window.totalPages;
      drawTabs(window.numberTabs);
    }
    setTimeout(checkFile,250);
}


function drawTabs(total){
  var consoleTabContainer = document.createElement("div");
  consoleTabContainer.id="consoleTabContainer";
  document.body.appendChild(consoleTabContainer);
  for(k=1;k<parseInt(total)+1;k++){
    var consoleTab = document.createElement("a");
    consoleTab.id="consoleTab"+k;
    consoleTab.className="consoleTab";
    consoleTab.href="/console.html?page="+k;
    if(window.currentLogTab==k){
      consoleTab.className="consoleTab consoleTabPressed";
      consoleTab.href="/console.html";
    }
    consoleTab.innerHTML=k;
    consoleTabContainer.appendChild(consoleTab);
  }
}

window.currentLogLine=0;
window.toggle=0;
function addText(start,data){
    subString=data.substring(start);
    lines = subString.split("\n");
    for(k=0;k<lines.length;k++){
      if(lines[k]!=""){
        document.getElementById("pythonConsoleIN").innerHTML=document.getElementById("pythonConsoleIN").innerHTML+lines[k]+"\n";
      }
    }
    if(window.toggle==0){
      document.getElementById("pythonConsole").scrollTop = document.getElementById("pythonConsole").scrollHeight;
    }


    // var myElements=document.querySelectorAll(".error");
    // for(var i=0;i<myElements.length;i++){
    //   myElements[i].style.color="red";
    // }
    //window.scrollTo(0,document.body.scrollHeight);
}

setTimeout(checkFile,250);
