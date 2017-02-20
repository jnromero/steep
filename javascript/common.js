var partial = function (func /*, 0..n args */) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
};

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

function placeText(divid,text,top,fontSize,color,fadeTime){
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
}


function multipleMessages(incoming){
    var messages=incoming['messages'];
    for(var messageNumber=0;messageNumber<messages.length;messageNumber++){
        var thisMessage=messages[messageNumber];
        messageManager(JSON.stringify(thisMessage));
    }
}



function updateTimers(incoming){
  window.timers={};
  window.timers['timer']=incoming['timer'];
  window.timers['selfTimer']=incoming['selfTimer'];
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

function updateStatus(msg) {
    statusManager();
}


mainDiv = createDiv("mainDiv");
$("body").prepend(mainDiv);