
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


function drawPageTabs(currentPage){
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
  clickButton("many","serverButton",goToPage,window.config['domain']+"/serverInfo.html");
  clickButton("many","monitorButton",goToPage,window.config['domain']+"/monitor.html");
  clickButton("many","consoleButton",goToPage,window.config['domain']+"/console.html");

  document.getElementById(currentPage+"Button").style.backgroundColor='rgba(0,255,0,.1)';
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



function goToPage(args){
  window.location.href=args[0];
}

