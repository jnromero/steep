function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function loadInstructions(incoming){
    deleteDiv("audioHolder");
    var video = document.createElement('video');
    video.id = 'audioHolder';
    //random id avoids cache issues.
    video.src = incoming['source']+"?"+makeid(5);
    video.playbackRate = 1;
    video.height='0px';
    video.preload='auto'
    document.body.appendChild(video);
    loadClickSound();
}

function manualPlayInstructions(args){
    console.log("manualPlayInstructions")
    var promise = document.getElementById("audioHolder").play();
    if (promise) {
        //Older browsers may not return a promise, according to the MDN website
        promise.catch(function(error) { console.error(error); console.error(error.message); });
    }
}


function startAudio(incoming){
    clickButton("once","mainDiv",manualPlayInstructions);
    if(incoming['playbackRate']==undefined){incoming['playbackRate']=1;}
    document.getElementById("audioHolder").playbackRate = incoming['playbackRate'];
    document.getElementById("audioHolder").currentTime = incoming['currentTime']*document.getElementById("audioHolder").playbackRate;
    var promise = document.getElementById("audioHolder").play();
    if (promise) {
        //Older browsers may not return a promise, according to the MDN website
        promise.catch(function(error) { console.error(error); console.error(error.message); });
    }
}


function doNothing(){
    console.log("do Nothign");
}



function updateTimeAndAudio(incoming){
    if(incoming['elapsedTime']!=undefined){
        window.elapsed=incoming['elapsedTime'];
        window.lastCheck=(new Date()).getTime();
        document.getElementById("audioHolder").currentTime = window.elapsed*document.getElementById("audioHolder").playbackRate;
        clearTimeout(window.moveInstructionsTimer);
    }
}


function evalStringAsFunction(incoming){
    var strings=incoming['strings'];
    window.elapsed=incoming['elapsedTime'];
    window.lastCheck=(new Date()).getTime();
    document.getElementById("audioHolder").currentTime = window.elapsed*document.getElementById("audioHolder").playbackRate;
    for(var k=0;k<strings.length;k++){
        eval(strings[k])();
    }
    clearTimeout(window.moveInstructionsTimer);
}


function drawInstructionsTimer(incoming){
    window.thisTimerName=incoming['whichTimer'];
    element=createAndAddDiv(window.thisTimerName,"captionOverlay");
    element.className="instructionsElapsed";
}

function drawElapsedTime(){
    element=createAndAddDiv("instructionsElapsed","mainDiv");
    element.innerHTML=makeTimePretty(window.elapsed+((new Date()).getTime()-window.lastCheck)/1000);
    window.moveInstructionsTimer=setTimeout(drawElapsedTime,100);
}



function drawCaptionOverlay(incoming){
    var captionOverlay = createAndAddDiv('captionOverlay',"mainDiv");
    var captions = createAndAddDiv('captions',"captionOverlay");
}


function setCaptions(incoming){
    var captions=document.getElementById('captions');
    captions.innerHTML=incoming['caption'];
}

function resyncAudio(incoming){
    window.thisTimerName=incoming['whichTimer'];
    moveTimer(window.thisTimerName); 
    var currentTime=incoming['length']-window.timers[window.thisTimerName];
    if(isNaN(currentTime)){currentTime=0;}
    else if(currentTime<0){currentTime=0;}
    document.getElementById("audioHolder").currentTime = currentTime*document.getElementById("audioHolder").playbackRate;
}

function startInstructions(incoming){
    clearAllInstructions();
    window.instructionIndex=0;
    window.elapsed=incoming['time']*1000+.0000001;
    window.startTime=(new Date()).getTime()-window.elapsed;
    doInstructions();
}


function pauseInstructions(){
    document.getElementById('audioHolder').pause(); 
    stopTimer(window.thisTimerName);
}



////functions that are called from python:
function changeBackgroundColor(incoming){
    document.getElementById("mainDiv").style.backgroundColor=incoming['color'];
}

function placeTextINstructions(incoming){
    var textDiv=createAndAddDiv(incoming["divid"],"mainDiv")
    textDiv.innerHTML=incoming['text'];
    textDiv.style.opacity="0";
    textDiv.style.top=incoming['top']+"px";
    textDiv.style.width="100%";
    textDiv.style.fontSize=incoming['fontSize']+"%";
    textDiv.style.left=incoming['left']+"px";
    textDiv.style.textAlign=incoming["textAlign"];
    textDiv.style.color=incoming["color"];
    textDiv.style.position="absolute";
    setTimeout(function(){
        document.getElementById(incoming["divid"]).style.opacity = "1";
        document.getElementById(incoming["divid"]).style.transition = "opacity "+incoming["fadeTime"]+"s ease";
    },50);
}


