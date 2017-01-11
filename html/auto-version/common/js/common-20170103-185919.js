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

function createDiv(id){
    deleteDiv(id);
    var thisDiv = document.createElement("div");
    thisDiv.id=id;
    return thisDiv;
}

function createAndAddDiv(newDivID,parentDivID){
    thisDiv=createAndAddElement("div",newDivID,parentDivID)
    // //console.log(newDivID,parentDivID);
    // deleteDiv(newDivID);
    // var thisDiv = document.createElement("div");
    // thisDiv.id=newDivID;
    // document.getElementById(parentDivID).appendChild(thisDiv);
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
    var title1 = document.createElement("a");
    title1.id=divid;
    title1.innerHTML=text;
    title1.style.opacity="0";
    title1.style.top=top+"px";
    title1.style.width="1280px";
    title1.style.fontSize=fontSize+"%";
    title1.style.textAlign="center";
    title1.style.color=color;
    title1.style.position="absolute";
    $("#mainDiv").append(title1);
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
            window.timerCalls[timerName]=setTimeout(pf,1000);
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
  eval(incoming['type']+'(incoming);');
}

function updateStatus(msg) {
    statusManager();
}


mainDiv = createDiv("mainDiv");
$("body").prepend(mainDiv);