
function drawServerInfo(){

  var incoming={
    "parentDiv":"mainDivInside",
    "divid":"serverInfoContainer",
    "fontSize":"300%",
    "color":"black",
    "height":"400px",
    "width":"750px",
    "left":"700px",
    "top":"350px",
    "top":"50px",
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
    "width":"1000px",
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
  for(var k=0;k<window.ipAddresses.length;k++){
    placeText({
      "parentDiv":"serverInfoContainer",
      "text":window.ipAddresses[k][1],
      "fontSize":"70%",
      "color":"black",
      "height":"50px",
      "width":"1000px",
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
    "width":"1000px",
    "left":"270px",
    "textAlign":"left",
    "top":(y)+"px",
  });

  y+=50;

  placeText({
    "parentDiv":"serverInfoContainer",
    "text":"Launcher String:",
    "fontSize":"70%",
    "color":"green",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":y+"px",
  });


  placeText({
    "parentDiv":"serverInfoContainer",
    "text":"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe -kiosk --no-default-browser-check --disk-cache-size=1 --media-cache-size=1 "+window['domain']+"/client.html",
    "fontSize":"20%",
    "color":"black",
    "height":"50px",
    "width":"1000px",
    "left":"270px",
    "textAlign":"left",
    "top":(y)+"px",
    "userSelect":"all",
  });
  y+=50;

  placeText({
    "parentDiv":"serverInfoContainer",
    "text":"Restart String:",
    "fontSize":"70%",
    "color":"green",
    "height":"50px",
    "width":"250px",
    "left":"0px",
    "textAlign":"right",
    "top":y+"px",
  });


  placeText({
    "parentDiv":"serverInfoContainer",
    "text":config['restartString'],
    "fontSize":"20%",
    "color":"black",
    "height":"50px",
    "width":"1000px",
    "left":"270px",
    "textAlign":"left",
    "top":(y)+"px",
    "userSelect":"all",
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
    "top":"0px",
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
    "width":"250px",
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
    "width":"1000px",
    "left":"270px",
    "textAlign":"left",
    "top":(y)+"px",
  });
  y+=33;
}
}





clearAll();
drawPageTabs("server");
drawMainDivInside();
drawServerInfo();
drawConfigInfo();
drawNewPageLinks();






