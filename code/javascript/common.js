var partial = function (func /*, 0..n args */) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
};


function runServerFunction(args){
    var message={"type":args[0]};
    sendMessage(message);
}


function hoverDiv(divId,incoming){
    var oldStyle=[]
    for(k in incoming){
        if(incoming[k]!=undefined){
            oldStyle[k]=document.getElementById(divId).style[k];
        }
        else{
            oldStyle[k]="";
        }
    }
    document.getElementById(divId).addEventListener("mouseover", function(){
        for(k in incoming){
            document.getElementById(divId).style[k]=incoming[k];
        }
    });
    document.getElementById(divId).addEventListener("mouseout", function(){
        for(k in incoming){
            document.getElementById(divId).style[k]=oldStyle[k];
        }
    });
}



function changeStyleIfDivExists(divid,incoming){
    var thisDiv=document.getElementById(divid);
    if(thisDiv!=null){
        for(k in incoming){
            thisDiv.style[k]=incoming[k];
        }        
    }
}

function hoverDivChangeOtherDiv(divIdHover,divIdChange,incoming){
    var oldStyle=[]
    for(k in incoming){
        if(incoming[k]!=undefined){
            oldStyle[k]=document.getElementById(divIdChange).style[k];
        }
        else{
            oldStyle[k]="";
        }
    }
    document.getElementById(divIdHover).addEventListener("mouseover", function(){
        for(k in incoming){
            document.getElementById(divIdChange).style[k]=incoming[k];
        }
    });
    document.getElementById(divIdHover).addEventListener("mouseout", function(){
        for(k in incoming){
            document.getElementById(divIdChange).style[k]=oldStyle[k];
        }
    });
}


//clickButton("many","makeChoiceButton",makeChoiceButtonClicked,27);
function clickButton(buttonType, divID, func) {
  var args = Array.prototype.slice.call(arguments,3);
  args.push("ClickEventHere")
  var thisDiv = document.getElementById(divID);
  thisDiv.addEventListener("click", function listener(e) {
    if (buttonType == "once") {
      thisDiv.removeEventListener("click", listener);
    }
    args[args.length-1]=e;
    var functionToRun = partial(func, args);
    functionToRun(e);
  });
}

function removeAllListeners(divID){
    var thisDiv = document.getElementById(divID);
    var clone = thisDiv.cloneNode();
    while (thisDiv.firstChild) {
        clone.appendChild(thisDiv.lastChild);
    }
    thisDiv.parentNode.replaceChild(clone,thisDiv);
}



function keyNameToKeyCode(keyName){
  //http://keycode.info/
  if(keyName=="left"){var keyCode=37;}
  else if(keyName=="right"){var keyCode=39;}
  else if(keyName=="up"){var keyCode=38;}
  else if(keyName=="down"){var keyCode=40;}
  else if(keyName=="w"){var keyCode=87;}
  else if(keyName=="y"){var keyCode=89;}
  else if(keyName=="return"){var keyCode=13;}
  else{var keyCode=-111111;}
  return keyCode
}

window.keyDownListeners=[]
function pressKey(buttonType,key,func) {
  removePressKeyListener(key);
  var keyCode=keyNameToKeyCode(key);
  var args = Array.prototype.slice.call(arguments,3);
  var functionToRun = partial(func,args);
  var removeListener = partial(removePressKeyListener,key);
  window.keyDownListeners[key]=function(e){
    if (event.keyCode == keyCode) {
        if (buttonType=="once"){removeListener();}
        functionToRun();
    }
  }
  document.addEventListener("keyup",window.keyDownListeners[key],false);
}

function removePressKeyListener(key) {
  document.removeEventListener("keyup",window.keyDownListeners[key]);
  delete window.keyDownListeners[key];
}

function simulateKeyPress(keyName){
    var event = document.createEvent('Event'); 
    event.initEvent('keyup', true, true); 
    event.keyCode = keyNameToKeyCode(keyName);     
    document.dispatchEvent(event);
}

function removeListeners(divID) {
    var element=document.getElementById(divID);
    var clone = element.cloneNode();
    while (element.firstChild) {
      clone.appendChild(element.lastChild);
    }
    element.parentNode.replaceChild(clone, element);
}

