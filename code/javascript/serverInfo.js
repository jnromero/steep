
function drawServerInfo(){

  var incoming={
    "parentDiv":"mainDivInside",
    "divid":"serverInfoContainer",
    "fontSize":"300%",
    "color":"black",
    "height":"400px",
    "width":"750px",
    "left":"800px",
    "top":"275px",
    "backgroundColor":"white"
  };
  placeText(incoming);


  placeText({
    "parentDiv":"serverInfoContainer",
    "text":"Server Information",
    "color":"black",
    "height":"50px",
    "top":"0px",
  });


  placeText({
    "parentDiv":"serverInfoContainer",
    "text":"Python Version:",
    "fontSize":"70%",
    "color":"blue",
    "height":"50px",
    "width":"250px",
    "textAlign":"right",
    "top":"50px",
  });
  placeText({
    "parentDiv":"serverInfoContainer",
    "text":window.pythonVersion,
    "fontSize":"70%",
    "color":"black",
    "height":"50px",
    "left":"270px",
    "textAlign":"left",
    "top":"50px",
    "width":"unset",
  });

  placeText({
    "parentDiv":"serverInfoContainer",
    "text":"Python Executable:",
    "fontSize":"70%",
    "color":"blue",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":"100px",
  });

  placeText({
    "parentDiv":"serverInfoContainer",
    "text":window.pythonExecutable,
    "fontSize":"70%",
    "color":"black",
    "height":"50px",
    "width":"unset",
    "left":"270px",
    "textAlign":"left",
    "top":"100px",
  });

  placeText({
    "parentDiv":"serverInfoContainer",
    "text":"Server IP Address:",
    "fontSize":"70%",
    "color":"red",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":"150px",
  });


  var y=150;
  if(window.ipAddresses==undefined){window.ipAddresses=[["0","Error Getting IP (server is still running fine)"]];}
  for(var k=0;k<window.ipAddresses.length;k++){
    placeText({
      "parentDiv":"serverInfoContainer",
      "text":window.ipAddresses[k][1],
      "fontSize":"70%",
      "color":"black",
      "height":"50px",
      "width":"unset",
      "left":"270px",
      "textAlign":"left",
      "top":(y)+"px",
    });
    y+=50;
  }

  placeText({
    "parentDiv":"serverInfoContainer",
    "text":"Config IP Address:",
    "fontSize":"70%",
    "color":"red",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":y+"px",
  });

  placeText({
    "parentDiv":"serverInfoContainer",
    "text":window.config['domain'],
    "fontSize":"70%",
    "color":"black",
    "height":"50px",
    "width":"unset",
    "left":"270px",
    "textAlign":"left",
    "top":(y)+"px",
  });

  y+=50;


  placeText({
    "parentDiv":"mainDivInside",
    "divid":"mainInfoHolder",
    "height":"250px",
    "width":"100%",
    "top":"0px",
    "left":"0px",
    "overflow":"hidden",
    "backgroundColor":"rgba(255,0,0,.1)",
    });

  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"Launcher String:",
    "fontSize":"20px",
    "color":"green",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":25+"px",
  });

  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe -kiosk --no-default-browser-check --disk-cache-size=1 --media-cache-size=1 "+window.config['domain']+"/client.html",
    "fontSize":"20px",
    "color":"black",
    "height":"50px",
    "left":"270px",
    "whiteSpace":"nowrap",
    "overflow":"none",
    "width":"calc(100% - 270px)",
    "textAlign":"left",
    "top":25+"px",
    "userSelect":"text",
    "zIndex":"5",
  });
  y+=50;

  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"Restart String:",
    "fontSize":"20px",
    "color":"green",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":75+"px",
  });


  placeText({
    "parentDiv":"mainInfoHolder",
    "text":config['restartString'],
    "fontSize":"20px",
    "color":"black",
    "height":"50px",
    "width":"1000px",
    "left":"270px",
    "textAlign":"left",
    "top":75+"px",
    "userSelect":"text",
  });



  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"New Client Link:",
    "fontSize":"20px",
    "color":"green",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":125+"px",
  });


  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"<a href='"+config['domain']+"/client.html' target='_blank'>"+config['domain']+"/client.html</a>",
    "fontSize":"20px",
    "color":"black",
    "height":"50px",
    "width":"1000px",
    "left":"270px",
    "textAlign":"left",
    "top":125+"px",
    "userSelect":"text",
  });


  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"New Video Link:",
    "fontSize":"20px",
    "color":"green",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":175+"px",
  });


  placeText({
    "parentDiv":"mainInfoHolder",
    "text":"<a href='"+config['domain']+"/video.html'>"+config['domain']+"/video.html</a>",
    "fontSize":"20px",
    "color":"black",
    "height":"50px",
    "width":"1000px",
    "left":"270px",
    "textAlign":"left",
    "top":175+"px",
    "userSelect":"text",
  });



}



function Comparator(a, b) {
  if (a[0] < b[0]) return -1;
  if (a[0] > b[0]) return 1;
  return 0;
}

function drawConfigInfo(){
  placeText({
    "parentDiv":"mainDivInside",
    "divid":"configInfoContainer",
    "fontSize":"300%",
    "color":"black",
    "height":"800px",
    "width":"800px",
    "left":"00px",
    "top":"275px",
  });


  placeText({
    "parentDiv":"configInfoContainer",
    "text":"Config File Information",
    "color":"black",
    "height":"50px",
    "top":"0px",
  });

  y=50

  myArray=[]
  for(k in window.config){
    myArray.push([window.config[k].length,k,window.config[k]]);
  }
  myArray = myArray.sort(Comparator);

  var first=["location","currentExperiment","packageFolder","domain","webServerRoot","dataFolder","serverType"]
  var second=[]
  for(var k in window.config){
      if(first.indexOf(k)==-1){
        second.push(k)
      }
  }
  var all=first.concat(second);
  for(var k in myArray){
    thisColor="black"
    if(first.indexOf(myArray[k][1])>-1){
      thisColor="red";
    } 
    placeText({
    "parentDiv":"configInfoContainer",
    "text":myArray[k][1]+":",
    "fontSize":"25px",
    "color":"green",
    "height":"50px",
    "width":"300px",
    "left":"0px",
    "textAlign":"right",
    "top":y+"px",
  });

  placeText({
    "parentDiv":"configInfoContainer",
    "text":myArray[k][2],
    "fontSize":"25px",
    "color":thisColor,
    "height":"50px",
    "width":"unset",
    "left":"320px",
    "textAlign":"left",
    "top":(y)+"px",
  });
  y+=50;
}
}




function showServerInfo(msg){
  deleteDiv("monitorTableHolder")
  deleteDiv("taskTableHolder")
  deleteDiv("consoleLinesHolder")
  getMonitorTablesInfo(msg)
  drawPageTabs("server");
  drawMonitorPageLinks();
  drawConsoleTabs();
  drawServerInfo();
  drawConfigInfo();
}






