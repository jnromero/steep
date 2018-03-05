function startInstructions(incoming){
    clearAll();
    window.instructionIndex=0;
    window.elapsed=incoming['time']*1000+.0000001;
    window.startTime=(new Date()).getTime()-window.elapsed;
    doInstructions();
}

window.startTime=0;
window.elapsed=0;

function getQueryParameters() {
  var queryString = location.search.slice(1),
      params = {};

  queryString.replace(/([^=]*)=([^&]*)&*/g, function (_, key, value) {
    params[key] = value;
  });

  return params;
}


function setQueryParameters(params) {
  var query = [],
      key, value;

  for(key in params) {
    if(!params.hasOwnProperty(key)) continue;
    value = params[key];
    query.push(key + "=" + value);
  }

  history.pushState("","New Page Title",window.location.pathname+"?"+query.join("&"));
  //location.search = query.join("&");
}


function updateQueryParameters(param,value) {
    var params = getQueryParameters();
    if(params[param] != value) {
      params[param] = value;
      setQueryParameters(params);
    }

}

function pauseInstructions(){
    if(document.getElementById('videoHolder').paused==false){
        clearTimeout(window.nextInstructionTask);
        document.getElementById('videoHolder').pause(); 
        currentTime=document.getElementById("videoHolder").currentTime;
        updateQueryParameters("startTime",currentTime);
    }
    else{
        changeInstructionsTime(0);
    }
    drawInstructionsControls();
}

function loadInstructions(incoming){
    var video = document.createElement('video');
    video.id = 'videoHolder';
    video.src = incoming['source'];
    video.playbackRate = 1;
    video.height='0px';
    document.body.appendChild(video);
    // clearAll();
    // message="Loading Instructions...";
    // genericScreen(message);
    //statusManager();
}



function reloadInstructions(incoming){
    console.log("loadVideo");
    var video = document.createElement('video');
    video.id = 'videoHolder';
    video.src = incoming['source'];
    video.height='0px';
    document.body.appendChild(video);
    startInstructions(incoming);
}

function endInstructions(incoming){
    clearTimeout(window.nextInstructionTask);
    clearTimeout(window.moveInstructionsTimer);
    deleteDiv('videoHolder');
    deleteDiv('captions');
    deleteDiv('instructionsElapsed');
    deleteDiv("mainDiv");
    mainDiv=createDiv("mainDiv");
    $("body").prepend(mainDiv);
    statusManager();
}


function moveInstructions(){
    window.instructionDemoIndex=0;
    window.instructionInput=[[["w","w"],1,1,9],[["y","w"],1,1,8],[["y","y"],0,1,6],[["w","y"],0,1,7]];
    pf=partial(newPeriodTest);
    window.moveInstructions=setInterval(pf,10000);
}

function stopInstructions(){
    clearInterval(window.moveInstructions);
}

function changeCaptionBottom(value){
    document.getElementById("captions").style.bottom=value+"px";
    document.getElementById("instructionsElapsed").style.bottom=value+"px";
}


window.captionIndex=0;
function showCaptions(reloadType){
    if(document.getElementById('videoHolder')!=null){
        window.captionDiff=window.captions[window.captionIndex][2]-document.getElementById('videoHolder').currentTime;
    }
    else{
        window.captionDiff=0;
    }
    if(reloadType=="refresh"){
        window.captionDiff=0;
        thisCaptionTime=0;
        window.captionIndex=0;
        while(thisCaptionTime<window.elapsed){
            if(window.captions.length>window.captionIndex){
                thisCaptionTime=thisCaptionTime+window.captions[window.captionIndex][1]*1000;
                window.captionIndex=window.captionIndex+1;
                interval=thisCaptionTime-window.elapsed;
            }
            else{
                break;
            }
        }
        window.captionIndex=window.captionIndex-1;
    }
    else{
        window.captionIndex=window.captionIndex+1;
        if(window.captions.length>window.captionIndex){
            interval=window.captions[window.captionIndex][1]*1000;
        }
        else{
            interval=10000000000;
        }
    }

    if(document.getElementById("captionOverlay")==null){
        var captionOverlay = createDiv('captionOverlay');
        var mainDiv = document.getElementById("mainDiv");
        captionOverlay.style.width=mainDiv.style.width;
        var captions = createDiv('captions');
        captionOverlay.appendChild(captions);
        mainDiv.appendChild(captionOverlay);
    }
    else{
        var captions = document.getElementById("captions");
    }
    if(window.captions.length>window.captionIndex){
        captions.innerHTML=window.captions[window.captionIndex][0];
    }
    else{
        captions.innerHTML="Instructions Finished";        
    }
    //console.log(window.captionIndex,interval,window.captionDiff*1000);
    //console.log("nextCaption",interval+window.captionDiff*1000);
    setTimeout(showCaptions,interval+window.captionDiff*1000);
    drawElapsedTime();
}

