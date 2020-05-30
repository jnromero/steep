

function drawPermanentChatLink(){
  placeText({"divid":"permanentChatLink","position":"absolute","border":"2px solid transparent","top":"0px","right":"0px","width":"60px","height":"60px","textAlign":"center","lineHeight":"60px","text":"&quest;","color":"rgba(0, 155, 0, 1)","fontSize":"2rem","zIndex":2147483648});
  placeText({"divid":"permanentChatLinkUnread","position":"absolute","top":"10px","right":"10px","width":"200px","height":"50px","textAlign":"center","lineHeight":"50px","text":"Unread Message!","color":"rgba(0, 155, 0, 1)","fontSize":"1.5rem","display":"none","zIndex":2147483648,"className":"highlightUnreadChatTitle"});
  placeText({"divid":"permanentChatLinkDescription","position":"absolute","top":"0px","right":"10px","width":"300px","height":"calc(5rem + 50px)","textAlign":"center","text":"Click the question mark to ask a question at any point during experiment.","color":"rgba(0, 155, 0, 1)","fontSize":"1rem","zIndex":2147483648,"backgroundColor":"transparent","lineHeight":"1.5rem","padding":"1rem","paddingTop":"calc(1rem + 50px)","transition":".2s ease"});

  var thisElement=document.getElementById("permanentChatLinkDescription");
  document.getElementById("permanentChatLink").style.backgroundColor="rgba(222,255,222,1)";
  thisElement.onmouseover = function(){
    thisElement.style.top="calc(-5rem - 50px)";
    console.log(thisElement.style.top)
    thisElement.onmouseover=null;
    document.getElementById("permanentChatLink").style.backgroundColor="transparent";
    hoverDivChangeOtherDiv("permanentChatLinkDescription","permanentChatLinkDescription",{"top":"0px",})
    hoverDivChangeOtherDiv("permanentChatLink","permanentChatLinkDescription",{"top":"0px",})
  };

  clickButton("many","permanentChatLink",getChatHistory);
  clickButton("many","permanentChatLinkUnread",getChatHistory);
  clickButton("many","permanentChatLinkDescription",getChatHistory);
  drawUnreadNotification();
}


window.steepFlashPagetitleNow=0;
function flashUnreadChatInPageTitle(){
  if(document.title.indexOf("Unread")>-1){
    document.title=document.title.replace("Unread Message! - ", "");
  }
  else{
    document.title="Unread Message! - "+document.title;
  }

  if(window.steepFlashPagetitleNow==1){
    setTimeout(flashUnreadChatInPageTitle,1000);
  }
  else{
    document.title=document.title.replace("Unread Message! - ", "");
  }
}


function drawUnreadNotification(){
  if(window.recentChatInfo!=undefined){
    if(window.recentChatInfo["unread"].length>0){
        window.steepFlashPagetitleNow=1;
        flashUnreadChatInPageTitle();
        changeStyleIfDivExists("permanentChatLinkUnread",{"display":"block"});
        changeStyleIfDivExists("permanentChatLink",{"display":"none"});
        changeStyleIfDivExists("permanentChatLinkDescription",{"display":"none"});
    }
    else{
        window.steepFlashPagetitleNow=0;
        changeStyleIfDivExists("permanentChatLinkDescription",{"display":"block"});
        changeStyleIfDivExists("permanentChatLink",{"display":"block"});
        changeStyleIfDivExists("permanentChatLinkUnread",{"display":"none"});
    }
  }
}

function closeChatWindow(event){
  if(event.target.id=="chatBackgroundCover" || event.target.id=="chatCloseButton"){
    sessionStorage.setItem("chatWindowOpen","false");
    document.getElementById("chatBackgroundCover").style.transform="scale(.05)";
    setTimeout(function(){
      deleteDiv("chatBackgroundCover");
      if(document.getElementById("permanentChatLink")!=null){
        drawUnreadNotification();
      }
    },200);
  }
}


