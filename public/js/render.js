const { webFrame } = require('electron');
const fs = require('fs');

function loadNewWindow() {
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

window._purifyCSS = str => {
  if (typeof str === "undefined") return "";
  if (typeof str !== "string") {
      str = str.toString();
  }
  return str.replace(/[<]/g, "");
};

let themeFile = fs.readFileSync(`${__dirname}/themes/tron.json`);
let theme = JSON.parse(themeFile);


window.ros_url = theme.ros.ip;
window.color_r = theme.colors.r;
window.color_g = theme.colors.g;
window.color_b = theme.colors.b;
window.black = theme.colors.black;
window.light_black = theme.colors.light_black;
window.grey = theme.colors.grey;

if (document.querySelector("style.theming")) {
  document.querySelector("style.theming").remove();
}

webFrame.setZoomFactor(theme.window.zoom_factor);
document.getElementById("battery").style.width = theme.window.battery_plot_width;
document.getElementById("network_in_status").style.width = theme.window.network_in_width;
document.getElementById("network_out_status").style.width = theme.window.network_out_width;

document.documentElement.style.setProperty('--color_r', theme.colors.r);
document.documentElement.style.setProperty('--color_g', theme.colors.g);
document.documentElement.style.setProperty('--color_r', theme.colors.b);
document.documentElement.style.setProperty('--color_black', theme.colors.black);
document.documentElement.style.setProperty('--color_light_black', theme.colors.light_black);
document.documentElement.style.setProperty('--color_grey', theme.colors.grey);


const{ exec } = require("child_process");


window.create_globe = function(div_id) {
  VANTA.GLOBE({
    el: div_id,
    mouseControls: false,
    touchControls: true,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 0.70,
    scaleMobile: 1.00,
    backgroundColor: window.light_black,
  });
};

window.updateScroll = function (div_id) {
  var element = document.getElementById(div_id);
  element.scrollTop = element.scrollHeight;
};

window.videoPlayButtonControl = function(control_id, e) {
  if (e.type === "mouseout") {
    $(control_id).css("display", "none");
  } else {
    $(control_id).css("display", "block");
  }
};



document.getElementById("Button1").onclick = function(){
  console.log("Button1");
  var path;
  exec("pwd", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    path = stdout;
    console.log(path)
  });

  exec("pwd",(error0,stdout0,stderr0) =>{
    stdout0 = stdout0.substring(0,stdout0.length-1);
    exec("bash " + stdout0 + "/public/shell/test.sh", (error1, stdout1, stderr1) => {
      if (error1) {
        console.log(`error: ${error.message}`);
          return;
      }
      if (stderr1) {
          console.log(`stderr: ${stderr}`);
          return;
      }  
      console.log(`stdout:\n${stdout1}`);
    
    });
  });
};







const { Loader } = require("@googlemaps/js-api-loader");

let map;

const loader = new Loader({
  apiKey: "AIzaSyCoWpS31KRwGSgzU8bmGoF8kVkYwf9lAu0",
  version: "weekly",
});


let locations = [{ lat: 39.485791, lng: -87.321623},
                 { lat: 39.485828, lng: -87.321923},
                 { lat: 39.485910, lng: -87.322143},
                 { lat: 39.485943, lng: -87.322355},
                 { lat: 39.485982, lng: -87.322494}];

let time_count_map = 0;

loader.load().then(() => {
  console.log("Got MAPS");
  const myLatLng = { lat: 39.485791, lng: -87.321623};
  map = new google.maps.Map(document.getElementById("map"), {
    center: myLatLng,
    zoom: 20,
  });
});

timer = 0
setInterval(function() {
  if (timer % 10 == 0) {
    if (time_count_map % 3 == 0) {
      var i = time_count_map / 3;
      if (i < 8) {
        var marker = new google.maps.Marker({
          position: locations[i]
        });
        marker.setMap(map);
        
        if (i > 0) {
          const flightPath = new google.maps.Polyline({
            path: [locations[i-1], locations[i]],
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });
          flightPath.setMap(map);
        }
      }
    }
    time_count_map += 1;
    document.getElementById('gps_msg').innerText = `Lat: ${locations[i]['lat']}, Lng: ${locations[i]['lng']}`;
    document.getElementById('gps_state').innerText = "ACTIVE";
  }
  timer += 1;
}, 1000);

window.streaming = {
  "drive_video_wrapper": false,
  "arm_video_wrapper": false,
  "base_video_wrapper": false,
  "grip_video_wrapper": false,
};

window.subscribeCameraTopic = function(camera_id, camera_name, brand) {
  let video = document.getElementById(camera_id);
  let camera_topic = window.ros_topics[camera_name];

  if (window.streaming[camera_id] == false) {
    window.streaming[camera_id] = true;
    video.innerHTML = `<img id="${camera_name}" class="usb_cam">`;
    video.style.marginTop = 0;
    video.style.marginLeft = 0;
    
    camera_topic.subscribe(function (message) {
      document.getElementById(camera_name).src = "data:image/jpg;base64," + message.data;
    });
    
    window.log_status(CAMERA_SUB_ON, "status");
  } else if (streaming[camera_id] == true) {
    window.streaming[camera_id] = false;
    window.log_status(CAMERA_SUB_OFF, "status");
    camera_topic.unsubscribe();

    video.innerHTML = `<h1>${brand}</h1>`;
    video.style.marginTop = "auto";
    video.style.marginLeft = "auto";

    if (camera_name == "grip_cam") {
      time_count_map = 0;
      video.innerHTML = `<div id="map"></div>`;

      loader.load().then(() => {
        console.log("Got MAPS");
        const myLatLng = { lat: 39.4838804, lng: -87.3287343};
        map = new google.maps.Map(document.getElementById("map"), {
          center: myLatLng,
          zoom: 17,
        });
      
        new google.maps.Marker({
          position: myLatLng,
          map
        });
      });
    } else {
      window.create_globe('#' + camera_id);
    }
  }
};



//window.audioManager = new AudioManager();
//window.audioManager.stdout.play();
//window.audioManager.theme.play();

/*
document.querySelectorAll(".mod_column").forEach(e => {
  e.setAttribute("class", "mod_column activated");
});

let i = 0;
let left = document.querySelectorAll("#mod_column_left > div");
let right = document.querySelectorAll("#mod_column_right > div");
let x = setInterval(() => {
  if (!left[i] && !right[i]) {
    clearInterval(x);
  } else {
    window.audioManager.panels.play();
    if (left[i]) {
      left[i].setAttribute("style", "animation-play-state: running;");
    }
    if (right[i]) {
      right[i].setAttribute("style", "animation-play-state: running;");
    }
    i++;
  }
}, 500);
*/