function refreshMyPage(){
    window.location.reload();
}

function refreshMyPageIn10(){
    setTimeout(refreshMyPage,10000);
}

function addParamToURL(incoming){
    insertParam(incoming['params']);
    // location.reload();
}

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function insertParam(params) {
        var varNewURL=document.location.search;
        console.log(varNewURL);
        for(var k=0;k<params.length;k++){
            var key = escape(params[k][0]); value = escape(params[k][1]);
            var kvp = varNewURL.substr(1).split('&');
            if (kvp == '') {
                varNewURL = '?' + key + '=' + value;
            }
            else {

                var i = kvp.length; var x; while (i--) {
                    x = kvp[i].split('=');

                    if (x[0] == key) {
                        x[1] = value;
                        kvp[i] = x.join('=');
                        break;
                    }
                }

                if (i < 0) { kvp[kvp.length] = [key, value].join('='); }

                //this will reload the page, it's likely better to store this until finished
                varNewURL = kvp.join('&');
            }
        }
        //document.location.search=varNewURL
        console.log(varNewURL);
        varNewURL="?subjectID=test1&viewType=instructions";
        window.history.pushState(null,null,window.location.pathname+"?"+varNewURL);
    }


function setQueryString(incoming){
    window.history.pushState(null,null,window.location.pathname+incoming['queryString']);
}

window.steepFunctionsToRunOnSuccessfulConnection=[];
function runOnSuccessfulConnection(func) {
    var args = Array.prototype.slice.call(arguments,1);
    var functionToRun = partial(func, args);
    window.steepFunctionsToRunOnSuccessfulConnection.push(functionToRun);
}

window.steepSocketConnected=false;
function confirmSuccessfulSTEEPconnection(){
    window.steepSocketConnected=true;
    for(k=0;k<window.steepFunctionsToRunOnSuccessfulConnection.length;k++){
        window.steepFunctionsToRunOnSuccessfulConnection[k]();
    } 
}


function isDivNotThere(divIN){
    var out=true;
    if(document.getElementById(divIN)!=null){
        out=false;
    }
    return out;
}


function divExists(divIN){
    var out=true;
    if(document.getElementById(divIN)==null){
        out=false;
    }
    return out;
}

function createDiv(id){
    deleteDiv(id);
    var thisDiv = document.createElement("div");
    thisDiv.id=id;
    return thisDiv;
}

function createAndAddDiv(newDivID,parentDivID){
    thisDiv=createAndAddElement("div",newDivID,parentDivID)
    return thisDiv;
}

function createAndAddElement(elementType,newElementID,parentElementID){
    //console.log(newDivID,parentDivID);
    deleteDiv(newElementID);
    var thisElement = document.createElement(elementType);
    if(newElementID!=""){
        thisElement.id=newElementID;
    }
    if(parentElementID=="body"){
        document.body.appendChild(thisElement);
    }
    else{
        document.getElementById(parentElementID).appendChild(thisElement);
    }
    return thisElement;

}




function deleteDiv(id){
    if(document.getElementById(id)!=null){
        var element = document.getElementById(id);
        element.parentNode.removeChild(element);
    }
}

function clearAll(){
    deleteDiv("mainDiv");
    var mainDiv=createDiv("mainDiv");
    $("body").prepend(mainDiv);
    var event = new Event('steepMainDivAdded');
    window.dispatchEvent(event);
}



function wakeUp(incoming){
}

function clickEvent(e) {
  // e = Mouse click event.
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX - rect.left; //x position within the element.
  var y = e.clientY - rect.top;  //y position within the element.
  return [x,y]
}


function placeTextOLD(divid,text,top,fontSize,color,fadeTime){
    thisDiv=createAndAddDiv(divid,"mainDiv");
    thisDiv.innerHTML=text;
    thisDiv.style.opacity="0";
    thisDiv.style.top=top+"px";
    thisDiv.style.width="100%";
    thisDiv.style.fontSize=fontSize+"%";
    thisDiv.style.textAlign="center";
    thisDiv.style.color=color;
    thisDiv.style.position="absolute";
    setTimeout(function(){
        document.getElementById(divid).style.opacity = "1";
        document.getElementById(divid).style.transition = "opacity "+fadeTime+"s ease";
    },50);
}