function drawChatWindow(){
    drawUnreadNotification();
    if(document.getElementById("permanentChatLink")!=null){
      document.getElementById("permanentChatLink").style.display="none";
      document.getElementById("permanentChatLinkUnread").style.display="none";
      document.getElementById("permanentChatLinkDescription").style.display="none";
    }
    placeText({"divid":"chatBackgroundCover","top":"0px","left":"0px","width":"100%","height":"100%","backgroundColor":"rgba(0,0,0,.5)","zIndex":2147483646,"transform":"scale(.05)","transformOrigin":"top right","transition":'.2s ease-in-out'});
    if(sessionStorage.getItem("chatWindowOpen")=="true"){
      document.getElementById("chatBackgroundCover").style.transform="scale(1)";
    }
    sessionStorage.setItem("chatWindowOpen","true");
    placeText({"parentDiv":"chatBackgroundCover","divid":"chatBackground","fontSize":"30px","lineHeight":"50px","height":"70%","top":"10%","left":"calc(50% - 500px)","width":"1000px","backgroundColor":"rgba(255,255,255,1)","border":"0px solid black","overflow":"scroll","boxShadow": "0px 25px 150px 50px rgba(0, 0, 0, .6)",});
    var chatSubjectHistory=createAndAddDiv("chatSubjectHistory","chatBackground");
    var chatConversationTitle=createAndAddDiv("chatConversationTitle","chatBackground");
    var chatConversation=createAndAddDiv("chatConversation","chatBackground");
    var chatCloseButton=createAndAddDiv("chatCloseButton","chatBackground");
    chatCloseButton.innerHTML=String.fromCharCode(parseInt('2718',16));
    document.getElementById("chatBackgroundCover").onclick=closeChatWindow;
    var chatNewText=createAndAddElement("textarea","chatNewText","chatBackground");
    var submitChatNewText=createAndAddElement("div","submitChatNewText","chatBackground");
    submitChatNewText.innerHTML="Send";
    submitChatNewText.onclick=sendChatToServer;
    submitChatNewText.style.display="none";
    pressKey("once","return",sendChatToServer)
    chatNewText.placeholder="Enter new text here";
    if(sessionStorage.getItem("currentChat"+sessionStorage.getItem("currentChatConversation"))!=undefined){
       chatNewText.value=sessionStorage.getItem("currentChat"+sessionStorage.getItem("currentChatConversation"));
      submitChatNewText.style.display="block";
    } 
    chatNewText.focus()

    var thisDiv=createAndAddDiv("","chatSubjectHistory");
    thisDiv.innerHTML="Conversations";
    for(k=0;k<window.recentChatInfo['recent'].length;k++){
      var thisDiv=createAndAddDiv("","chatSubjectHistory");
      var thisSID=window.recentChatInfo['recent'][k]
      var thisSIDArray=thisSID.split("-");
      thisDiv.innerHTML=thisSID;
      var subDiv=document.createElement("a");
      subDiv.style.pointerEvents="none";
      var subjectType=window.recentChatInfo['subjectTypes'][thisSID];
      if(subjectType=="duplicate"){
        thisSID=thisSIDArray[0];
        subDiv.innerHTML="Duplicate "+thisSIDArray[2];
        thisDiv.innerHTML=thisSID;
      }
      else if(subjectType=="reject"){
        thisSID=thisSIDArray[0];
        subDiv.innerHTML="Reject";
        thisDiv.innerHTML=thisSID;
      }
      thisDiv.appendChild(subDiv);

      if(thisDiv.innerHTML==sessionStorage.getItem("currentChatConversation")){
        thisDiv.style.backgroundColor="rgba(0,0,255,.1)";
      }
      thisDiv.dataset['convoID']=window.recentChatInfo['recent'][k];
      thisDiv.onclick=changeChatConversation;
      if(window.recentChatInfo["unread"].indexOf(window.recentChatInfo['recent'][k])>-1){
        unreadMarker=document.createElement("span");
        unreadMarker.innerHTML="&bull;";
        thisDiv.appendChild(unreadMarker);
      }
    } 

    if(window.recentChatInfo['access']['send'].indexOf(sessionStorage.getItem("currentChatConversation"))==-1){
      chatNewText.readOnly = true;
      chatNewText.placeholder="You do not have permission to send messages to "+sessionStorage.getItem("currentChatConversation");
    }
    
    if(sessionStorage.getItem("currentChatStatus")){
        sessionStorage.setItem(["subjectID","status","lastTextValue"]);
    }
    chatNewText.onkeyup=function(){
        sessionStorage.setItem("currentChat"+sessionStorage.getItem("currentChatConversation"),chatNewText.value);
        if(chatNewText.value!=""){
          submitChatNewText.style.display="block";

        }
        else if(chatNewText.value==""){
          submitChatNewText.style.display="none";
        }
    };


    chatConversationTitle.innerHTML=sessionStorage.getItem("currentChatConversation");
    if(window.recentChatInfo['access']['see'].indexOf(sessionStorage.getItem("currentChatConversation"))!=-1){//can see
      var chats=window.recentChatInfo['messages'][sessionStorage.getItem("currentChatConversation")];
      if(chats!=undefined){
        if(chats.length>5){
          var thisDiv=createAndAddDiv("","chatConversation");
          thisDiv.classList.add("chatConversationStart");
          thisDiv.innerHTML="Start of Conversation";
        }
        var secondsSinceUpdate=(Date.now()-window.lastChatTimeClient)/1000
        for(k=0;k<chats.length;k++){
            var thisChat=chats[k];
            var thisDiv=createAndAddDiv("","chatConversation");
            thisDiv.classList.add("chatConversationEntry");
            if(thisChat[1]==window.recentChatInfo['subjectID']){
              thisDiv.classList.add("myChat");
            }
            else{
              thisDiv.classList.add("theirChat");
            }

            var thisElement = document.createElement("div");
            var rawSeconds=window.recentChatInfo['time']-thisChat[0]+(Date.now()-window.lastChatTimeClient)/1000;
            thisElement.innerHTML=transformRawSeconds(rawSeconds,thisChat[1]);
            thisDiv.appendChild(thisElement);
            thisElement.classList.add("chatConversationEntryDate");

            var thisElement = document.createElement("div");
            var thisElement2 = document.createElement("div");
              thisElement2.innerHTML=thisChat[2];
            thisElement.appendChild(thisElement2);
            thisElement.classList.add("chatConversationEntryText");
            thisElement2.classList.add("chatConversationEntryTextHolder");
            thisDiv.appendChild(thisElement);

        }  

        var chatPartner=sessionStorage.getItem("currentChatConversation");
        var thisDiv=createAndAddDiv("otherChatStatusDiv"+sessionStorage.getItem("currentChatConversation"),"chatConversation");
        thisDiv.classList.add("chatConversationEntry");
        thisDiv.classList.add("theirChat");
        var thisElement = document.createElement("div");
        thisElement.innerHTML=chatPartner+" is typing";
        thisDiv.appendChild(thisElement);
        thisElement.classList.add("chatConversationEntryDate");

        var thisElement = document.createElement("div");
        var thisElement2 = document.createElement("div");
          thisElement2.innerHTML="...";
        thisElement.appendChild(thisElement2);
        thisElement.classList.add("chatConversationEntryText");
        thisElement2.classList.add("chatConversationEntryTextHolder");
        thisDiv.appendChild(thisElement);
        var thisString="otherChatStatusDiv"+chatPartner;
        if(sessionStorage.getItem(thisString)=="typing"){
          thisDiv.style.display="block";
        }
        else{
          thisDiv.style.display="none";
        }




        chatConversation.scrollTop = chatConversation.scrollHeight;

        if(chats.length>5){
          var thisDiv=createAndAddDiv("","chatConversation");
          thisDiv.classList.add("chatConversationStart");
          thisDiv.innerHTML="End of Conversation";
        }
      }
    }
    else{
        var thisDiv=createAndAddDiv("","chatConversation");
        thisDiv.classList.add("chatConversationStart");
        thisDiv.innerHTML="You do not have permission to view this conversation.";
    }
  setTimeout(function(){
    document.getElementById("chatBackgroundCover").style.transform="scale(1)";
  },0);
}

