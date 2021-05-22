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

window.ros_topics = {
    "drive_cam": new ROSLIB.Topic({
        ros: ros, name: '/d435/color/image_raw/compressed',
        messageType: 'sensor_msgs/CompressedImage'
    }),

    "wide_cam": new ROSLIB.Topic({
        ros: ros, name: '/base_cam/image_raw/compressed',
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
    }),

    "control_msg": new ROSLIB.Topic({
        ros: ros, name: '/driveCommands',
        messageType: 'std_msgs/Float32MultiArray'
    }),

    "heading_msg": new ROSLIB.Topic({
        ros: ros, name: 'heading',
        messageType: 'std_msgs/Float32'
    }),

    "gps_msg": new ROSLIB.Topic({
        ros: ros, name: 'navsat/fix',
        messageType: 'sensor_msgs/NavSatFix'
    }),

    "odom_msg": new ROSLIB.Topic({
        ros: ros, name: '/odom',
        messageType: 'nav_msgs/Odometry'
    }),
};

function round_data(num) {
    return Math.round((num + Number.EPSILON) * 1000) / 1000;
}

window.ros_topics["control_msg"].subscribe(function (message) {
    left_speed = round_data(message.data[0])
    right_speed = round_data(message.data[1])
    document.getElementById('control_msg').innerText = `LEFT:${left_speed}, RIGHT:${right_speed}`
    document.getElementById('control_state').innerText = "ACTIVE"
});

window.ros_topics["heading_msg"].subscribe(function (message) {
    document.getElementById('heading_msg').innerText = `${round_data(message.data)} degrees`
    document.getElementById('heading_state').innerText = "ACTIVE"
});

window.ros_topics["gps_msg"].subscribe(function (message) {
    document.getElementById('gps_msg').innerText = `X: ${message[0]}, ${message[1]}`
    document.getElementById('gps_state').innerText = "ACTIVE"
});

window.ros_topics["odom_msg"].subscribe(function (message) {
    document.getElementById('odom_msg').innerText = `POSE:${message.pose}, VEL:${message.twist}`
    document.getElementById('odom_state').innerText = "ACTIVE"
});

function log_status(messgae, div_id) {
    var node = document.createElement("H6");
    node.innerHTML = messgae;
    document.getElementById(div_id).appendChild(node);
    window.updateScroll(div_id);
    //window.audioManager.folder.play();
}