function placeTextNewButStillOld(incoming){
    if(incoming['divid']==undefined){
        incoming['divid']="randomDiv"+parseInt(Math.random()*10000000000);
    }
    if(incoming['top']==undefined){
        incoming['top']="0px";
    }
    if(incoming['fontSize']==undefined){
        incoming['fontSize']="";
    }
    if(incoming['width']==undefined){
        incoming['width']="100%";
    }
    if(incoming['textAlign']==undefined){
        incoming['textAlign']="center";
    }
    if(incoming['color']==undefined){
        incoming['color']="black";
    }
    if(incoming['fadeTime']==undefined){
        incoming['fadeTime']=".01";
    }
    if(incoming['height']==undefined){
        incoming['height']="";
    }
    if(incoming['lineHeight']==undefined){
        incoming['lineHeight']=incoming['height'];
    }
    if(incoming['backgroundColor']==undefined){
        incoming['backgroundColor']="";
    }
    if(incoming['parentDiv']==undefined){
        incoming['parentDiv']="mainDiv";
    }
    if(incoming['text']==undefined){
        incoming['text']="";
    }
    if(incoming['opacity']==undefined){
        incoming['opacity']="";
    }
    if(incoming['padding']==undefined){
        incoming['padding']="";
    }
    if(incoming['paddingLeft']==undefined){
        incoming['paddingLeft']="";
    }
    if(incoming['zIndex']==undefined){
        incoming['zIndex']="";
    }

    if(incoming['userSelect']==undefined){
        incoming['userSelect']="none";//none for no selection or all for easy selection
    }
    if(incoming['className']==undefined){
        incoming['className']="";//none for no selection or all for easy selection
    }


    var textDiv=createAndAddDiv(incoming["divid"],incoming['parentDiv']);
    textDiv.className=incoming["className"];
    textDiv.innerHTML=incoming['text'];
    textDiv.style.opacity="1";
    textDiv.style.top=incoming['top'];
    textDiv.style.width=incoming['width'];
    textDiv.style.height=incoming['height'];
    textDiv.style.lineHeight=incoming['lineHeight'];
    textDiv.style.fontSize=incoming['fontSize'];
    textDiv.style.left=incoming['left'];
    textDiv.style.textAlign=incoming["textAlign"];
    textDiv.style.color=incoming["color"];
    textDiv.style.position="absolute";
    textDiv.style.opacity=incoming["opacity"];
    textDiv.style.zIndex=incoming["zIndex"];
    textDiv.style.userSelect=incoming['userSelect'];
    if(incoming['borderLeft']!=undefined){
        textDiv.style.borderLeft=incoming['borderLeft'];
    }
    if(incoming['borderRight']!=undefined){
        textDiv.style.borderRight=incoming['borderRight'];
    }
    if(incoming['borderTop']!=undefined){
        textDiv.style.borderTop=incoming['borderTop'];
    }
    if(incoming['borderBottom']!=undefined){
        textDiv.style.borderBottom=incoming['borderBottom'];
    }
    if(incoming['border']!=undefined){
        textDiv.style.border=incoming['border'];
    }
    textDiv.style.paddingLeft=incoming['paddingLeft'];
    textDiv.style.padding=incoming['padding'];
    textDiv.style.backgroundColor=incoming['backgroundColor'];
}




function placeText(incoming){
    if(incoming['elementType']==undefined){
        incoming['elementType']="div";
    }
    if(incoming['divid']==undefined){
        incoming['divid']="randomDiv"+parseInt(Math.random()*10000000000);
    }
    if(incoming['parentDiv']==undefined){
        incoming['parentDiv']="mainDiv";
    }


    var textDiv=createAndAddElement(incoming['elementType'],incoming["divid"],incoming['parentDiv']);

    if(incoming['height']==undefined){
        incoming['height']="50px";
    }
    if(incoming['lineHeight']==undefined){
        incoming['lineHeight']=incoming['height'];
    }
    if(incoming['className']==undefined){
        incoming['className']="";//none for no selection or all for easy selection
    }
    if(incoming['text']==undefined){
        incoming['text']="";//none for no selection or all for easy selection
    }

    textDiv.className="placedText "+incoming["className"];
    textDiv.innerHTML=incoming['text'];

    var toNotSet=["text","className","parentDiv","divid"]
    for(var k in incoming){
        if(toNotSet.indexOf(k)==-1){
            textDiv.style[k]=incoming[k];
        }
    }
    return textDiv;
}



