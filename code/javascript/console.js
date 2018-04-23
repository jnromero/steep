
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
  drawPageTabs("console");
  drawMonitorPageLinks();
  drawConsoleTabs();
  document.getElementById("mainDivInside").scrollTop= (0,20000);
}