function placeText(divid,text,top,fontSize,color,fadeTime,textAlign,left){
    var title1 = document.createElement("a");
    title1.id=divid;
    title1.innerHTML=text;
    title1.style.opacity="0";
    //title1.style.lineHeight="300px";
    title1.style.top=top+"px";
    title1.style.width="100%";
    title1.style.fontSize=fontSize+"%";
    title1.style.left=left;
    title1.style.textAlign=textAlign;
    title1.style.color=color;
    title1.style.position="absolute";
    $("#mainDiv").append(title1);
    setTimeout(function(){
        document.getElementById(divid).style.opacity = "1";
        document.getElementById(divid).style.transition = "opacity "+fadeTime+"s ease";
    },50);
}






function drawLogoVSEEL(){
    var logo = document.createElement("a");
    logo.id="vseelLogo";
    logo.style.opacity="0";
    letters=["","V","S","E","E","L"]
    for(k=1;k<=5;k++){
        var test = document.createElement("div");
        test.className="welcomeScreenTitle spin"+k+" animated"+k;
        test.innerHTML=letters[k];
        logo.appendChild(test);
    }
    placeText("we",logo.innerHTML,300,400,"rgba(0,0,100,1)",4,"center","0px");
}

function drawLogoESL(){
    var logo = document.createElement("a");
    logo.id="vseelLogo";
    logo.style.opacity="0";
    letters=["","E","S","L"]
    for(k=1;k<=3;k++){
        var test = document.createElement("div");
        test.className="welcomeScreenTitle spin"+k+" animated"+k;
        test.innerHTML=letters[k];
        logo.appendChild(test);
    }
    placeText("we",logo.innerHTML,300,400,"rgba(0,0,0,1)",4,"center","0px");
}



function highlightArea(divName,width,height,top,left,borderWidth,borderColor){
    thisDiv=createDiv(divName);
    thisDiv.className="highlightDiv";
    thisDiv.style.borderWidth=borderWidth+"px";
    thisDiv.style.borderColor=borderColor;
    thisDiv.style.width=width+"px";
    thisDiv.style.height=height+"px";
    thisDiv.style.top=top+"px";
    thisDiv.style.left=left+"px";
    $("#mainDiv").append(thisDiv);
}




//document.getElementById("mainDiv").addEventListener("click", displayDate);


function changeInstructionsTime(amount){
    newTime=document.getElementById("videoHolder").currentTime+amount
    var new_url = window.location.href.substring(0, window.location.href.indexOf('?'));
    window.location.href=new_url+"?startTime="+newTime
}


function moveForward5(){
    newTime=document.getElementById("videoHolder").currentTime+5
    var new_url = window.location.href.substring(0, window.location.href.indexOf('?'));
    window.location.href=new_url+"?startTime="+newTime
}

