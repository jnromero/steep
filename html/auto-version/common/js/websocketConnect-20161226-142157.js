var sock = null;
var pageName=location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

window.onload = function() {
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
      if(pageName!="monitor.html"){
        deleteDiv("mainDiv");
        var mainDiv=createDiv("mainDiv");
        $("body").prepend(mainDiv);
        genericScreen('Connection to server lost.  <br>  <input type="button" value="Reconnect" onClick="window.location.href=window.location.href">');
      }
      else{
        document.getElementById("mainDiv").style.backgroundColor="rgba(255,0,0,.1)";
      }
      //alert("Connection closed (wasClean = " + e.wasClean + ", code = " + e.code + ", reason = '" + e.reason + "')");
      // sock = null;
      // var message={"type":"closeConnection","subjectID":window.subjectID,"viewType":window.viewType};
      // sendMessage(message);
    }
    sock.onmessage = function(e) {
      messageManager(e.data)
    }  
    sock.onerror = function(){
      genericScreen('Failed to connect to server.  <br>  <input type="button" value="Reconnect" onClick="window.location.href=window.location.href">');
    }
  }
};


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
    genericScreen('Connected Somewhere Else.  <br>  <input type="button" value="Reconnect" onClick="window.location.href=window.location.href">');
    console.log(sock);
    sock=null;
    console.log(sock);
}

function notAccepting(message){
  subjectIDs=message['subjectIDs'];
  document.write("<ol id='clients'><ol>");
  for(k=0;k<subjectIDs.length;k++){
    newLI = document.createElement("li");
    newLI.innerHTML="<a href='"+window.location.pathname+"?subjectID="+subjectIDs[k][0]+"'>"+subjectIDs[k][0]+" - "+subjectIDs[k][1]+"</a>";
    document.getElementById("clients").appendChild(newLI);
  }
}

function sendMessage(message){
  if(sock!=null){
    sock.send(JSON.stringify(message));
  }
  else{
    console.log("can't sent,not connected",message);
  }
}
