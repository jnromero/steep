
function drawChatWindow(){
    sessionStorage.setItem("chatWindowOpen","true");
    placeText({"divid":"chatBackgroundCover","top":"0px","left":"0px","width":"100%","height":"100%","backgroundColor":"rgba(0,0,0,.5)","zIndex":2147483648});
    placeText({"parentDiv":"chatBackgroundCover","divid":"chatBackground","fontSize":"30px","lineHeight":"50px","height":"800px","top":"calc(50% - 400px)","left":"calc(50% - 500px)","width":"1000px","backgroundColor":"rgba(255,255,255,1)","border":"0px solid black","overflow":"scroll","boxShadow": "0px 25px 150px 50px rgba(0, 0, 0, .6)",});
    var chatSubjectHistory=createAndAddDiv("chatSubjectHistory","chatBackground");
    var chatConversationTitle=createAndAddDiv("chatConversationTitle","chatBackground");
    var chatConversation=createAndAddDiv("chatConversation","chatBackground");
    var chatCloseButton=createAndAddDiv("chatCloseButton","chatBackground");
    chatCloseButton.innerHTML=String.fromCharCode(parseInt('2718',16));
    chatCloseButton.onclick=function (){
      sessionStorage.setItem("chatWindowOpen","false");
      deleteDiv("chatBackgroundCover");
    }

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
      thisDiv.innerHTML=window.recentChatInfo['recent'][k];
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
}

function sendChatToServer(event){
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


function checkForSock(){
  if(sock!=null){
    setTimeout(getChatHistory,10);
  }
  else{
    setTimeout(checkForSock,10);
  }
}

if(sessionStorage.getItem("chatWindowOpen")=="true"){
  checkForSock();
}
else{
  sessionStorage.setItem("chatWindowOpen","false");
}


function updateChatHistory(msg){
  console.log("!!",msg)
  window.lastChatTimeClient=Date.now();
  if(sessionStorage.getItem("chatWindowOpen")=='false' || sessionStorage.getItem("currentChatConversation")==undefined){
    sessionStorage.setItem("currentChatConversation",msg['recent'][0]);
  }
  window.recentChatInfo=msg;
  drawChatWindow();
}
