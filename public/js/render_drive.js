create_globe('#video_wrapper1');
create_globe('#video_wrapper2');

let streaming = false;

$("#cameraviz").on("mouseover mouseout", function (e){
  if (e.type === "mouseout") {
    $("#camera_play").css("display", "none");
  } else {
    $("#camera_play").css("display", "block");
  }
});

$("#play").on("click", function(e) {
    let video = document.getElementById("video_wrapper1");
    if (streaming == false) {
        streaming = true;
        video.innerHTML = '<img id="usb_cam">';
        video.style.marginTop = 0;
        video.style.marginLeft = 0;
        camera_info_topic.subscribe(function(message) {
            document.getElementById('usb_cam').src = "data:image/jpg;base64," + message.data;
        });
        log_status(CAMERA_SUB_ON, "status");
    } else if (streaming == true) {
        streaming = false;
        camera_info_topic.unsubscribe();
        log_status(CAMERA_SUB_OFF, "status");
        video.innerHTML = '<h1>WELCOME BACK CHRIS</h1>';
        video.style.marginTop = "20%";
        video.style.marginLeft = "auto";
        create_globe('#video_wrapper1');
    }
});

joy_info_topic.subscribe(function(message){
    let leftSpeed = message.data[0];
    let rightSpeed = message.data[0];
    info = '=> L: ${leftSpeed}, R: ${rightSpeed}';
    info = info.replace('${leftSpeed}', Math.round(leftSpeed * 1000) / 1000);
    info = info.replace('${rightSpeed}', Math.round(rightSpeed * 1000) / 1000);
    log_status(info, "joyspeed");
});

