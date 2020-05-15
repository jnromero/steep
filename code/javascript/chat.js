
function drawChatWindow(){
    placeText({"divid":"chatBackgroundCover","top":"0px","left":"0px","width":"100%","height":"100%","backgroundColor":"rgba(0,0,0,.5)","zIndex":2147483648});
    placeText({"parentDiv":"chatBackgroundCover","divid":"chatBackground","fontSize":"30px","lineHeight":"50px","height":"800px","top":"calc(50% - 400px)","left":"calc(50% - 500px)","width":"1000px","backgroundColor":"rgba(255,255,255,1)","border":"0px solid black","overflow":"scroll","boxShadow": "0px 25px 150px 50px rgba(0, 0, 0, .6)",});
    var chatSubjectHistory=createAndAddDiv("chatSubjectHistory","chatBackground");
    var chatConversationTitle=createAndAddDiv("chatConversationTitle","chatBackground");
    var chatConversation=createAndAddDiv("chatConversation","chatBackground");
    var chatNewText=createAndAddElement("textarea","chatNewText","chatBackground");
    var submitChatNewText=createAndAddElement("div","submitChatNewText","chatBackground");
    submitChatNewText.innerHTML="Send";
    submitChatNewText.style.display="none";
    chatNewText.placeholder="Enter new text here";


    var thisDiv=createAndAddDiv("","chatSubjectHistory");
    thisDiv.innerHTML="Conversations";
    var thisDiv=createAndAddDiv("","chatSubjectHistory");
    thisDiv.innerHTML="everyone";
    for(k=0;k<17;k++){
      var thisDiv=createAndAddDiv("","chatSubjectHistory");
      thisDiv.innerHTML="subject"+k;
    } 

    chatNewText.onkeyup=function(){
        if(chatNewText.value!=""){
          submitChatNewText.style.display="block";

        }
        else if(chatNewText.value==""){
          submitChatNewText.style.display="none";
        }
    };
    // var alertBoxOK=placeText({"parentDiv":"confirmationDiv","divid":"confirmationDivButtonOK","text":"OK","fontSize":"26px","bottom":"25px","left":"225px","width":"150px","height":"75px","backgroundColor":"rgba(0,255,0,.1)","border":"5px solid rgba(0,255,0,.3)"});
    // clickButton("many",alertBoxOK.id,alertBoxClose);
    // hoverDivChangeOtherDiv("confirmationDivButtonOK","confirmationDivButtonOK",{"border":"5px solid green","backgroundColor":"rgba(0,255,0,.3)"})
    chats=[
      ["2020/05/15","subject1","Hey, how's it going?"],
      ["2020/05/15","experimenter","Good, how about you?"],
      ["2020/05/15","subject1","Good, are you still there?"],
      ["2020/05/15","experimenter","Good, how about you?"],
      ["2020/05/15","subject1","Good, are you still there?"],
      ["2020/05/15","experimenter","Good, how about you?"],
      ["2020/05/15","subject1","Good, are you still there?"],
      ["2020/05/15","experimenter","Good, how about you?"],
      ["2020/05/15","subject1","Good, are you still there?"],
      ["2020/05/15","experimenter","Good, how about you?"],
      ["2020/05/15","subject1","Good, are you still there?"],
      ["2020/05/15","experimenter","Good, how about you?"],
      ["2020/05/15","subject1","Good, are you still there?"],
      ["2020/05/15","experimenter","Good, how about you?"],
      ["2020/05/15","subject1","Good, are you still there?"],
      ["2020/05/15","experimenter","Good, how about you?"],
      ["2020/05/15","subject1","Good, are you still there?"],
      ["2020/05/15","experimenter","Good, how about you?"],
      ["2020/05/15","subject1","Good, are you still there?"],
      ["2020/05/15","experimenter","Good, how about you?"],
      ["2020/05/15","subject1","Could you please clikc on the button on the top right of the screen and let me know what happens when you do that??"],
      ["2020/05/15","experimenter","Could you please clikc on the button on the top right of the screen and let me know what happens when you do that??"],
      ["2020/05/15","experimenter","Good, how about you?"],
      ["2020/05/15","subject1","Good, are you still there?"],
      ["2020/05/15","subject1","Good, are you still there?"],
      ["2020/05/15","subject1","Good, are you still there?"],
    ];


    chatConversationTitle.innerHTML='subject1';
    if(chats.length>5){
      var thisDiv=createAndAddDiv("","chatConversation");
      thisDiv.classList.add("chatConversationStart");
      thisDiv.innerHTML="Start of Conversation";
    }

    for(k=0;k<chats.length;k++){
        var thisChat=chats[k];
        var thisDiv=createAndAddDiv("","chatConversation");
        thisDiv.classList.add("chatConversationEntry");
        if(thisChat[1]=="experimenter"){
          thisDiv.classList.add("myChat");
        }
        else{
          thisDiv.classList.add("theirChat");
        }

        var thisElement = document.createElement("div");
        thisElement.innerHTML="At "+thisChat[0]+" "+thisChat[1]+" wrote";
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
setTimeout(drawChatWindow,100);

