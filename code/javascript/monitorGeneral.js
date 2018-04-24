
function goToPageNewTab(args){
  window.open(args[0],"_blank");
}



// window.monitorTables

function camelCaseToRegular(string){
  string=string
    // insert a space before all caps
    .replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function(str){ return str.toUpperCase(); })
    return string
}





function drawPageTabs(currentPage){
  console.log("!!!!!",currentPage)
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
    var thisDiv = document.createElement("div");
    thisDiv.id="monitorHeader";
    document.body.prepend(thisDiv);

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

