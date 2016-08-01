var partial = function (func /*, 0..n args */) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
};


function refreshMyPage(){
    console.log("ref");
    window.location.reload();
}

function addParamToURL(incoming){
    insertParam(incoming['params']);
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
        varNewURL=document.location.search;
        for(k=0;k<params.length;k++){
            key = escape(params[k][0]); value = escape(params[k][1]);
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
        window.history.pushState(null,null,window.location.pathname+"?"+varNewURL);
    }



function isDivNotThere(divIN){
    out=true;
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

function deleteDiv(id){
    if(document.getElementById(id)!=null){
        var element = document.getElementById(id);
        element.parentNode.removeChild(element);
    }
}

function clearAll(){
    cursorDiv=document.getElementById("cursorOverlay");
    captionOverlay=document.getElementById("captionOverlay");
    deleteDiv("mainDiv");
    mainDiv=createDiv("mainDiv");
    $("body").prepend(mainDiv);
    $("#mainDiv").prepend(cursorDiv);
    $("#mainDiv").prepend(captionOverlay);
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

function moveTimer(timerName){
    timerSeconds=window.timers[timerName]-((new Date()).getTime()-window.timers['timerCheck'])/1000;
    var pf = partial(moveTimer,timerName);
    if(timerSeconds>0){
        var pretty = makeTimePretty(timerSeconds);
        if(document.getElementById(timerName)!=null){
            document.getElementById(timerName).innerHTML=pretty;
            setTimeout(pf,1000);
        }
        else{
            setTimeout(pf,10);
        }
    }
    else{
        if(document.getElementById(timerName)!=null){
            document.getElementById(timerName).innerHTML="0:00";
        }
    }
}



function genericScreen(message){
    var generic = document.createElement("div");
    generic.id = "genericScreen";
    var genericScreenInside = document.createElement("div");
    genericScreenInside.id = "genericScreenInside";
    var genericScreenText = document.createElement("div");
    genericScreenText.id = "genericScreenText";
    $("#mainDiv").append(generic);
    generic.appendChild(genericScreenInside);
    genericScreenInside.appendChild(genericScreenText);
    document.getElementById("genericScreenText").innerHTML=message;
}


function messageManager(msg){
  var incoming = JSON.parse(msg);
  window.state=incoming['status'];
  window.timers={};
  window.timers['timer']=incoming['timer'];
  window.timers['selfTimer']=incoming['selfTimer'];
  window.timers['timerCheck']=(new Date()).getTime();
  eval(incoming['type']+'(incoming);');
}

function updateStatus(msg) {
    statusManager();
}


mainDiv = createDiv("mainDiv");
$("body").prepend(mainDiv);

