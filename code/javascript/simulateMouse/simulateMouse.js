function placeCursor(incoming) {
    var x=incoming['x'];
    var y=incoming['y'];
    var cursorContainer = createAndAddDiv("cursorContainer","cursorOverlay");
    cursorContainer.style.left = (x - 50)+"px";
    cursorContainer.style.top = (y - 50)+"px";
    cursorContainer.style.transform = "scale(1)";
    var cursorDiv = createAndAddElement("img","cursorDiv","cursorContainer");
    cursorDiv.src=window.config['domain']+window.config['packageFolder']+"/javascript/simulateMouse/cursor-512.png"

    var cursorHighlight = createAndAddDiv("cursorHighlight","cursorContainer");
    var circleDiv = createAndAddDiv("circleDiv","cursorOverlay");

}



function placeCursorOnDiv(divName){
    theseCoords=getDivPosition(divName,"mainDiv","none");
    placeCursor(theseCoords[0],theseCoords[1]);

}


function moveCursor(incoming) {
    endX=incoming['endX'];
    endY=incoming['endY'];
    time=incoming['time']*1000;
    d=incoming['delay']*1000;
    $("#cursorContainer").velocity({top:incoming['endY']-50,left:incoming['endX']-50},{duration:time,delay:d,queue:false});
}


function cursorDown(incoming) {
    mouseClickCircle(incoming);
    time=150;
    d=incoming['delay']*1000;
    $("#cursorContainer").velocity({scale:".4"},{duration:time,delay:d,queue:false});
    $("#cursorContainer").velocity({scale:"1"},{duration:time,delay:d+time,queue:false});
}

function mouseClickCircle(incoming){
    console.log("mouseClickCircle!!!!!!!!!!!!!!");
    time=150;
    d=incoming['delay']*1000;
    var xVal=incoming['position'][0]
    var yVal=incoming['position'][1]
    $("#circleDiv").velocity({left:xVal-25,top:yVal-25,opacity:"1",scale:"0"},{duration:0,delay:d,queue:false});
    $("#circleDiv").velocity({left:xVal-25,top:yVal-25,opacity:"0",scale:"4"},{duration:8*time,delay:d+time,queue:false});
}


function cursorDownDiv(incoming) {
    mouseClickCircleDiv(incoming);
    time=150;
    d=incoming['delay']*1000;
    $("#cursorContainer").velocity({scale:".4"},{duration:time,delay:d,queue:false,complete: function(elements) {playClickSound();}});
    $("#cursorContainer").velocity({scale:"1"},{duration:time,delay:d+time,queue:false});
}


function mouseClickCircleDiv(incoming){
    console.log("mouseDIVClickCircle!!!!!!!!!!!!!!");
    time=150;
    d=incoming['delay']*1000;
    theseCoords=getDivPosition(incoming["divName"],"mainDiv",incoming["anchor"]);

    var xVal=theseCoords[0]
    var yVal=theseCoords[1]
    $("#circleDiv").velocity({left:xVal-25,top:yVal-25,opacity:"1",scale:"0"},{duration:0,delay:d,queue:false});
    $("#circleDiv").velocity({left:xVal-25,top:yVal-25,opacity:"0",scale:"4"},{duration:8*time,delay:d+time,queue:false});
}



function moveCursorToDiv(incoming){
    var anchor=incoming['anchor'];
    var divName=incoming['divName'];
    if(anchor==undefined){anchor="none";}
    theseCoords=getDivPosition(divName,"mainDiv",anchor);

    var msg={}
    msg['endX']=theseCoords[0];
    msg['endY']=theseCoords[1];
    msg['time']=incoming['time'];
    msg['delay']=incoming['delay'];
    moveCursor(msg);
}


