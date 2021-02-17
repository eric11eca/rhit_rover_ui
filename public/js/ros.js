const CONNECTION_ON = "=> Connection to websocket server started";
const CONNECTION_OFF = "=> Connection to websocket server closed";
const CONNECTION_ERROR = "=> !Error connecting to websocket server!";
const CAMERA_SUB_ON = "=> Subscribed to camera topic";
const CAMERA_SUB_OFF = "=> Unsubscribed to camera topic";
const JOY_SUB_ON = "=> Subscribed to joy_speed topic";
const JOY_SUB_OFF = "=> Unsubscribed joy_speed topic";


const rosbridge_url = `ws://${window.ros_url}:9090`;
var first_close = true;

var ros = new ROSLIB.Ros({
    url : rosbridge_url
});

ros.on('connection', function() {
    log_status(CONNECTION_ON, "status");
    first_close = true;
});

ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
    log_status(CONNECTION_OFF, "status");
    if (first_close) {
        first_close = false;
    }
});

window.setInterval(function(){
    if (ros.isConnected) return;
    ros.connect(rosbridge_url);
}, 1000);

window.setInterval(function() {
    ros.getNodes(function(nodes) {
        updateNodeStatus(nodes);
    });
}, 1000);

window.ros_topics = {
    "drive_cam": new ROSLIB.Topic({
        ros: ros, name: '/d435/color/image_raw/compressed',
        messageType: 'sensor_msgs/CompressedImage'
    }),
    
    "grip_cam": new ROSLIB.Topic({
        ros: ros, name: '/grip_cam/image_raw/compressed',
        messageType: 'sensor_msgs/CompressedImage'
    }),
    
    "base_cam": new ROSLIB.Topic({
        ros: ros, name: '/base_cam/image_raw/compressed',
        messageType: 'sensor_msgs/CompressedImage'
    }),
    
    "microscope_cam": new ROSLIB.Topic({
        ros: ros, name: '/microscope_cam/image_raw/compressed',
        messageType: 'sensor_msgs/CompressedImage'
    })
};



var joy_info_topic = new ROSLIB.Topic({
    ros: ros, name: '/driveCommands',
    messageType: 'std_msgs/Float32MultiArray'
});



function log_status(messgae, div_id) {
    var node = document.createElement("H6");
    node.innerHTML = messgae;
    document.getElementById(div_id).appendChild(node);
    window.updateScroll(div_id);
    //window.audioManager.folder.play();
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