function makeTimePretty(timeIN,frequency=1000){
    var m=Math.floor(timeIN/60);
    var s=Math.floor(timeIN-m*60);
    var decimalsToShow=0
    if(frequency<1000 && frequency>=100){
        var decimalsToShow=1;
    }
    else if(frequency<100 && frequency>=10){
        var decimalsToShow=2;
    }
    else if(frequency<10){
        var decimalsToShow=3;
    }
    var d=(timeIN-60*m-s).toFixed(decimalsToShow);
    m=("0"+m).slice(-2);
    s=("0"+s).slice(-2)+d.slice(1);
    var pretty=m+":"+s;
    return pretty
}


window.timerCalls={};
function moveTimer(timerName,frequency=1000){
    clearTimeout(window.timerCalls[timerName]);
    var timerSeconds=window.timers[timerName]-((new Date()).getTime()-window.timers['timerCheck'])/1000;
    var pf = partial(moveTimer,timerName,frequency);
    if(timerSeconds>0){
        var pretty = makeTimePretty(timerSeconds,frequency);
        if(document.getElementById(timerName)!=null){
            document.getElementById(timerName).innerHTML=pretty;
            window.timerCalls[timerName]=setTimeout(pf,frequency);
        }
        else{
            window.timerCalls[timerName]=setTimeout(pf,10);
        }
    }
    else{
        if(document.getElementById(timerName)!=null){
            document.getElementById(timerName).innerHTML="0:00";
        }
    }
}

function stopTimer(timerName){
    clearTimeout(window.timerCalls[timerName]);
}

function genericScreen(message){
    clearAll();
    createAndAddDiv("genericScreen","mainDiv")
    createAndAddDiv("genericScreenInside","genericScreen")
    createAndAddDiv("genericScreenText","genericScreenInside")
    document.getElementById("genericScreenText").innerHTML=message;
    placeText({"text":window.state['subjectID'],"fontSize":"20px","top":"20px","left":"20px","width":"300px","textAlign":"left"});
    drawPermanentChatLink();
}


function multipleMessages(incoming){
    var messages=incoming['messages'];
    for(var messageNumber=0;messageNumber<messages.length;messageNumber++){
        var thisMessage=messages[messageNumber];
        messageManager(JSON.stringify(thisMessage));
    }
}

function copyObject(obj){
    var objectOut=JSON.parse(JSON.stringify(obj));
    return objectOut
}

function combineObjects(dict1,dict2){//dict1 has priority over dict2
    let this1=copyObject(dict1);
    let this2=copyObject(dict2);
    let output={}
    for(let k in this1){
        if(!(k in this2)){
            //add to final if in this1 but no this2
            output[k]=copyObject(this1[k]);
        }
        else{//key in both
            if((typeof this1[k]=="number" || typeof this1[k]=="string" || this1[k] instanceof Array) && (typeof this2[k]=="number" || typeof this2[k]=="string" || this2[k] instanceof Array)){
                output[k]=copyObject(this1[k]);//this 1 takes priority
            }
            else if(typeof this1[k]=="object" && typeof this2[k]=="object"){
                //both objects
                output[k]=combineObjects(this1[k],this2[k]);
            } 
            else{
                console.log("the following key is mixed with objects and strings and numbers")
                console.log(k)
            }
        }
    }
    for(let k in this2){
        if(!(k in this1)){
            //add to final if in this2 but no this1
            output[k]=copyObject(this2[k])
        }
    }
    return output
}


