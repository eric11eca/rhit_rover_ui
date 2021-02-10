create_globe('#grip_video_wrapper');
create_globe('#base_video_wrapper');

let streaming_grip = false;
let streaming_base = false;

$("#gripviz").on("mouseover mouseout", function (e){
  
  if (e.type === "mouseout") {
    $("#grip_camera_control").css("display", "none");
  } else {
    $("#grip_camera_control").css("display", "block");
  }
});

$("#grip_camera_play").on("click", function(e) {
    let video = document.getElementById("grip_video_wrapper");
    if (streaming_grip == false) {
      streaming_grip = true;
        video.innerHTML = '<img id="grip_cam" class="usb_cam">';
        video.style.marginTop = 0;
        video.style.marginLeft = 0;
        camera_info_topic.subscribe(function(message) {
            document.getElementById('grip_cam').src = "data:image/jpg;base64," + message.data;
        });
        log_status(CAMERA_SUB_ON, "status");
    } else if (streaming_grip == true) {
      streaming_grip = false;
        camera_info_topic.unsubscribe();
        log_status(CAMERA_SUB_OFF, "status");
        video.innerHTML = '<h1>WELCOME BACK CHRIS</h1>';
        video.style.marginTop = "20%";
        video.style.marginLeft = "auto";
        create_globe('#grip_video_wrapper');    
    }
});

$("#baseviz").on("mouseover mouseout", function (e){
  if (e.type === "mouseout") {
    $("#base_camera_control").css("display", "none");
  } else {
    $("#base_camera_control").css("display", "block");
  }
});

$("#base_camera_play").on("click", function(e) {
  let video = document.getElementById("base_video_wrapper");
  if (streaming_base == false) {
    streaming_base = true;
      video.innerHTML = '<img id="base_cam" class="usb_cam">';
      video.style.marginTop = 0;
      video.style.marginLeft = 0;
      camera_info_topic.subscribe(function(message) {
          document.getElementById('base_cam').src = "data:image/jpg;base64," + message.data;
      });
      log_status(CAMERA_SUB_ON, "status");
  } else if (streaming_base == true) {
    streaming_base = false;
      camera_info_topic.unsubscribe();
      log_status(CAMERA_SUB_OFF, "status");
      video.innerHTML = '<h1>WELCOME BACK CHRIS</h1>';
      video.style.marginTop = "20%";
      video.style.marginLeft = "auto";
      create_globe('#base_video_wrapper');    
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