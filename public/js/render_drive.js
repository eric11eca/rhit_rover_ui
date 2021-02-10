create_globe('#drive_video_wrapper');
create_globe('#arm_video_wrapper');

$("#driveviz").on("mouseover mouseout", function (e){
  videoPlayButtonControl("#drive_camera_control", e);
});

$("#drive_camera_play").on("click", function(e) {
  subscribeCameraTopic("drive_video_wrapper", "drive_cam", "WELCOME BACK CHRIS");
});


$("#armviz").on("mouseover mouseout", function (e){
  videoPlayButtonControl("#arm_camera_control", e);
});

$("#arm_camera_play").on("click", function(e) {
  subscribeCameraTopic("arm_video_wrapper", "arm_cam", "RHIT ROVER TEAM");
});




