var rosbridge_url = 'ws://137.112.236.253:9090';
var first_close = true;

var ros = new ROSLIB.Ros({
    url : rosbridge_url
});

ros.on('connection', function() {
    first_close = true;
});

ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
    console.log('Connection to websocket server closed.');
    if (first_close) {
        first_close = false;
    }
});

window.setInterval(function(){
    if (ros.isConnected) return;
    console.log(ros.isConnected);
    ros.connect(rosbridge_url);
}, 1000);



var camera_info_topic = new ROSLIB.Topic({
    ros: ros, name: '/usb_cam/image_raw/compressed',
    messageType: 'sensor_msgs/CompressedImage'
});

var joy_info_topic = new ROSLIB.Topic({
    ros: ros, name: '/joyRight',
    messageType: 'std_msgs/String'
});


let streaming = false;

$("#cameraviz").on("mouseover mouseout", function (e){
  if (e.type === "mouseout") {
    $("#camera_play").css("display", "none");
  } else {
    $("#camera_play").css("display", "block");
  }
});

$("#play").on("click", function(e) {
    let video = document.getElementById("video_wrapper");
    if (streaming == false) {
        streaming = true;
        var node = document.createElement("H6");
        node.setAttribute("id", "st");
        //node.innerHTML = "=> Start Streaming Front Camera";
        document.getElementById("status").appendChild(node);
        for(var i = 0 ; i < 10; i++){
            document.getElementById("st").appendChild()
        }
        video.innerHTML = '<img id="usb_cam">';
        video.style.marginTop = 0;
        video.style.marginLeft = 0;

        camera_info_topic.subscribe(function(message) {
        document.getElementById('usb_cam').src = "data:image/jpg;base64," + message.data;
        });
    } else if (streaming == true) {
        streaming = false;
        camera_info_topic.unsubscribe();
        video.innerHTML = '<h1>WELCOME BACK CHRIS</h1>';
        video.style.marginTop = "25%";
        video.style.marginLeft = "25%";
    }
});


// var gps_topic = new ROSLIB.Topic({
//     ros: ros, name: '/usb_cam/image_raw/compressed',
//     messageType: 'sensor_msgs/NavSatStatus'
// });

// gps_topic.subscribe(function(message) {
//     console.log("got image frame")
//     document.getElementById('usb_cam').src = "data:image/jpg;base64," + message.data;
//     //gps_topic.unsubscribe();
// });

// var imu_topic = new ROSLIB.Topic({
//     ros: ros, name: '/usb_cam/image_raw/compressed',
//     messageType: 'sensor_msgs/Imu'
// });

// imu_topic.subscribe(function(message) {
//     console.log("got image frame")
//     document.getElementById('usb_cam').src = "data:image/jpg;base64," + message.data;
//     //imu_topic.unsubscribe();
// });

// var goal_topic = new ROSLIB.Topic({
//     ros: ros, name: '/usb_cam/image_raw/compressed',
//     messageType: 'move_base_msgs/MoveBaseActionGoal'
// });

// goal_topic.subscribe(function(message) {
//     console.log("got image frame")
//     document.getElementById('usb_cam').src = "data:image/jpg;base64," + message.data;
//     //goal_topic.unsubscribe();
// });

// var goal_topic = new ROSLIB.Topic({
//     ros: ros, name: '/usb_cam/image_raw/compressed',
//     messageType: 'geometry_msgs/Twist'
// });

// goal_topic.subscribe(function(message) {
//     console.log("got image frame")
//     document.getElementById('usb_cam').src = "data:image/jpg;base64," + message.data;
//     //
// });