function toggleOverlay(){
    if(document.getElementById("mainDivOverlay")!=null){
        var element = document.getElementById("mainDivOverlay");
        element.parentNode.removeChild(element);
    }
    else{
        var mainDivOverlay = document.createElement("div");
        mainDivOverlay.id = "mainDivOverlay";
        $("#mainDiv").append(mainDivOverlay);
    }
}


function clearAllInstructions(){
    var cursorDiv=document.getElementById("cursorOverlay");
    var captionOverlay=document.getElementById("captionOverlay");
    deleteDiv("mainDiv");
    var mainDiv=createDiv("mainDiv");
    $("body").prepend(mainDiv);
    $("#mainDiv").prepend(cursorDiv);
    $("#mainDiv").prepend(captionOverlay);
    var captions=document.getElementById('captions');
}


// function getQueryParameters() {
//   var queryString = location.search.slice(1),
//       params = {};

//   queryString.replace(/([^=]*)=([^&]*)&*/g, function (_, key, value) {
//     params[key] = value;
//   });

//   return params;
// }


// function setQueryParameters(params) {
//   var query = [],
//       key, value;

//   for(key in params) {
//     if(!params.hasOwnProperty(key)) continue;
//     value = params[key];
//     query.push(key + "=" + value);
//   }

//   history.pushState("","New Page Title",window.location.pathname+"?"+query.join("&"));
//   //location.search = query.join("&");
// }


// function updateQueryParameters(param,value) {
//     var params = getQueryParameters();
//     if(params[param] != value) {
//       params[param] = value;
//       setQueryParameters(params);
//     }

// }

// function pauseInstructions(){
//     if(document.getElementById('videoHolder').paused==false){
//         clearTimeout(window.nextInstructionTask);
//         document.getElementById('videoHolder').pause(); 
//         currentTime=document.getElementById("videoHolder").currentTime;
//         updateQueryParameters("startTime",currentTime);
//     }
//     else{
//         changeInstructionsTime(0);
//     }
//     drawInstructionsControls();
// }




// function reloadInstructions(incoming){
//     console.log("loadVideo");
//     var video = document.createElement('video');
//     video.id = 'videoHolder';
//     video.src = incoming['source'];
//     video.height='0px';
//     document.body.appendChild(video);
//     startInstructions(incoming);
// }

function endInstructions(incoming){
    clearTimeout(window.moveInstructionsTimer);
    deleteDiv('audioHolder');
    deleteDiv('clickMp3Div');
    deleteDiv('captionOverlay');
    deleteDiv('cursorOverlay');
    statusManager();
    // deleteDiv("mainDiv");
    // mainDiv=createDiv("mainDiv");
    // $("body").prepend(mainDiv);
    // statusManager();
}


function changeCaptionBottom(incoming){
    value=incoming['y'];
    document.getElementById("captionOverlay").style.bottom=value+"px";
    // document.getElementById("instructionsElapsed").style.bottom=value+"px";
}


// window.captionIndex=0;
// function showCaptions(reloadType){
//     if(document.getElementById('videoHolder')!=null){
//         window.captionDiff=window.captions[window.captionIndex][2]-document.getElementById('videoHolder').currentTime;
//     }
//     else{
//         window.captionDiff=0;
//     }
//     if(reloadType=="refresh"){
//         window.captionDiff=0;
//         thisCaptionTime=0;
//         window.captionIndex=0;
//         while(thisCaptionTime<window.elapsed){
//             if(window.captions.length>window.captionIndex){
//                 thisCaptionTime=thisCaptionTime+window.captions[window.captionIndex][1]*1000;
//                 window.captionIndex=window.captionIndex+1;
//                 interval=thisCaptionTime-window.elapsed;
//             }
//             else{
//                 break;
//             }
//         }
//         window.captionIndex=window.captionIndex-1;
//     }
//     else{
//         window.captionIndex=window.captionIndex+1;
//         if(window.captions.length>window.captionIndex){
//             interval=window.captions[window.captionIndex][1]*1000;
//         }
//         else{
//             interval=10000000000;
//         }
//     }