function alertBox(statement){
    if(typeof statement=="object"){
        var statement=statement[0];
    }
    placeText({"divid":"confirmationAlertBackgroud","top":"0px","left":"0px","width":"100%","height":"100%","backgroundColor":"rgba(0,0,0,.3)","zIndex":2147483648});
    placeText({"parentDiv":"confirmationAlertBackgroud","divid":"confirmationDiv","text":statement,"fontSize":"30px","lineHeight":"50px","height":"unset","padding":"50px","paddingBottom":"150px","top":"calc(25% - 150px)","left":"calc(50% - 300px)","width":"600px","backgroundColor":"rgba(255,255,255,1)","border":"5px solid black"});
    var alertBoxOK=placeText({"parentDiv":"confirmationDiv","divid":"confirmationDivButtonOK","text":"OK","fontSize":"26px","bottom":"25px","left":"225px","width":"150px","height":"75px","backgroundColor":"rgba(0,255,0,.1)","border":"5px solid rgba(0,255,0,.3)"});
    clickButton("many",alertBoxOK.id,alertBoxClose);
    hoverDivChangeOtherDiv("confirmationDivButtonOK","confirmationDivButtonOK",{"border":"5px solid green","backgroundColor":"rgba(0,255,0,.3)"})
}

function alertBoxClose(){
    deleteDiv("confirmationAlertBackgroud");
}


function confirmRunFunction(statement,func){
    var args = Array.prototype.slice.call(arguments,2);
    placeText({"divid":"confirmationAlertBackgroud","top":"0px","left":"0px","width":"100%","height":"100%","backgroundColor":"rgba(0,0,0,.3)","zIndex":2147483648});
    placeText({"parentDiv":"confirmationAlertBackgroud","divid":"confirmationDiv","text":statement,"fontSize":"30px","lineHeight":"50px","height":"unset","padding":"50px","paddingBottom":"150px","top":"calc(25% - 150px)","left":"calc(50% - 300px)","width":"600px","backgroundColor":"rgba(255,255,255,1)","border":"5px solid black"});
    placeText({"parentDiv":"confirmationDiv","divid":"confirmationDivButtonYes","text":"Yes","fontSize":"26px","bottom":"25px","left":"100px","width":"150px","height":"75px","backgroundColor":"rgba(0,255,0,.1)","border":"5px solid rgba(0,255,0,.3)"});
    placeText({"parentDiv":"confirmationDiv","divid":"confirmationDivButtonNo","text":"No","fontSize":"26px","bottom":"25px","left":"350px","width":"150px","height":"75px","backgroundColor":"rgba(255,0,0,.1)","border":"5px solid rgba(255,0,0,.3)"});
    // placeText({"parentDiv":"confirmationDiv","divid":"confirmationDivButtonNo","text":"No","fontSize":"20px","lineHeight":"50px","padding":"50px","top":"calc(25% - 150px)","left":"calc(50% - 300px)","width":"600px","height":"300px","backgroundColor":"rgba(255,255,255,1)"});
    hoverDivChangeOtherDiv("confirmationDivButtonYes","confirmationDivButtonYes",{"border":"5px solid green","backgroundColor":"rgba(0,255,0,.3)"})
    hoverDivChangeOtherDiv("confirmationDivButtonNo","confirmationDivButtonNo",{"border":"5px solid red","backgroundColor":"rgba(255,0,0,.3)"})
    clickButton("many","confirmationDiv",confirmRunFunctionButtonClick,func,args);
}

function confirmRunFunctionButtonClick(args){
    var functionRef=args[0];
    var functionArgs=args[1];
    var e=args[2];
    if (e.target !== e.currentTarget) {
        var clickedItem = e.target.id;
        if(clickedItem=="confirmationDivButtonYes"){
            deleteDiv("confirmationAlertBackgroud");
            functionRef(functionArgs);
        }
        else if(clickedItem=="confirmationDivButtonNo"){
            deleteDiv("confirmationAlertBackgroud");
        }
    }
}


