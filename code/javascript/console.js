
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
        "parentDiv":"mainDivInside",
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
          "parentDiv":"mainDivInside",
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
      "parentDiv":"mainDivInside",
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
    "divid":"tab"+(k+1),
    "text":"Console Tabs",
    "fontSize":"100%",
    "color":"black",
    "top":225+"px",
    "left":0+"px",
    "width":"100px",
    "height":"25px",
  });


  placeText({
      "divid":"firstPageTab",
      "text":"First Page",
      "fontSize":"125%",
      "color":"blue",
      "top":250+"px",
      "left":0+"px",
      "width":"100px",
      "height":"50px",
      "border":"1px solid rgba(0,0,0,.1)"
    });


  placeText({
      "divid":"previousPageTab",
      "text":"Previous Page",
      "fontSize":"125%",
      "color":"blue",
      "top":300+"px",
      "left":0+"px",
      "width":"100px",
      "height":"50px",
      "border":"1px solid rgba(0,0,0,.1)"
    });


  placeText({
      "divid":"nextPageTab",
      "text":"Next Page",
      "fontSize":"125%",
      "color":"blue",
      "top":350+"px",
      "left":0+"px",
      "width":"100px",
      "height":"50px",
      "border":"1px solid rgba(0,0,0,.1)"
    });


  placeText({
      "divid":"lastPageTab",
      "text":"Last Page",
      "fontSize":"125%",
      "color":"blue",
      "top":400+"px",
      "left":0+"px",
      "width":"100px",
      "height":"50px",
      "border":"1px solid rgba(0,0,0,.1)"
    });

  placeText({
      "divid":"pagenumber",
      "text":"Page "+(window.currentTab)+" out of "+window.totalPages,
      "fontSize":"100%",
      "color":"black",
      "top":450+"px",
      "left":0+"px",
      "width":"100px",
      "height":"25px",
      // "border":"1px solid rgba(0,0,0,.1)"
    });


    var nextTab=Math.min(window.currentTab+1,window.totalPages);
    var previousTab=Math.max(window.currentTab-1,1);
    clickButton("many","firstPageTab",goToPage,window.config['domain']+"/console.html?page=1");
    clickButton("many","previousPageTab",goToPage,window.config['domain']+"/console.html?page="+previousTab);
    clickButton("many","nextPageTab",goToPage,window.config['domain']+"/console.html?page="+nextTab);
    clickButton("many","lastPageTab",goToPage,window.config['domain']+"/console.html?page=current");
    var hoverInfo={"border":"1px solid blue","backgroundColor":"rgba(0,0,255,.2)"};
    hoverDiv("firstPageTab",hoverInfo)
    hoverDiv("previousPageTab",hoverInfo)
    hoverDiv("nextPageTab",hoverInfo)
    hoverDiv("lastPageTab",hoverInfo)


}

function consoleLinesNoUpdate(msg){
  console.log("consoleLinesNoUpdate")
}

function consoleLinesUpdate(msg){
  console.log("update")
  clearAll();
  drawPageTabs("console");
  drawMainDivInside();
  window.consoleLines=msg['consoleLines'];
  drawConsoleLines();
  drawConsoleTabs();
  document.getElementById("mainDivInside").scrollTop= (0,20000);
}


