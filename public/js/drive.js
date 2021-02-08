//google.charts.load("current", { packages: ["gauge"] });
//google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ["Label", "Value"],
    ["Left Velocity", 0],
    ["Right Velocity", 0],
  ]);

  var options = {
    width: 350,
    height: 150,
    redFrom: 90,
    redTo: 100,
    yellowFrom: 75,
    yellowTo: 90,
    minorTicks: 5,
  };

  var chart = new google.visualization.Gauge(
    document.getElementById("chart_div")
  );

  chart.draw(data, options);

  /*joy_info_topic.subscribe(function(message){
    //document.getElementById("joyspeed").innerHTML = message.data;
    setInterval(function () {
      data.setValue(0, 1, parseFloat(message.data)*100);
      chart.draw(data, options);
    }, 13000);
    setInterval(function () {
      data.setValue(1, 1, parseFloat(message.data)*100);
      chart.draw(data, options);
    }, 5000);
    });*/

}

var updateInterval = 100;

var chart2 = new Rickshaw.Graph({
    element: document.querySelector("#joy_chart"),
    width: "200",
    height: "120",
    renderer: "line",
    min: "0",
    max: "100",
    series: new Rickshaw.Series.FixedDuration([{
        name: 'one',
        color: '#fff'
    }], undefined, {
        timeInterval: updateInterval,
        maxDataPoints: 100
    })
});

var y_axis = new Rickshaw.Graph.Axis.Y({
    graph: chart2,
    orientation: 'left',
    tickFormat: function (y) {
        return y.toFixed(2);
    },
    color:"#fff",
    ticks: 5,
    element: document.getElementById('y_axis'),
});

const si = require('systeminformation');

//setInterval(insertRandomDatapoints, updateInterval);

async function insertRandomDatapoints() {
  let tmpData = {
      one: 0
  };
  
  si.networkInterfaces().then(data => {
    tmpData.one = data[0].speed/10;
  });

  await chart2.series.addData(tmpData);
  await chart2.render();
}

// const term = new Terminal();

// term.open(document.getElementById("terminal_container"));
// term.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