setInterval(checkCurrentChatStatus,1000);
function checkCurrentChatStatus(){
    if(window.recentChatInfo!=undefined){
      for(k=0;k<window.recentChatInfo['recent'].length;k++){
        var thisUsername=window.recentChatInfo['recent'][k];
        var currentText=sessionStorage.getItem("currentChat"+thisUsername);
        if(currentText==undefined){currentText="";}
        var currentChatStatus=sessionStorage.getItem("currentChatStatus"+thisUsername);
        var update=0;
        try{
            currentChatStatus=JSON.parse(currentChatStatus);
            currentChatStatus[0];
            currentChatStatus[1];
            currentChatStatus[2];
        }
        catch(err){
          currentChatStatus=[currentText,0,"empty"];        
        }
        if(currentChatStatus[0]==currentText){
          currentChatStatus[1]=parseInt(currentChatStatus[1])+1;
          if(currentChatStatus[1]>=7){
            if(currentChatStatus[2]=="typing"){
              // \\no longer typing
              if(currentChatStatus[2]!="empty"){
                update=1;
              }
              currentChatStatus[2]="empty";
            }
          }
        }
        else{
          currentChatStatus[1]=0;
          if(currentText==""){
            // \\no longer typing
            if(currentChatStatus[2]!="empty"){
              update=1;
            }
            currentChatStatus[2]="empty";          
          }
          else{
            if(currentChatStatus[2]!="typing"){
              update=1;
            }
            currentChatStatus[2]="typing";          
          }
        }
        currentChatStatus[0]=currentText;
        sessionStorage.setItem("currentChatStatus"+thisUsername,JSON.stringify(currentChatStatus));
        if(update==1){
          var msg={};
          msg['type']="updateChatStatus";
          msg['convoPartner']=thisUsername;
          msg['status']=currentChatStatus;
          sendMessage(msg);
        }
      }
    }
  }


