const color_r = 170;
const color_g = 207;
const color_b = 209;

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

//window.audioManager = new AudioManager();

function create_globe(div_id) {
  VANTA.GLOBE({
    el: div_id,
    mouseControls: false,
    touchControls: true,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    backgroundColor: 0x191919,
  });
}

function updateScroll(div_id){
  var element = document.getElementById(div_id);
  element.scrollTop = element.scrollHeight;
}