//     if(document.getElementById("captionOverlay")==null){
//         var captionOverlay = createDiv('captionOverlay');
//         var mainDiv = document.getElementById("mainDiv");
//         captionOverlay.style.width=mainDiv.style.width;
//         var captions = createDiv('captions');
//         captionOverlay.appendChild(captions);
//         mainDiv.appendChild(captionOverlay);
//     }
//     else{
//         var captions = document.getElementById("captions");
//     }
//     if(window.captions.length>window.captionIndex){
//         captions.innerHTML=window.captions[window.captionIndex][0];
//     }
//     else{
//         captions.innerHTML="Instructions Finished";        
//     }
//     //console.log(window.captionIndex,interval,window.captionDiff*1000);
//     //console.log("nextCaption",interval+window.captionDiff*1000);
//     setTimeout(showCaptions,interval+window.captionDiff*1000);
//     drawElapsedTime();
// }

// function placeText(divid,text,top,fontSize,color,fadeTime,textAlign,left){
//     var title1 = document.createElement("a");
//     title1.id=divid;
//     title1.innerHTML=text;
//     title1.style.opacity="0";
//     //title1.style.lineHeight="300px";
//     title1.style.top=top+"px";
//     title1.style.width="100%";
//     title1.style.fontSize=fontSize+"%";
//     title1.style.left=left;
//     title1.style.textAlign=textAlign;
//     title1.style.color=color;
//     title1.style.position="absolute";
//     $("#mainDiv").append(title1);
//     setTimeout(function(){
//         document.getElementById(divid).style.opacity = "1";
//         document.getElementById(divid).style.transition = "opacity "+fadeTime+"s ease";
//     },50);
// }






function drawLogoVSEEL(){
    logo=createAndAddElement("a","vseelLogo","mainDiv");
    letters=["","V","S","E","E","L"]
    for(var k=1;k<=5;k++){
        test=createAndAddElement("div","vseelLogoLetter"+k,"vseelLogo");
        test.className="welcomeScreenTitle spin"+k+" animated"+k;
        test.innerHTML=letters[k];
    }
}

function drawLogoESL(){
    logo=createAndAddElement("a","vseelLogo","mainDiv");
    letters=["","E","S","L"]
    for(k=1;k<=3;k++){
        test=createAndAddElement("div","vseelLogoLetter"+k,"vseelLogo");
        test.className="welcomeScreenTitle spin"+k+" animated"+k;
        test.innerHTML=letters[k];
    }
    // placeText("we",logo.innerHTML,300,400,"rgba(0,0,0,1)",4,"center","0px");
}



// function highlightArea(divName,width,height,top,left,borderWidth,borderColor){
//     thisDiv=createDiv(divName);
//     thisDiv.className="highlightDiv";
//     thisDiv.style.borderWidth=borderWidth+"px";
//     thisDiv.style.borderColor=borderColor;
//     thisDiv.style.width=width+"px";
//     thisDiv.style.height=height+"px";
//     thisDiv.style.top=top+"px";
//     thisDiv.style.left=left+"px";
//     $("#mainDiv").append(thisDiv);
// }




// //document.getElementById("mainDiv").addEventListener("click", displayDate);





// function moveDivToHighZ(divName){
//     document.getElementById(divName).style.zIndex = "3";
// }

// function moveDivToLowZ(divName){
//     document.getElementById(divName).style.zIndex = "1";
// }




function highlightDiv(incoming){
    var divName=incoming['divName'];
    document.getElementById(divName).style.zIndex = "3";
}

function unHighlightDiv(incoming){
    var divName=incoming['divName'];
    document.getElementById(divName).style.zIndex = null;
}



function growDiv(divName,scale,origin,time){
    document.getElementById(divName).style.zIndex = "99999999";
    document.getElementById(divName).style.transform += " scale("+scale+")";
    document.getElementById(divName).style.transition = time+"s ease-out";
    document.getElementById(divName).style.transformOrigin = origin;
}

function growDiv(divName,scale,origin,time){
    document.getElementById(divName).style.zIndex = null;
    document.getElementById(divName).style.transform += null;
    document.getElementById(divName).style.transition = time+"s ease-out";
    document.getElementById(divName).style.transformOrigin = origin;
}


function growDivOLD(divName,scale,origin,time){
    if(document.getElementById(divName).style.transform.indexOf("scale("+scale+")")>-1){
        document.getElementById(divName).style.zIndex = "1";
        document.getElementById(divName).style.transform=document.getElementById(divName).style.transform.replace("scale("+scale+")","");
    }
    else{
        document.getElementById(divName).style.zIndex = "3";
        document.getElementById(divName).style.transform += " scale("+scale+")";
    }

    document.getElementById(divName).style.transition = time+"s ease-out";
    document.getElementById(divName).style.transformOrigin = origin;
}

// function highlightText(divName,color,scale,time){
//     document.getElementById(divName).style.fontSize=parseInt(scale*100)+"%";
//     document.getElementById(divName).style.color=color;
//     document.getElementById(divName).style.transition = time+"s ease-out";
// }