function addOptionChoice(text,number,message){
    var divid="option"+number;
    placeText({"divid":divid,"text":text,"display":"inline-flex","position":"relative","parentDiv":"confirmationOptionsHolder","fontSize":"20px","lineHeight":"30px","height":"75px","padding":"0px","width":"150px","backgroundColor":"rgba(0,0,255,.1)","border":"3px solid blue","color":'blue',"marginRight":"25px","marginTop":"25px","overflowY":"scroll","justifyContent":"center","alignItems":"center","verticalAlign":"top"});
    hoverDivChangeOtherDiv(divid,divid,{"border":"3px solid blue","backgroundColor":"rgba(0,0,255,.2)"});
    msg={}
    msg['type']=message['name'];
    msg['choice']=text;
    clickButton("many",divid,confirmActionArgs,"Are you sure you want to select option '"+text+"'?",msg);
}

function confirmActionArgs(args){
    confirmAction(args[0],args[1]);
}

function chooseOptions(statement,message){
    var options=message['options'];
    placeText({"divid":"confirmationAlertBackgroud","top":"0px","left":"0px","width":"100%","height":"100%","backgroundColor":"rgba(0,0,0,.3)","zIndex":2147483648});
    placeText({"parentDiv":"confirmationAlertBackgroud","divid":"confirmationDiv","text":statement,"fontSize":"30px","lineHeight":"50px","height":"unset","padding":"50px","top":"calc(25% - 150px)","left":"calc(50% - 300px)","width":"600px","backgroundColor":"rgba(255,255,255,1)","border":"5px solid black"});
    placeText({"position":"relative","parentDiv":"confirmationDiv","divid":"confirmationOptionsHolder","fontSize":"30px","lineHeight":"50px","height":"unset","left":"0px","width":"530px","backgroundColor":"rgba(255,255,255,1)","textAlign":"left",});
    for(var k=0;k<options.length;k++){
        addOptionChoice(options[k],"_optionchoice"+k,message)
    } 
}

// setTimeout(function(){
// chooseOptions("test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 ",{"type":"testest2"},['opt1','opt2','opt3','opt4'])
// },200)


function confirmAction(statement,message){
    placeText({"divid":"confirmationAlertBackgroud","top":"0px","left":"0px","width":"100%","height":"100%","backgroundColor":"rgba(0,0,0,.3)","zIndex":2147483648});
    placeText({"parentDiv":"confirmationAlertBackgroud","divid":"confirmationDiv","text":statement,"fontSize":"30px","lineHeight":"50px","height":"unset","padding":"50px","paddingBottom":"150px","top":"calc(25% - 150px)","left":"calc(50% - 300px)","width":"600px","backgroundColor":"rgba(255,255,255,1)","border":"5px solid black"});
    placeText({"parentDiv":"confirmationDiv","divid":"confirmationDivButtonYes","text":"Yes","fontSize":"26px","bottom":"25px","left":"100px","width":"150px","height":"75px","backgroundColor":"rgba(0,255,0,.1)","border":"5px solid rgba(0,255,0,.3)"});
    placeText({"parentDiv":"confirmationDiv","divid":"confirmationDivButtonNo","text":"No","fontSize":"26px","bottom":"25px","left":"350px","width":"150px","height":"75px","backgroundColor":"rgba(255,0,0,.1)","border":"5px solid rgba(255,0,0,.3)"});
    // placeText({"parentDiv":"confirmationDiv","divid":"confirmationDivButtonNo","text":"No","fontSize":"20px","lineHeight":"50px","padding":"50px","top":"calc(25% - 150px)","left":"calc(50% - 300px)","width":"600px","height":"300px","backgroundColor":"rgba(255,255,255,1)"});
    hoverDivChangeOtherDiv("confirmationDivButtonYes","confirmationDivButtonYes",{"border":"5px solid green","backgroundColor":"rgba(0,255,0,.3)"})
    hoverDivChangeOtherDiv("confirmationDivButtonNo","confirmationDivButtonNo",{"border":"5px solid red","backgroundColor":"rgba(255,0,0,.3)"})
    clickButton("many","confirmationDiv",confirmationActionButtonClick,message);
}


