const CONNECTION_ON = "=> Connection to websocket server started";
const CONNECTION_OFF = "=> Connection to websocket server closed";
const CONNECTION_ERROR = "=> !Error connecting to websocket server!";
const CAMERA_SUB_ON = "=> Subscribed to camera topic";
const CAMERA_SUB_OFF = "=> Unsubscribed to camera topic";
const JOY_SUB_ON = "=> Subscribed to joy_speed topic";
const JOY_SUB_OFF = "=> Unsubscribed joy_speed topic";


const rosbridge_url = 'ws://137.112.236.15:9090';
var first_close = true;

var ros = new ROSLIB.Ros({
    url : rosbridge_url
});

ros.on('connection', function() {
    log_status(CONNECTION_ON);
    first_close = true;
});

ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
    log_status(CONNECTION_OFF);
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
    ros: ros, name: '/driveCommands',
    messageType: 'std_msgs/Float32MultiArray'
});

function log_status(messgae) {
    var node = document.createElement("H6");
    node.innerHTML = messgae;

    document.getElementById("status").appendChild(node);
}

function log_Joyspeed(messgae) {
    var node = document.createElement("H6");
    node.innerHTML = messgae;
    document.getElementById("joyspeed").appendChild(node);
}


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
        video.innerHTML = '<img id="usb_cam">';
        video.style.marginTop = 0;
        video.style.marginLeft = 0;
        camera_info_topic.subscribe(function(message) {
            document.getElementById('usb_cam').src = "data:image/jpg;base64," + message.data;
        });
        log_status(CAMERA_SUB_ON);
    } else if (streaming == true) {
        streaming = false;
        camera_info_topic.unsubscribe();
        log_status(CAMERA_SUB_OFF);
        video.innerHTML = '<h1>WELCOME BACK CHRIS</h1>';
        video.style.marginTop = "20%";
        video.style.marginLeft = "auto";
        document.getElementById("video_brand").style.animation = "none";
    }
});

joy_info_topic.subscribe(function(message){
    let leftSpeed = message.data[0];
    let rightSpeed = message.data[0];
    info = '=> L: ${leftSpeed}, R: ${rightSpeed}';
    info = info.replace('${leftSpeed}', Math.round(leftSpeed * 1000) / 1000);
    info = info.replace('${rightSpeed}', Math.round(leftSpeed * 1000) / 1000);
    log_Joyspeed(info);
    updateScroll("joyspeed");
});

function updateScroll(div_id){
    var element = document.getElementById(div_id);
    element.scrollTop = element.scrollHeight;
}


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

