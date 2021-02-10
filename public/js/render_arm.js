create_globe('#grip_video_wrapper');
create_globe('#base_video_wrapper');

$("#gripviz").on("mouseover mouseout", function (e){
  videoPlayButtonControl("#grip_camera_control", e);
});

$("#grip_camera_play").on("click", function(e) {
  subscribeCameraTopic("grip_video_wrapper", "grip_cam", "WELCOME BACK CHRIS");
});


$("#baseviz").on("mouseover mouseout", function (e){
  videoPlayButtonControl("#base_camera_control", e);
});

$("#base_camera_play").on("click", function(e) {
  subscribeCameraTopic("base_video_wrapper", "base_cam", "RHIT ROVER TEAM");
});

/*
joy_info_topic.subscribe(function(message){
    let leftSpeed = message.data[0];
    let rightSpeed = message.data[0];
    info = '=> L: ${leftSpeed}, R: ${rightSpeed}';
    info = info.replace('${leftSpeed}', Math.round(leftSpeed * 1000) / 1000);
    info = info.replace('${rightSpeed}', Math.round(rightSpeed * 1000) / 1000);
    log_status(info, "joyspeed");
});
*/