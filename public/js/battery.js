const Smoothie = require('smoothie');

let battery_size = 100;
let time_count = 1;

var battery_status = new Smoothie.SmoothieChart({
  limitFPS: 30,
  responsive: true,
  millisPerPixel: 50,  
  grid:{
    fillStyle:'transparent',
    strokeStyle:'transparent',
    verticalSections:0,
    borderVisible:false
  },
  labels: { fillStyle:'rgb(255, 255, 255)' },
  minValue: 0.0, 
  maxValue: 1.0,
});


battery_status.streamTo(document.getElementById("battery"), 1000);

var line3 = new Smoothie.TimeSeries();

setInterval(function() {
  line3.append(new Date().getTime(), battery_size/100);
  document.getElementById("battery_percent").innerText = battery_size + '%';
  time_count += 1;
  if (time_count % 7 == 0) battery_size -= 3;
  if (battery_size == 0) battery_size = 100;
}, 1000);

battery_status.addTimeSeries(line3, { 
  strokeStyle:'rgb(0, 255, 0)', 
  fillStyle:'rgba(0, 255, 0, 0.4)', 
  lineWidth:3 
});
