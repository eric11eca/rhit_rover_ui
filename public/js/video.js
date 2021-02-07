let streaming = false;
let video = document.getElementById("videoInput");
//let canvasOutput = document.getElementById('canvasOutput');
//let canvasContext = canvasOutput.getContext('2d');

$("#video_contain").on("mouseover mouseout", function (e) {
  console.log("show control");
  if (e.type === "mouseout") {
    $("#controlbar").css("display", "none");
  } else {
    $("#controlbar").css("display", "block");
  }
});

$("#play").on("click", toggle);
video.addEventListener("click", () => {
  toggle();
});

function toggle() {
  if (video.paused) {
    //onVideoStarted();
    startCamera();
    video.play();
  } else {
    stopCamera();
  }
}

$("#videoInput").on("play pause ended", updateUI);
function updateUI() {
  if (video.paused) {
    $("#play").html('<i class="far fa-play-circle fa-2x"></i>');
  } else {
    $("#play").html('<i class="far fa-pause-circle fa-2x"></i>');
  }
}

function onVideoStarted() {
  streaming = true;
  let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
  let cap = new cv.VideoCapture(video);
  const FPS = 30;

  function processVideo() {
    try {
      if (!streaming) {
        src.delete();
        dst.delete();
        return;
      }
      let begin = Date.now();
      cap.read(src);
      cv.imshow("canvasOutput", dst);
      let delay = 1000 / FPS - (Date.now() - begin);
      setTimeout(processVideo, delay);
    } catch (err) {
      console.log(err);
    }
  }
  setTimeout(processVideo, 0);
}

function startCamera() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
      video.height = video.width / 1.777;
    })
    .catch(function (err) {
      console.log("An error occurred! " + err);
    });
}

function stopCamera() {
  streaming = false;
  let mediaStream = video.srcObject;
  let tracks = mediaStream.getTracks();
  tracks.forEach((track) => track.stop());
  video.pause();
}

// var handler = document.querySelector('.handler');
// var wrapper = handler.closest('.wrapper');
// var boxA = wrapper.querySelector('.box');
// var isHandlerDragging = false;

// document.addEventListener('mousedown', function(e) {
//   if (e.target === handler) {
//     isHandlerDragging = true;
//   }
// });

// document.addEventListener('mousemove', function(e) {
//   if (!isHandlerDragging) {
//     return false;
//   }

//   var containerOffsetLeft = wrapper.offsetLeft;
//   var pointerRelativeXpos = e.clientX - containerOffsetLeft;
//   var boxAminWidth = 60;

//   boxA.style.width = (Math.max(boxAminWidth, pointerRelativeXpos - 8)) + 'px';
//   boxA.style.flexGrow = 0;
// });

// document.addEventListener('mouseup', function(e) {
//   isHandlerDragging = false;
// });
