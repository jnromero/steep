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
  var functionToRun = partial(func, args);
  var thisDiv = document.getElementById(divID);
  thisDiv.addEventListener("click", function listener(e) {
    if (buttonType == "once") {
      thisDiv.removeEventListener("click", listener);
    }
    functionToRun();
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
  if(keyName=="left"){var keyCode=37;}
  else if(keyName=="right"){var keyCode=39;}
  else if(keyName=="up"){var keyCode=38;}
  else if(keyName=="down"){var keyCode=40;}
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
    console.log("ref");
    window.location.reload();
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
    document.getElementById(parentElementID).appendChild(thisElement);
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
}


function wakeUp(incoming){
}

function placeTextOLD(divid,text,top,fontSize,color,fadeTime){
    console.log("Sdfsdf");
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
    if(incoming['divid']==undefined){
        incoming['divid']="randomDiv"+parseInt(Math.random()*10000000000);
    }
    if(incoming['parentDiv']==undefined){
        incoming['parentDiv']="mainDiv";
    }
    var textDiv=createAndAddDiv(incoming["divid"],incoming['parentDiv']);

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
}



function makeTimePretty(timeIN){
    var m=Math.floor(timeIN/60);
    var s=Math.floor(timeIN-m*60);
    var d=(timeIN-60*m-s).toFixed(0);
    m=("0"+m).slice(-2);
    s=("0"+s).slice(-2)+d.slice(1);
    var pretty=m+":"+s;
    return pretty
}


window.timerCalls={};
function moveTimer(timerName){
    clearTimeout(window.timerCalls[timerName]);
    var timerSeconds=window.timers[timerName]-((new Date()).getTime()-window.timers['timerCheck'])/1000;
    var pf = partial(moveTimer,timerName);
    if(timerSeconds>0){
        var pretty = makeTimePretty(timerSeconds);
        if(document.getElementById(timerName)!=null){
            document.getElementById(timerName).innerHTML=pretty;
            window.timerCalls[timerName]=setTimeout(pf,100);
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



function updateTimers(incoming){
  window.timers=incoming['timers'];
  if(window.timers==undefined){window.timers={};}
  window.timers['timerCheck']=(new Date()).getTime();
}


function messageManager(msg){
  var incoming = JSON.parse(msg);
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

mainDiv = createDiv("mainDiv");
$("body").prepend(mainDiv);
