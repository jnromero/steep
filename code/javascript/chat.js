
function drawChatWindow(){
    placeText({"divid":"chatBackgroundCover","top":"0px","left":"0px","width":"100%","height":"100%","backgroundColor":"rgba(0,0,0,.5)","zIndex":2147483648});
    placeText({"parentDiv":"chatBackgroundCover","divid":"chatBackground","fontSize":"30px","lineHeight":"50px","height":"800px","top":"calc(50% - 400px)","left":"calc(50% - 500px)","width":"1000px","backgroundColor":"rgba(255,255,255,1)","border":"0px solid black","overflow":"scroll","boxShadow": "0px 25px 150px 50px rgba(0, 0, 0, .6)",});
    var chatSubjectHistory=createAndAddDiv("chatSubjectHistory","chatBackground");
    var chatConversationTitle=createAndAddDiv("chatConversationTitle","chatBackground");
    var chatConversation=createAndAddDiv("chatConversation","chatBackground");
    var chatCloseButton=createAndAddDiv("chatCloseButton","chatBackground");
    chatCloseButton.innerHTML=String.fromCharCode(parseInt('2718',16));
    chatCloseButton.onclick=function (){
      deleteDiv("chatBackgroundCover");
    }

    var chatNewText=createAndAddElement("textarea","chatNewText","chatBackground");
    var submitChatNewText=createAndAddElement("div","submitChatNewText","chatBackground");
    submitChatNewText.innerHTML="Send";
    submitChatNewText.onclick=sendChatToServer;
    submitChatNewText.style.display="none";
    pressKey("once","return",sendChatToServer)
    chatNewText.placeholder="Enter new text here";
    if(sessionStorage.getItem("currentChat"+window.currentChatConversation)!=undefined){
       chatNewText.value=sessionStorage.getItem("currentChat"+window.currentChatConversation);
      submitChatNewText.style.display="block";
    } 
    chatNewText.focus()

    var thisDiv=createAndAddDiv("","chatSubjectHistory");
    thisDiv.innerHTML="Conversations";
    for(k=0;k<window.recentChatInfo['recent'].length;k++){
      var thisDiv=createAndAddDiv("","chatSubjectHistory");
      thisDiv.innerHTML=window.recentChatInfo['recent'][k];
      if(thisDiv.innerHTML==window.currentChatConversation){
        thisDiv.style.backgroundColor="rgba(0,0,255,.1)";
      }
      thisDiv.onclick=changeChatConversation;
    } 

    if(window.recentChatInfo['access']['send'].indexOf(window.currentChatConversation)==-1){
      chatNewText.readOnly = true;
      chatNewText.placeholder="You do not have permission to send messages to "+window.currentChatConversation;
    }
    

    chatNewText.onkeyup=function(){
        sessionStorage.setItem("currentChat"+window.currentChatConversation,chatNewText.value);
        if(chatNewText.value!=""){
          submitChatNewText.style.display="block";

        }
        else if(chatNewText.value==""){
          submitChatNewText.style.display="none";
        }
    };


    chatConversationTitle.innerHTML=window.currentChatConversation;
    if(window.recentChatInfo['access']['see'].indexOf(window.currentChatConversation)!=-1){//can see
      var chats=window.recentChatInfo['messages'][window.currentChatConversation];
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
  msg['to']=window.currentChatConversation;
  msg["message"]=document.getElementById("chatNewText").value;
  var thisValue=document.getElementById("chatNewText").value;
  var thisValue=thisValue.split(" ").join("").split("\n").join("")
  if(thisValue!=""){
    sendMessage(msg);
  }
  sessionStorage.removeItem("currentChat"+window.currentChatConversation);
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

function changeChatConversation(event){
  if(currentChatConversation==undefined){
    getChatHistory();
  }
  else{
    window.currentChatConversation=event.target.innerHTML;
    drawChatWindow();
  }
}

function updateChatHistory(msg){
  window.lastChatTimeClient=Date.now();
  window.currentChatConversation=msg['recent'][0];
  window.recentChatInfo=msg;
  drawChatWindow();
}