function confirmActionText(statement,message){
    placeText({"divid":"confirmationAlertBackgroud","top":"0px","left":"0px","width":"100%","height":"100%","backgroundColor":"rgba(0,0,0,.3)","zIndex":2147483648});
    placeText({"parentDiv":"confirmationAlertBackgroud","divid":"confirmationDiv","text":statement,"fontSize":"30px","lineHeight":"50px","height":"400px","padding":"50px","paddingBottom":"150px","top":"calc(25% - 150px)","left":"calc(50% - 300px)","width":"600px","backgroundColor":"rgba(255,255,255,1)","border":"5px solid black"});
    placeText({"elementType":"textarea","parentDiv":"confirmationDiv","divid":"confirmationDivTextArea","text":"Enter Text Here","fontSize":"26px","bottom":"150px","left":"10%","width":"80%","height":"75px","backgroundColor":"rgba(0,255,0,.1)","border":"5px solid rgba(0,255,0,.3)"});
    placeText({"parentDiv":"confirmationDiv","divid":"confirmationDivButtonYes","text":"Yes","fontSize":"26px","bottom":"25px","left":"100px","width":"150px","height":"75px","backgroundColor":"rgba(0,255,0,.1)","border":"5px solid rgba(0,255,0,.3)"});
    placeText({"parentDiv":"confirmationDiv","divid":"confirmationDivButtonNo","text":"No","fontSize":"26px","bottom":"25px","left":"350px","width":"150px","height":"75px","backgroundColor":"rgba(255,0,0,.1)","border":"5px solid rgba(255,0,0,.3)"});
    // placeText({"parentDiv":"confirmationDiv","divid":"confirmationDivButtonNo","text":"No","fontSize":"20px","lineHeight":"50px","padding":"50px","top":"calc(25% - 150px)","left":"calc(50% - 300px)","width":"600px","height":"300px","backgroundColor":"rgba(255,255,255,1)"});
    hoverDivChangeOtherDiv("confirmationDivButtonYes","confirmationDivButtonYes",{"border":"5px solid green","backgroundColor":"rgba(0,255,0,.3)"})
    hoverDivChangeOtherDiv("confirmationDivButtonNo","confirmationDivButtonNo",{"border":"5px solid red","backgroundColor":"rgba(255,0,0,.3)"})
    clickButton("many","confirmationDiv",confirmationActionButtonClick,message);
}

function confirmationActionButtonClick(args){
    var e=args[args.length-1];
    var message=args[0];
    if(document.getElementById("confirmationDivTextArea")!=null && document.getElementById("confirmationDivTextArea").value!=undefined){
        message['confirmActionText']=document.getElementById("confirmationDivTextArea").value;
    }
    console.log(message)
    if (e.target !== e.currentTarget) {
        var clickedItem = e.target.id;
        if(clickedItem=="confirmationDivButtonYes"){
            deleteDiv("confirmationAlertBackgroud");
            sendMessage(message);   
        }
        else if(clickedItem=="confirmationDivButtonNo"){
            deleteDiv("confirmationAlertBackgroud");
        }
    }
//     e.stopPropagation();
}


function updateTimers(incoming){
  window.timers=incoming['timers'];
  if(window.timers==undefined){window.timers={};}
  window.timers['timerCheck']=(new Date()).getTime();
}


function messageManager(msg){
  var incoming = JSON.parse(msg);
  console.log(incoming['type'])
  window.state=incoming['status'];
  updateTimers(incoming);
  //http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
  window[incoming['type']](incoming);
}


//http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
function runFunctionFromString(functionName){
    if(typeof(window[functionName])==="function")
    {
      window[functionName]();
      return true;
    }      
    else{
      return false;
    }
}

function statusManager(){
  thisStatus=window.state;
  if(runFunctionFromString(thisStatus["page"])==false){
      if(thisStatus[0]==-1){
        message="Loading...";
        genericScreen(message);
      }
      else if(thisStatus["page"]=="generic"){
        clearAll();
        genericScreen(thisStatus["message"]);
      }
  }
}

function updateStatus(msg) {
    statusManager();
}


function camelCaseToRegular(string){
  string=string
    // insert a space before all caps
    .replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function(str){ return str.toUpperCase(); })
    return string
}

function clearSessionStorage(message){
    console.log("1.",sessionStorage);
    sessionStorage.clear()
    console.log("2.",sessionStorage);
}

function steepDisconnectClient(){
    sock.close();
}

//create mainDiv on new page.  
clearAll();

