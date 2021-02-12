window.create_globe('#grip_video_wrapper');
window.create_globe('#base_video_wrapper');

$("#gripviz").on("mouseover mouseout", function (e){
  window.videoPlayButtonControl("#grip_camera_control", e);
});

$("#grip_camera_play").on("click", function(e) {
  window.subscribeCameraTopic("grip_video_wrapper", "grip_cam", "WELCOME BACK CHRIS");
});


$("#baseviz").on("mouseover mouseout", function (e){
  window.videoPlayButtonControl("#base_camera_control", e);
});

$("#base_camera_play").on("click", function(e) {
  window.subscribeCameraTopic("base_video_wrapper", "base_cam", "RHIT ROVER TEAM");
});