// function cursorDown(partialFunction,time) {
//     cursorDiv=document.getElementById("cursorDiv");
//     cursorDiv.style.transform = null;
//     cursorDiv.style.transition = time+"s linear";
//     cursorDiv.style.transform = "scale(.7)";
//     circleDiv.style.border = "5px solid red";
//     circleDiv.style.transform = "scale(.6)";
//     circleDiv.style.transition = time+"s linear";
//     cursorContainer.addEventListener('webkitTransitionEnd', function () {
//         this.removeEventListener('webkitTransitionEnd', arguments.callee, false);
//         if(partialFunction!=0){partialFunction();}
//         var thisFunction=partial(cursorUp,time);
//         setTimeout(thisFunction,0);
//     }, false);
// }

function cursorUp(time) {
    cursorDiv.style.transform = null;
    cursorDiv.style.transition = time+"s ease";
    cursorDiv.style.transform = "scale(1)";
    circleDiv.style.transition = time+"s ease";
    circleDiv.style.border = "1px solid transparent";
    circleDiv.style.transform = "scale(1)";
    cursorContainer.addEventListener('webkitTransitionEnd', function () {
        this.removeEventListener('webkitTransitionEnd', arguments.callee, false);
        var event3 = new CustomEvent("simulatedMouseClickDone", { "detail": "Simulated Mouse Click is Done" });
        cursorContainer.dispatchEvent(event3);
    }, false);
}




function getDivPosition(divName,relativeDiv,anchor){
    var dc=$("#"+divName)[0].getBoundingClientRect();
    var rdc=$("#"+relativeDiv)[0].getBoundingClientRect();
    var divLeft=dc['left']-rdc['left'];
    var divTop=dc['top']-rdc['top'];
    var divHeight=dc['bottom']-dc['top'];
    var divWidth=dc['right']-dc['left'];
    if(anchor=="south"){
        x=divLeft+divWidth/2;
        y=divTop+divHeight;
    }
    else if(anchor=="north"){
        x=divLeft+divWidth/2;
        y=divTop;
    }
    else if(anchor=="west"){
        x=divLeft;
        y=divTop+divHeight/2;
    }
    else if(anchor=="east"){
        x=divLeft+divWidth;
        y=divTop+divHeight/2;
    }
    else{
        x=divLeft+divWidth/2;
        y=divTop+divHeight/2;
    }
    return [x,y]
}

function getCursorPosition(){
    thisTransform=cursorContainer.style.transform;
    x=parseFloat(cursorContainer.style.transform.substring(thisTransform.indexOf("(")+1,thisTransform.indexOf(",")-2))+50;
    y=parseFloat(cursorContainer.style.transform.substring(thisTransform.indexOf(",")+1,thisTransform.indexOf(")")-2))+50;
    return [x,y]
}

function moveCursorToDivOLD(divName,time,anchor){
    if(anchor==undefined){anchor="none";}
    theseCoords=getDivPosition(divName,"mainDiv",anchor);
    moveCursor(theseCoords[0],theseCoords[1],time);
}


function loadClickSound(incoming){
    deleteDiv("clickMp3Div");
    var video = document.createElement('video');
    video.id = 'clickMp3Div';
    video.src = window.config['packageFolder']+'/javascript/simulateMouse/mouseClick.mp3';
    video.playbackRate = 1;
    video.height='0px';
    video.preload='auto'
    document.body.appendChild(video);
}


function playClickSound(){
    console.log("PLAYCLICK SOUNDS")
    document.getElementById("clickMp3Div").play();    
}
function clickCursor(partialFunction){
    setTimeout(cursorDown,0,partialFunction);
}


function drawCursorOverlay(incoming){
    var cursorOverlay = createAndAddDiv("cursorOverlay","mainDiv")
    cursorOverlay.style.zIndex = "599900";
}
function deleteCursorOverlay(incoming){
    deleteDiv("cursorOverlay");
}



