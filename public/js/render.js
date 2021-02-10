const color_r = 170;
const color_g = 207;
const color_b = 209;
const light_black = "#05080d";

const {webFrame} = require('electron');

webFrame.setZoomFactor(0.8);

function loadNewWindow() {
  console.log("open new window");
  const { BrowserWindow } = require('electron').remote;
  const remote_window = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    }
  });
  
  remote_window.loadURL(`file://${__dirname}/armcontrol.html`);
}

function create_globe(div_id) {
  VANTA.GLOBE({
    el: div_id,
    mouseControls: false,
    touchControls: true,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 0.70,
    scaleMobile: 1.00,
    backgroundColor: light_black,
  });
}

function updateScroll(div_id){
  var element = document.getElementById(div_id);
  element.scrollTop = element.scrollHeight;
}


function videoPlayButtonControl(control_id, e) {
  if (e.type === "mouseout") {
    $(control_id).css("display", "none");
  } else {
    $(control_id).css("display", "block");
  }
}

let streaming = {
  "drive_video_wrapper": false,
  "arm_video_wrapper": false,
  "base_video_wrapper": false,
  "grip_video_wrapper": false,
};

function subscribeCameraTopic(camera_id, camera_name, brand) {
  let video = document.getElementById(camera_id);
  if (streaming[camera_id] == false) {
      streaming[camera_id] = true;
      video.innerHTML = `<img id="${camera_name}" class="usb_cam">`;
      video.style.marginTop = 0;
      video.style.marginLeft = 0;
      camera_info_topic.subscribe(function(message) {
          document.getElementById(camera_name).src = "data:image/jpg;base64," + message.data;
      });
      log_status(CAMERA_SUB_ON, "status");
  } else if (streaming[camera_id] == true) {
      streaming[camera_id] = false;
      camera_info_topic.unsubscribe();
      log_status(CAMERA_SUB_OFF, "status");
      video.innerHTML =  `<h1>${brand}</h1>`;
      video.style.marginTop = "auto";
      video.style.marginLeft = "auto";
      create_globe('#' + camera_id);
  }
}
