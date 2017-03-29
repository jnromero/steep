
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

function goToPageNewTab(args){
  window.open(args[0],"_blank");
}






function drawNewPageLinks(){
    placeText({
      "text":"New Page Links",
      "top":"225px",
      "left":"0px",
      "width":"100px",
      "height":"25px",
      "fontSize":"100%",
      "color":'black',
    });

    placeText({
      "text":"New Client",
      "divid":"clientButton",
      "top":"250px",
      "left":"0px",
      "width":"100px",
      "height":"50px",
      "fontSize":"125%",
      "color":'blue',
      "border":"1px solid rgba(0,0,0,.1)",
    });
    placeText({
      "text":"Video",
      "divid":"videoButton",
      "top":"300px",
      "left":"0px",
      "width":"100px",
      "height":"50px",
      "fontSize":"125%",
      "color":'blue',
      "border":"1px solid rgba(0,0,0,.1)",
    });
  clickButton("many","clientButton",goToPageNewTab,window.config['domain']+"/client.html");
  clickButton("many","videoButton",goToPageNewTab,window.config['domain']+"/video.html");
  var hoverInfo={"border":"1px solid blue","backgroundColor":"rgba(0,0,255,.2)"};
  hoverDiv("clientButton",hoverInfo)
  hoverDiv("videoButton",hoverInfo)
}




function drawPageTabs(){
    placeText({
      "text":"Server Links",
      "divid":"server2Button",
      "top":"25px",
      "left":"0px",
      "width":"100px",
      "height":"25px",
      "fontSize":"100%",
      "color":"black"
    });


    placeText({
      "text":"Server Info",
      "divid":"serverButton",
      "top":"50px",
      "left":"0px",
      "width":"100px",
      "height":"50px",
      "fontSize":"125%",
      "border":"1px solid rgba(0,0,0,.1)",
      "color":"green"
    });

    placeText({
      "text":"Monitor",
      "divid":"monitorButton",
      "top":"100px",
      "left":"0px",
      "width":"100px",
      "height":"50px",
      "fontSize":"125%",
      "border":"1px solid rgba(0,0,0,.1)",
      "color":"green"
    });

    placeText({
      "text":"Console",
      "divid":"consoleButton",
      "top":"150px",
      "left":"0px",
      "width":"100px",
      "height":"50px",
      //"backgroundColor":"rgba(0,255,0,.05)",
      "fontSize":"125%",
      "border":"1px solid rgba(0,0,0,.1)",
      "color":"green"
    });
  clickButton("many","serverButton",goToPage,window.config['domain']+"/console.html?serverPage=server");
  clickButton("many","monitorButton",goToPage,window.config['domain']+"/console.html?serverPage=monitor");
  clickButton("many","consoleButton",goToPage,window.config['domain']+"/console.html?serverPage=console");

  document.getElementById(window.serverPage+"Button").style.backgroundColor='rgba(0,255,0,.1)';
  var hoverInfo={"border":"1px solid green","backgroundColor":"rgba(0,255,0,.2)"};
  hoverDiv("serverButton",hoverInfo)
  hoverDiv("monitorButton",hoverInfo)
  hoverDiv("consoleButton",hoverInfo)

}


function drawMainDivInside(){
  placeText({
    "divid":"mainDivInside",
    "top":"0px",
    "left":"100px",
    "width":"1500px",
    "height":"901px",
    "border":"1px solid rgba(0,0,0,.1)",
  });
  document.getElementById("mainDivInside").style.overflowY = "scroll";
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
    clickButton("many","firstPageTab",goToPage,window.config['domain']+"/console.html?serverPage=console&page=1");
    clickButton("many","previousPageTab",goToPage,window.config['domain']+"/console.html?serverPage=console&page="+previousTab);
    clickButton("many","nextPageTab",goToPage,window.config['domain']+"/console.html?serverPage=console&page="+nextTab);
    clickButton("many","lastPageTab",goToPage,window.config['domain']+"/console.html?serverPage=console&page=current");
    var hoverInfo={"border":"1px solid blue","backgroundColor":"rgba(0,0,255,.2)"};
    hoverDiv("firstPageTab",hoverInfo)
    hoverDiv("previousPageTab",hoverInfo)
    hoverDiv("nextPageTab",hoverInfo)
    hoverDiv("lastPageTab",hoverInfo)


  // for(var k=0;k<window.totalPages;k++){
  //   var y=250+50*Math.floor(k/2);
  //   var x=50*(k%2);
  //   placeText({
  //     "divid":"tab"+(k+1),
  //     "text":k+1,
  //     "fontSize":"200%",
  //     "color":"blue",
  //     "top":y+"px",
  //     "left":x+"px",
  //     "width":"50px",
  //     "height":"50px",
  //     "border":"1px solid rgba(0,0,0,.1)"
  //   });
  //   clickButton("many","tab"+(k+1),goToPage,window.config['domain']+"/console.html?serverPage=console&page="+(k+1));
  // }
  // document.getElementById("tab"+(window.currentTab)).style.backgroundColor='rgba(0,0,255,.1)';
  // document.getElementById("mainDiv").style.overflowY = "scroll";
}


function goToPage(args){
  window.location.href=args[0];
}

var possiblePages=["server","monitor","console"];
if(possiblePages.indexOf(window.serverPage)<0){
  window.serverPage="server";
}

// drawPageTabs();
// drawMainDivInside();
// if(window.serverPage=="console"){
//   drawConsoleLines();
//   drawConsoleTabs();
//   document.getElementById("mainDivInside").scrollTop= (0,20000);
// }
// else if(window.serverPage=="server"){
//   drawServerInfo();
//   drawConfigInfo();
//   drawNewPageLinks();
// }


function tableUpdate(msg){
  clearAll();
  console.log("TABLE UPDATES@!!!!")
  window.serverStatus=msg['serverStatus'];
  window.lastTimeCheck=(new Date()).getTime();
  drawPageTabs();
  drawMainDivInside();
  if(window.serverPage=="console"){
    window.consoleLines=msg['consoleLines'];
    drawConsoleLines();
    drawConsoleTabs();
    document.getElementById("mainDivInside").scrollTop= (0,20000);
  }
  else if(window.serverPage=="server"){
    drawConfigInfo();
    drawNewPageLinks();
    drawServerInfo();
  }
  else if(window.serverPage=="monitor"){
    makeMonitorTable(msg);
    makeTaskTable(msg);
  }
}


