var myVideo ={
  source:'http://techslides.com/demos/sample-videos/small.mp4',
  videoCreated:false,
  videoRunning:false,
  videoTime:0,
  create:function (source){
    var videoDiv = document.getElementById("videoDiv");
    if(videoDiv!=null){ 
      document.getElementsByTagName('body')[0].removeChild(videoDiv);
    }
    var videoDiv = document.createElement('div');
    videoDiv.id = 'videoDiv';
    document.getElementsByTagName('body')[0].appendChild(videoDiv);

    var video = document.createElement('video');
    video.id = 'videoHolder';
    video.src = myVideo.source;
    video.preload='auto'

    var videoTime = document.createElement('h1');
    videoTime.id="videoTime";



    videoDiv.appendChild(video);
    videoDiv.appendChild(videoTime);



    document.getElementById('videoTime').style.backgroundColor='transparent';    
    document.getElementById('videoTime').style.position='absolute';    
    document.getElementById('videoTime').style.bottom='0';    
    document.getElementById('videoTime').style.left='0';    
    document.getElementById('videoTime').style.color='red';    
    document.getElementById('videoTime').style.fontSize='200%';    

  // width: 100%;
  // height:100%;
  // position: absolute;
  // top: 0;
  // left: 0;
  // background-color:rgba(0,0,0,.7);
    document.getElementById('videoHolder').style.width='100%';    
    document.getElementById('videoHolder').style.height='100%';    
    document.getElementById('videoHolder').style.position='absolute';    
    document.getElementById('videoHolder').style.top='0';    
    document.getElementById('videoHolder').style.left='0';    



    myVideo.videoCreated=true;
  },
  show: function (){
    document.getElementById('mainDiv').style.visibility='hidden';
    document.getElementById('videoDiv').style.visibility='visible';    
  },
  start: function (timein){
    //document.getElementById('videoHolder').currentTime = timein+((new Date()).getTime()-window.pressedTimeStart)/1000;
    document.getElementById('videoHolder').play();
    //document.getElementById('videoHolder').currentTime=timein;
    //document.getElementById('videoHolder').currentTime = timein+((new Date()).getTime()-window.pressedTimeStart)/1000;
    // document.getElementById('videoHolder').addEventListener("canplay",function() {
    //   console.log("function runn2");
    //   console.log((new Date()).getTime());
    //   document.getElementById('videoHolder').currentTime = timein+((new Date()).getTime()-window.pressedTimeStart)/1000;
    //   console.log('video ready');
    //   console.log(window.pressedTimeStart-(new Date()).getTime());
    //   console.log(timein+((new Date()).getTime()-window.pressedTimeStart)/1000)
    // });
    //document.getElementById('videoHolder').addEventListener("canplay",function() {alert((new Date()).getTime()-window.pressedTimeStart)/1000;});
    myVideo.videoRunning=true;
    myVideo.timer();
  },
  pause: function (){
    myVideo.videoRunning=true;
    document.getElementById('videoHolder').pause();
  },
  end: function (){
    myVideo.videoRunning=false;
    document.getElementById('videoHolder').pause();
    document.getElementById('mainDiv').style.visibility='visible';
    document.getElementById('videoDiv').style.visibility='hidden';
  },
  timer: function (){
    if(myVideo.videoRunning){
      var vid = document.getElementById("videoHolder");
      document.getElementById('videoTime').innerHTML=document.getElementById('videoHolder').currentTime.toFixed(2);
      setTimeout(myVideo.timer,50);
    } 
  }
}



function loadVideoMessage(msg){
  myVideo.source=msg['source'];
  myVideo.create();
  myVideo.show();
}

function startVideoMessage(msg){
  myVideo.show();
  myVideo.start(msg['time']);
}

function endVideoMessage(msg){
  myVideo.end();
}

function reconnectVideoMessage(msg){
  window.messageReceivedTime=(new Date()).getTime();
  myVideo.source=msg['source'];
  myVideo.create();
  myVideo.show();
  document.getElementById('videoHolder').addEventListener("canplay",function() {
    document.getElementById('videoHolder').currentTime = msg['time']+((new Date()).getTime()-window.messageReceivedTime)/1000;
    document.getElementById('videoHolder').play();
    myVideo.videoRunning=true;
    myVideo.timer();
  });
}

// myVideo.source="instructions.mp4"
// myVideo.create();
// myVideo.source="http://techslides.com/demos/sample-videos/small.mp4"
// myVideo.create();
// myVideo.start(0);

