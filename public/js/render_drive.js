window.create_globe('#drive_video_wrapper');
window.create_globe('#arm_video_wrapper');

$("#driveviz").on("mouseover mouseout", function (e) {
  window.videoPlayButtonControl("#drive_camera_control", e);
});

$("#drive_camera_play").on("click", function (e) {
  window.subscribeCameraTopic("drive_video_wrapper", "drive_cam", "WELCOME BACK CHRIS");
});


$("#armviz").on("mouseover mouseout", function (e) {
  window.videoPlayButtonControl("#arm_camera_control", e);
});

$("#arm_camera_play").on("click", function (e) {
  window.subscribeCameraTopic("arm_video_wrapper", "grip_cam", "RHIT ROVER TEAM");
});