function updateChatStatusFromServer(msg){
  var thisString="otherChatStatusDiv"+msg['sender'];
  sessionStorage.setItem(thisString,msg['chatStatus']);
  var thisElement=document.getElementById(thisString);
  if(msg['chatStatus']=="typing"){
    thisElement.style.display="block";
    thisElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  }
  else{
    thisElement.style.display="none";
  }
}


function sendChatToServer(event){
  sessionStorage.setItem("currentChatStatus"+sessionStorage.getItem("currentChatConversation"),JSON.stringify(["",0,"empty"]));
  var msg={};
  msg['type']="updateChatStatus";
  msg['convoPartner']=sessionStorage.getItem("currentChatConversation");
  msg['status']=["",0,"empty"];
  sendMessage(msg);

  msg={};
  msg['type']="chatMessageFromClient";
  msg['to']=sessionStorage.getItem("currentChatConversation");
  msg["message"]=document.getElementById("chatNewText").value;
  var thisValue=document.getElementById("chatNewText").value;
  var thisValue=thisValue.split(" ").join("").split("\n").join("")
  if(thisValue!=""){
    sendMessage(msg);
  }
  sessionStorage.removeItem("currentChat"+sessionStorage.getItem("currentChatConversation"));
  removePressKeyListener("return");
  drawChatWindow();    
}

function transformRawSeconds(seconds,user){
  if(seconds<4){
    var out=user+" just wrote";
  }
  else if(seconds<60){
    var out=Math.floor(seconds)+" seconds ago "+user+" wrote";
  }
  else if(seconds<3600){
    var minutes=Math.floor(seconds/60);
    if(minutes==1){
      var out="1 minute ago "+user+" wrote";
    }
    else{
      var out=minutes+" minutes ago "+user+" wrote";      
    }
  }
  else if(seconds<3600*24){
    var hours=Math.floor(seconds/(60*24));
    if(hours==1){
      var out="1 hour ago "+user+" wrote";
    }
    else{
      var out=hours+" hours ago "+user+" wrote";      
    }
  }
  return out;
}


function getChatHistory(){
  msg={};
  msg['type']='getChatHistoryFromClient';
  sendMessage(msg);
}


function markChatAsRead(){
  msg={};
  msg['type']='markChatAsRead';
  msg['chatName']=sessionStorage.getItem("currentChatConversation");
  sendMessage(msg);
  var thisIndex=window.recentChatInfo['unread'].indexOf(sessionStorage.getItem("currentChatConversation"));
  if(thisIndex>-1){
    window.recentChatInfo['unread'].splice(thisIndex,1);
  }
}




function changeChatConversation(event){
  if(sessionStorage.getItem("currentChatConversation")==undefined){
    getChatHistory();
  }
  else{
    sessionStorage.setItem("currentChatConversation",event.target.dataset.convoID);
    markChatAsRead();
    drawChatWindow();
  }
}

function updateChatHistory(msg){
  window.lastChatTimeClient=Date.now();
  if(sessionStorage.getItem("chatWindowOpen")=='false' || sessionStorage.getItem("currentChatConversation")==undefined){
    sessionStorage.setItem("currentChatConversation",msg['recent'][0]);
  }
  window.recentChatInfo=msg;
  drawChatWindow();
  if(window.recentChatInfo['playSound']=="true"){playChatSound();};
}


function loadChatSound(){
    window.steepChatSound = new Audio(window.config['packageFolder']+'/media/chatSound.m4a'); 
}

runOnSuccessfulConnection(loadChatSound);

function playChatSound(){
    var thisElement=window.steepChatSound.cloneNode();
    thisElement.id=Date.now()+"Audio";
    thisElement.play();
    deleteDiv(thisElement.id)
}





function openChatWindowOnReloadIfNeeded(){
  if(sessionStorage.getItem("chatWindowOpen")=="true"){
    getChatHistory();
  }
  else{
    sessionStorage.setItem("chatWindowOpen","false");
  }
}
runOnSuccessfulConnection(openChatWindowOnReloadIfNeeded);


