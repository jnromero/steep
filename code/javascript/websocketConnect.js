var sock = null;
var pageName=location.pathname.substring(location.pathname.lastIndexOf("/") + 1);


window.addEventListener('load', function() {
  wsuri=window.config['websocketURL'];
  if ("WebSocket" in window) {
    sock = new WebSocket(wsuri);
  } else if ("MozWebSocket" in window) {
    sock = new MozWebSocket(wsuri);
  } else {
    window.location = "http://autobahn.ws/unsupportedbrowser";
  }

  if (sock) {
    sock.onopen = function() {
      var message={"type":"newConnection","url":window.location};
      sendMessage(message);
    }
    sock.onclose = function(e) {
      console.log("disconnected");
      placeText({"divid":"disconnectedDiv","width":"100%","height":"100%","fontSize":"125%","top":'0px',"zIndex":'16777271',"backgroundColor":"rgba(255,200,200,.8)",});
      placeText({"parentDiv":"disconnectedDiv","text":'Connection to server lost.  <br>  <input type="button" value="Reconnect" onClick="window.location.href=window.location.href">',"top":"25%","height":"250%","fontSize":"225%","backgroundColor":"rgba(255,0,0,0)",});
    }
    sock.onmessage = function(e) {
      messageManager(e.data)
    }  
    sock.onerror = function(){
      genericScreen('Failed to connect to server.  <br>  <input type="button" value="Reconnect" onClick="window.location.href=window.location.href">');
    }
  }
});


function getUserName(){
  $.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if(results==null){return null;}
    else{return results[1] || 0;}
  }
  var username=$.urlParam('user');
}


function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function connectAnotherBrowser(message){
    clearAll();
    genericScreen('This subject is connected somewhere else.  <br>  <input type="button" value="Reconnect" onClick="window.location.href=window.location.href">');
    sock.close();
}


function steepDuplicateConnection(message){
  genericScreen("Another client with same subjectID is already connected.");
}

function steepNotAcceptingClientsAnymore(message){
  genericScreen("The sever is no longer accepting clients");

var word = "hello";
var input = "";
document.body.addEventListener('keypress',function(ev){
    input += String.fromCharCode(ev.keyCode);
    if(input.substring(input.length-5,input.length) == word){
      subjectIDs=window.state['subjectIDs'];
      document.write("<ol id='clients'><ol>");
      for(k=0;k<subjectIDs.length;k++){
        console.log(subjectIDs)
        newLI = document.createElement("li");
        newLI.innerHTML="<a href='"+window.location.pathname+"?subjectID="+subjectIDs[k][0]+"'>"+subjectIDs[k][0]+" - "+subjectIDs[k][1]+"</a>";
        document.getElementById("clients").appendChild(newLI);
      }
    }
  });
}


function sendMessage(message){
  if(sock!=null){
    sock.send(JSON.stringify(message));
  }
  else{
    console.log("can't sent,not connected",message);
  }
}
