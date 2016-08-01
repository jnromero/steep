var partial = function (func /*, 0..n args */ ) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
};



function placeCursor(x, y) {
    var cursorContainer = document.createElement("div");
    cursorContainer.id = "cursorContainer";
    cursorContainer.style.transform = "translate(" + (x - 50) + "px," + (y - 50) + "px)";
    $("#cursorOverlay").append(cursorContainer);

    var circleDiv = document.createElement("div");
    circleDiv.id = "circleDiv";
    cursorContainer.appendChild(circleDiv);
    circleDiv.style.transform = "scale(.2)";


    var cursorDiv = document.createElement("img");
    cursorDiv.id = "cursorDiv";
    cursorDiv.src = "https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/512/cursor.png";
    cursorDiv.src = "/Experiments/common/javascript/simulateMouse/cursor-512.png";
    cursorDiv.src=window.config['domain']+window.config['packageFolder']+"/javascript/simulateMouse/cursor-512.png"
    console.log(cursorDiv.src);
    //https://www.iconfinder.com/icons/307560/arrow_cursor_mouse_pointer_up_icon
    cursorContainer.appendChild(cursorDiv);
}

function placeCursorOnDiv(divName){
    theseCoords=getDivPosition(divName,"mainDiv","none");
    placeCursor(theseCoords[0],theseCoords[1]);

}

// function setCursor() {
//     cursorContainer.style.backgroundColor = "transparent";
//     window.mouseMovesIndex = window.mouseMovesIndex + 1;
//     if (window.mouseMovesIndex < window.mouseMoves.length) {
//         setTimeout(moveCursor, 0);
//     }
// }


function moveCursor(endX,endY,time) {
    circleDiv.style.transform = null;
    circleDiv.style.transition = time+"s linear";
    cursorContainer.style.transition = time + "s ease";
    cursorContainer.style.transform = "translate(" + (endX - 50) + "px," + (endY - 50) + "px)";
    cursorContainer.addEventListener('webkitTransitionEnd', function () {
        this.removeEventListener('webkitTransitionEnd', arguments.callee, false);
        var e = new CustomEvent("simulatedMouseMoveDone", { "detail": "Simulated Mouse Move is Done" });
        cursorContainer.dispatchEvent(e);
    },false);

}




function cursorDown(partialFunction,time) {
    cursorDiv=document.getElementById("cursorDiv");
    cursorDiv.style.transform = null;
    cursorDiv.style.transition = time+"s linear";
    cursorDiv.style.transform = "scale(.7)";
    circleDiv.style.border = "5px solid red";
    circleDiv.style.transform = "scale(.6)";
    circleDiv.style.transition = time+"s linear";
    cursorContainer.addEventListener('webkitTransitionEnd', function () {
        this.removeEventListener('webkitTransitionEnd', arguments.callee, false);
        if(partialFunction!=0){partialFunction();}
        var thisFunction=partial(cursorUp,time);
        setTimeout(thisFunction,0);
    }, false);
}

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
    anchor="none";
    if(anchor=="south"){
        y=$("#"+divName).offset()["top"]-$("#"+relativeDiv).offset()["top"]+$("#"+divName).height();
        x=$("#"+divName).offset()["left"]-$("#"+relativeDiv).offset()["left"]+$("#"+divName).width()/2;
    }
    else if(anchor=="north"){
        y=$("#"+divName).offset()["top"];
        x=$("#"+divName).offset()["left"]-$("#"+relativeDiv).offset()["left"]+$("#"+divName).width()/2;
    }
    else if(anchor=="west"){
        y=$("#"+divName).offset()["top"]-$("#"+relativeDiv).offset()["top"]+$("#"+divName).height()/2;
        x=$("#"+divName).offset()["left"]-$("#"+relativeDiv).offset()["left"];
    }
    else if(anchor=="east"){
        y=$("#"+divName).offset()["top"]-$("#"+relativeDiv).offset()["top"]+$("#"+divName).height()/2;
        x=$("#"+divName).offset()["left"]+$("#"+divName).width();
    }
    else{
        y=$("#"+divName).offset()["top"]-$("#"+relativeDiv).offset()["top"]+$("#"+divName).height()/2;
        x=$("#"+divName).offset()["left"]-$("#"+relativeDiv).offset()["left"]+$("#"+divName).width()/2;
    }
    //console.log(anchor,"sdfsdf",[x,y]);
    return [x,y]
}

function getCursorPosition(){
    thisTransform=cursorContainer.style.transform;
    x=parseFloat(cursorContainer.style.transform.substring(thisTransform.indexOf("(")+1,thisTransform.indexOf(",")-2))+50;
    y=parseFloat(cursorContainer.style.transform.substring(thisTransform.indexOf(",")+1,thisTransform.indexOf(")")-2))+50;
    return [x,y]
}

function moveCursorToDiv(divName,time,anchor){
    if(anchor==undefined){anchor="none";}
    theseCoords=getDivPosition(divName,"mainDiv",anchor);
    moveCursor(theseCoords[0],theseCoords[1],time);
}


function clickCursor(partialFunction){
    setTimeout(cursorDown,0,partialFunction);

}


function drawCursorOverlay(){
    var cursorOverlay = createDiv("cursorOverlay");
    cursorOverlay.style.zIndex = "599900";
    $("#mainDiv").append(cursorOverlay);
}


function startMouseSequenceOLD(sequence,timeIn){
    window.mouseSequenceIndex=0;
    totalTime=0
    k=0
    if(timeIn>0){
        while(totalTime<timeIn){
            totalTime=totalTime+sequence[k][1];
            k=k+1;
            timeIn=timeIn+1;
            if(k==sequence.length){
                totalTime=timeIn+1;
            }
        }
        k=k-1;
        for(j=0;j<k;j++){
            sequence[j][1]=0.1;
        }
        sequence[k][1]=totalTime-timeIn;
    }
    performMouseSequenceEntry(sequence[window.mouseSequenceIndex],sequence)
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


// drawCursorOverlay();
// placeCursor(00,0);
// sequence=[
//     ["wait",1000],
//     ["moveToPoint",5000,[800,800]],
//     ["moveToDiv",2000,"mainDiv"],
//     ["moveToPoint",1000,[500,400]],
//     ["click",400,partial(test,"tes12t")],
//     ["wait",1000],
//     ["moveToPoint",1000,[500,700]],
//     ["moveToPoint",2000,[600,700]],
//     ["click",400,partial(test,"tes22t")],
//     ["wait",1000],
//     ["moveToPoint",2000,[500,700]],
//     ["moveToPoint",1000,[600,700]],
//     ["click",400,partial(test,"tes32t")],
//     ["wait",1000],
//     ["moveToPoint",200,[500,700]],
//     ["moveToPoint",200,[600,700]],
//     ["click",400,partial(test,"tes42t")],
//     ["wait",1000],
//     ["moveToPoint",200,[600,400]],
//     ["click",400,partial(test,"tes52t")],
//     ["wait",1000],
//     ["moveToPoint",200,[800,700]],
//     ["click",400,partial(test,"tes62t")],
// ]

//moveCursor(400,100,10000);
//moveCursor(200,200,1000);
// //moveCursor(640,512,10000);
// theseCoords=getDivPosition("mainDiv","mainDiv");
// moveCursor(theseCoords[0],theseCoords[1],1);
//moveCursorToDiv("mainDiv",0);
// pf=partial(moveCursor,40,40,3);
// // pf();
// setTimeout(pf,1000);

//startMouseSequence(sequence,9399);



// startMouseSequence([["wait",100],["moveToPoint",2000,[600,700]]],0);
