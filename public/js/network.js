const TimeSeries = require("smoothie").TimeSeries;
const SmoothieChart = require("smoothie").SmoothieChart;
const si = require('systeminformation');

let chartOptions = [{
  limitFPS: 40,
  responsive: true,
  millisPerPixel: 70,
  interpolation: 'linear',
  grid:{
      millisPerLine: 5000,
      fillStyle:'transparent',
      strokeStyle:`rgba(${window.color_r},${window.color_g},${window.color_b},0.4)`,
      verticalSections:3,
      borderVisible:false
  },
  labels:{
      fontSize: 10,
      fillStyle: `rgb(${window.color_r},${window.color_g},${window.color_b})`,
      precision: 2
  }
}];

chartOptions.push(Object.assign({}, chartOptions[0]));
chartOptions[0].minValue = 0;
chartOptions[1].maxValue = 0;

let series = [new TimeSeries(), new TimeSeries()];
let charts = [new SmoothieChart(chartOptions[0]), new SmoothieChart(chartOptions[1])];

charts[0].addTimeSeries(series[0], {
  strokeStyle:'rgb(255, 0, 255)', 
  //fillStyle:'rgba(255, 0, 255, 0.3)',
  lineWidth:3
});

//strokeStyle:`rgb(${color_r},${color_g},${color_b})`

charts[1].addTimeSeries(series[1], {
  strokeStyle:'rgb(255, 0, 255)', 
  //fillStyle:'rgba(255, 0, 255, 0.3)',
  lineWidth:3
});

charts[0].streamTo(document.getElementById("network_in_status"), 4000);
charts[1].streamTo(document.getElementById("network_out_status"), 4000);

updateInfo();
setInterval(() => {
  updateInfo();
}, 3000);


function updateInfo() {
  let time = new Date().getTime();

  si.networkStats().then(data => {
      let max0 = series[0].maxValue;
      let max1 = -series[1].minValue;
      if (max0 > max1) {
          series[1].minValue = -max0;
      } else if (max1 > max0) {
          series[0].maxValue = max1;
      }

      document.getElementById("net_in").innerText = parseFloat(data[0].tx_sec/125000).toFixed(2);
      document.getElementById("net_out").innerText = parseFloat(data[0].rx_sec/125000).toFixed(2);

      series[0].append(time, data[0].tx_sec/125000);
      series[1].append(time, -data[0].rx_sec/125000);
  });
  
}