function startMouseSequence(sequence,timeIn){
    totalTime=sequence[0][1];
    window.mouseSequenceIndex=0;
    if(timeIn>0){
        while(totalTime<=timeIn){
            if(sequence[window.mouseSequenceIndex][0]=="click"){
                sequence[window.mouseSequenceIndex][2]();
            }
            else if(sequence[window.mouseSequenceIndex][0]=="moveToDiv"){
                moveCursorToDiv(sequence[window.mouseSequenceIndex][2],0);
            }
            else if(sequence[window.mouseSequenceIndex][0]=="moveToPoint"){
                moveCursor(sequence[window.mouseSequenceIndex][2][0],sequence[window.mouseSequenceIndex][2][1],0);
            }
            window.mouseSequenceIndex=window.mouseSequenceIndex+1;    
            if(window.mouseSequenceIndex==sequence.length){
                break;
            }
            else{
                totalTime=totalTime+sequence[window.mouseSequenceIndex][1];
            }
        }
    }
    //console.log(totalTime);
    if(window.mouseSequenceIndex<sequence.length){
        denominator=sequence[window.mouseSequenceIndex][1]
        sequence[window.mouseSequenceIndex][1]=totalTime-timeIn;
        fraction=sequence[window.mouseSequenceIndex][1]/denominator;
        start=getCursorPosition();
        if(sequence[window.mouseSequenceIndex][0]=="moveToDiv"){
            end=getDivPosition(sequence[window.mouseSequenceIndex][2],"mainDiv");
            intermediateX=fraction*start[0]+(1-fraction)*end[0]
            intermediateY=fraction*start[1]+(1-fraction)*end[1]
            moveCursor(intermediateX,intermediateY,0);
        }
        else if(sequence[window.mouseSequenceIndex][0]=="moveToPoint"){
            end=sequence[window.mouseSequenceIndex][2];
            intermediateX=fraction*start[0]+(1-fraction)*end[0]
            intermediateY=fraction*start[1]+(1-fraction)*end[1]
            moveCursor(intermediateX,intermediateY,0);
        }
        performMouseSequenceEntry(sequence[window.mouseSequenceIndex],sequence)
    }
}


function nextMouseSequenceItem(sequence){
    window.mouseSequenceIndex=window.mouseSequenceIndex+1;
    if(window.mouseSequenceIndex<sequence.length){
        performMouseSequenceEntry(sequence[window.mouseSequenceIndex],sequence)
    }
}



function performMouseSequenceEntry(entry,sequence){
    if(entry[0]=="moveToPoint"){
        //[type,time,point]
        pf=partial(moveCursor,entry[2][0],entry[2][1],entry[1]/1000);
        setTimeout(pf,0);
        cursorContainer.addEventListener('simulatedMouseMoveDone', function () {
            this.removeEventListener('simulatedMouseMoveDone', arguments.callee, false);
            pf=partial(nextMouseSequenceItem,sequence);
            setTimeout(pf,0);
        }, false);
    }
    else if(entry[0]=="wait"){
        //[type,waitTime]
        pf=partial(nextMouseSequenceItem,sequence);
        setTimeout(pf,entry[1]);
    }
    else if(entry[0]=="click"){
        //[type,time,partialFunction]
        cursorDown(entry[2],entry[1]/2000);
        cursorContainer.addEventListener('simulatedMouseClickDone', function () {
            this.removeEventListener('simulatedMouseClickDone', arguments.callee, false);
            pf=partial(nextMouseSequenceItem,sequence);
            setTimeout(pf,0);
        }, false);
    }
    else if(entry[0]=="moveToDiv"){
        //[type,time,div]
        moveCursorToDiv(entry[2],entry[1]/1000);
        cursorContainer.addEventListener('simulatedMouseMoveDone', function () {
            this.removeEventListener('simulatedMouseMoveDone', arguments.callee, false);
            pf=partial(nextMouseSequenceItem,sequence);
            setTimeout(pf,0);
        }, false);
    }
}


function test(pin){
    console.log(pin);
}