function moveBackward5(){
    newTime=document.getElementById("videoHolder").currentTime-5
    var new_url = window.location.href.substring(0, window.location.href.indexOf('?'));
    window.location.href=new_url+"?startTime="+newTime
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



function moveDivToHighZ(divName){
    document.getElementById(divName).style.zIndex = "3";
}

function moveDivToLowZ(divName){
    document.getElementById(divName).style.zIndex = "1";
}




function growDiv(divName,scale,origin,time){
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

function highlightText(divName,color,scale,time){
    document.getElementById(divName).style.fontSize=parseInt(scale*100)+"%";
    document.getElementById(divName).style.color=color;
    document.getElementById(divName).style.transition = time+"s ease-out";
}

function highlightDivBorder(divName,color,time,width){
    document.getElementById(divName).style.border=width+"px solid "+color;
    document.getElementById(divName).style.transition = time+"s ease-out";
}

function instructionHighlightArea(sx,sy,wx,wy){
    deleteDiv("instructionHighlight");
    if(wx>0){
        var title1 = document.createElement("a");
        title1.id="instructionHighlight";
        title1.style.top=sy+"px";
        title1.style.left=sx+"px";
        title1.style.width=wx+"px";
        title1.style.height=wx+"px";
        title1.style.border="10px solid blue";
        title1.style.position="absolute";
        title1.style.boxSizing = "border-box";
        title1.style.zIndex = "4";
        $("#mainDiv").append(title1);
    }
}




function getStartTime(){
    window.startTime=(new Date()).getTime();
}


function setInnerHtml(divIN,text){
  document.getElementById(divIN).innerHTML=text;
}


function evalStringAsFunction(incoming){
    var strings=incoming['strings'];
    for(k=0;k<strings.length;k++){
        eval(strings[k])();
    }
}

function getTask(reloadType){
    if(reloadType=="refresh"){
        thisTaskTime=0;
        thisTaskIndex=-1;
        tasksToRun=["startAudio"];
        while(thisTaskTime<window.elapsed){
            thisTaskIndex=thisTaskIndex+1;
            if(thisTaskIndex<window.instructionsList.length){
                thisTaskTime=thisTaskTime+window.instructionsList[thisTaskIndex][0];
                if(thisTaskTime>window.elapsed){
                    //console.log("refresh",thisTaskTime-window.elapsed);
                    window.nextInstructionTask=setTimeout(performTask,thisTaskTime-window.elapsed);
                    window.instructionIndex=thisTaskIndex;
                }
                else{
                    if(window.instructionsList[thisTaskIndex][3].indexOf("startMouseSequence")>-1){
                        window.instructionsList[thisTaskIndex][3]=window.instructionsList[thisTaskIndex][3].split("]],0)").join("]],10000000)");
                        //console.log(window.instructionsList[thisTaskIndex][3]);
                    }
                    if(window.instructionsList[thisTaskIndex][3]=="clearAll"){tasksToRun=["clearAll","startAudio"];}
                    else{tasksToRun.push(window.instructionsList[thisTaskIndex][3])}
                    //window.instructionsList[thisTaskIndex][1]();
                }
            }
            else{
                break;
            }
        }

        for(taskIndex=0;taskIndex<tasksToRun.length;taskIndex++){
            if(tasksToRun[taskIndex].indexOf("growDiv")>-1){
                thisIndex=tasksToRun[taskIndex].lastIndexOf(",");
                tasksToRun[taskIndex]=tasksToRun[taskIndex].substring(0,thisIndex)+",0)";
                //console.log(tasksToRun[k]);
            }   
            eval(tasksToRun[taskIndex])();
        }
    }
    else{
        //console.log(window.instructionsList[window.instructionIndex]);
        if(window.instructionIndex<window.instructionsList.length){
            window.nextInstructionTask=setTimeout(performTask,window.instructionsList[window.instructionIndex][0]+window.timeDiff*1000);
        }
    }
}

function performTask(){
    //console.log(window.state);
    if(document.getElementById('videoHolder')!=null){
        window.timeDiff=window.instructionsList[window.instructionIndex][2]/1000-document.getElementById('videoHolder').currentTime;
    }
    else{
        window.timeDiff=0;
    }
    //console.log(timeDiff);
    //console.log(window.instructionsList[window.instructionIndex]);
    window.instructionsList[window.instructionIndex][1]();
    window.instructionIndex=window.instructionIndex+1;
    getTask();
}

function drawElapsedTime(){
    if(document.getElementById("instructionsElapsed")==null){
        element = createDiv("instructionsElapsed");
        $("#captionOverlay").append(element);
    }
    else{
        element = document.getElementById("instructionsElapsed");
    }
    element.innerHTML=makeTimePretty(((new Date()).getTime()-window.startTime)/1000);
    window.moveInstructionsTimer=setTimeout(drawElapsedTime,100);
}

// video.currentTime=0;
// window.elapsed=0;

function startAudio(){
    var video=document.getElementById("videoHolder");
    video.currentTime = window.elapsed/1000;//msg['time']+((new Date()).getTime()-window.messageReceivedTime)/1000;
    //video.playbackRate = window.instructionSpeed;
    video.play();
    showCaptions("refresh");
}

function changeBackgroundColor(colorIN){
    document.getElementById("mainDiv").style.backgroundColor=colorIN;
}


function doInstructions(){
    getTask("refresh");
}


function updateStatusOnClient(){
    var message={"type":"updateStatusFromClient","status":window.state};
    sendMessage(message);
}

function updateStatus(incoming){
  //location.reload();
  window.state=incoming['status'];
  statusManager();
}


function moveInstructionsBackAndForth(event) {
  console.log(event.clientX);
  console.log($(window).width());

  if(event.clientY<100){
    pauseInstructions();
  }
  else{
    if(event.clientX<1*$(window).width()/6){
      changeInstructionsTime(-30);
    }
    else if(event.clientX<2*$(window).width()/6){
      changeInstructionsTime(-5);
    }
    else if(event.clientX<3*$(window).width()/6){
      changeInstructionsTime(-1);
    }
    else if(event.clientX<4*$(window).width()/6){
      changeInstructionsTime(1);
    }
    else if(event.clientX<5*$(window).width()/6){
      changeInstructionsTime(5);
    }
    else{
      changeInstructionsTime(30);
    }
  }
}
var pageName=location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
if(pageName=="instructions.html" || pageName=="instructions.py"){
    document.body.addEventListener("click",moveInstructionsBackAndForth);
    drawInstructionsControls();
}


function drawInstructionsControls(){
    controlsDiv=createDiv("controlsDiv");
    document.body.appendChild(controlsDiv);


    controlsDivButton=createDiv("controlsDivTitle");
    controlsDivButton.innerHTML="Click to move forward or backward.";
    controlsDiv.appendChild(controlsDivButton);


    controlsDivButton=createDiv("controlsDivButtonBack30");
    controlsDivButton.innerHTML="Back 30";
    controlsDivButton.className="controlsDivButton";
    controlsDivButton.style.left="0%";
    controlsDiv.appendChild(controlsDivButton);

    controlsDivButton=createDiv("controlsDivButtonBack5");
    controlsDivButton.innerHTML="Back 5";
    controlsDivButton.className="controlsDivButton";
    controlsDivButton.style.left="16.666666%";
    controlsDiv.appendChild(controlsDivButton);

    controlsDivButton=createDiv("controlsDivButtonBack1");
    controlsDivButton.innerHTML="Back 1";
    controlsDivButton.className="controlsDivButton";
    controlsDivButton.style.left="33.3333333%";
    controlsDiv.appendChild(controlsDivButton);


    controlsDivButton=createDiv("controlsDivButtonForward1");
    controlsDivButton.innerHTML="Forward 1";
    controlsDivButton.className="controlsDivButton";
    controlsDivButton.style.left="50%";
    controlsDiv.appendChild(controlsDivButton);

    controlsDivButton=createDiv("controlsDivButtonForward5");
    controlsDivButton.innerHTML="Forward 5";
    controlsDivButton.className="controlsDivButton";
    controlsDivButton.style.left="66.66666666%";
    controlsDiv.appendChild(controlsDivButton);

    controlsDivButton=createDiv("controlsDivButtonForward30");
    controlsDivButton.innerHTML="Forward 30";
    controlsDivButton.className="controlsDivButton";
    controlsDivButton.style.left="83.33333333%";
    controlsDiv.appendChild(controlsDivButton);

    controlsDivButton=createDiv("controlsDivButtonPause");
    controlsDivButton.innerHTML="Pause";
    controlsDivButton.style.left="0%";
    controlsDiv.appendChild(controlsDivButton);    
}