// function highlightDivBorder(divName,color,time,width){
//     document.getElementById(divName).style.border=width+"px solid "+color;
//     document.getElementById(divName).style.transition = time+"s ease-out";
// }

// function instructionHighlightArea(sx,sy,wx,wy){
//     deleteDiv("instructionHighlight");
//     if(wx>0){
//         var title1 = document.createElement("a");
//         title1.id="instructionHighlight";
//         title1.style.top=sy+"px";
//         title1.style.left=sx+"px";
//         title1.style.width=wx+"px";
//         title1.style.height=wx+"px";
//         title1.style.border="10px solid blue";
//         title1.style.position="absolute";
//         title1.style.boxSizing = "border-box";
//         title1.style.zIndex = "4";
//         $("#mainDiv").append(title1);
//     }
// }




// function getStartTime(){
//     window.startTime=(new Date()).getTime();
// }


// function setInnerHtml(divIN,text){
//   document.getElementById(divIN).innerHTML=text;
// }





// function updateStatusOnClient(){
//     var message={"type":"updateStatusFromClient","status":window.state};
//     sendMessage(message);
// }





function drawInstructionsControls(){
    controlsDiv=createDiv("controlsDiv");
    document.body.appendChild(controlsDiv);


    controlsDivButton=createDiv("controlsDivTitle");
    controlsDivButton.innerHTML="Click to move forward or backward.";
    controlsDiv.appendChild(controlsDivButton);


    changeInstructionsTime
    controlsDivButtonBack30=createAndAddDiv("controlsDivButtonBack30","controlsDivTitle")
    controlsDivButtonBack30.innerHTML="Back 30";
    controlsDivButtonBack30.className="controlsDivButton";
    controlsDivButtonBack30.style.left="0%";
    clickButton("many","controlsDivButtonBack30",changeInstructionsTime,-30);

    controlsDivButtonBack5=createAndAddDiv("controlsDivButtonBack5","controlsDivTitle")
    controlsDivButtonBack5.innerHTML="Back 5";
    controlsDivButtonBack5.className="controlsDivButton";
    controlsDivButtonBack5.style.left="16.666666%";
    clickButton("many","controlsDivButtonBack5",changeInstructionsTime,-5);

    controlsDivButtonBack1=createAndAddDiv("controlsDivButtonBack1","controlsDivTitle")
    controlsDivButtonBack1.innerHTML="Back 1";
    controlsDivButtonBack1.className="controlsDivButton";
    controlsDivButtonBack1.style.left="33.3333333%";
    clickButton("many","controlsDivButtonBack1",changeInstructionsTime,-1);


    controlsDivButtonForward1=createAndAddDiv("controlsDivButtonForward1","controlsDivTitle")
    controlsDivButtonForward1.innerHTML="Forward 1";
    controlsDivButtonForward1.className="controlsDivButton";
    controlsDivButtonForward1.style.left="50%";
    clickButton("many","controlsDivButtonForward1",changeInstructionsTime,1);

    controlsDivButtonForward5=createAndAddDiv("controlsDivButtonForward5","controlsDivTitle")
    controlsDivButtonForward5.innerHTML="Forward 5";
    controlsDivButtonForward5.className="controlsDivButton";
    controlsDivButtonForward5.style.left="66.66666666%";
    clickButton("many","controlsDivButtonForward5",changeInstructionsTime,5);

    controlsDivButtonForward30=createAndAddDiv("controlsDivButtonForward30","controlsDivTitle")
    controlsDivButtonForward30.innerHTML="Forward 30";
    controlsDivButtonForward30.className="controlsDivButton";
    controlsDivButtonForward30.style.left="83.33333333%";
    clickButton("many","controlsDivButtonForward30",changeInstructionsTime,30);

    controlsDivButtonPause=createAndAddDiv("controlsDivButtonPause","controlsDivTitle")
    controlsDivButtonPause.innerHTML="Pause";
    controlsDivButtonPause.style.left="0%";
    clickButton("many","controlsDivButtonPause",toggleInsructionsPauseOnClient);//this pauses

    // document.body.addEventListener("click",moveInstructionsBackAndForth);
    // drawInstructionsControls();

}


function toggleInsructionsPauseOnClient(){
  msg={'type':"toggleInsructionsPauseOnClient"};
  sock.send(JSON.stringify(msg));
}

function changeInstructionsTime(args){
  var amount=args[0];
  msg={'type':"changeInstructionsTime",'amount':amount};
  sock.send(JSON.stringify(msg));
}




