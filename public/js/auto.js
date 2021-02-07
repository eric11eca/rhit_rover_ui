let map;


function initMap() {
  const myLatLng = { lat: 32.4990759, lng: -94.0573511 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 32.4990759, lng: -94.0573511 },
    zoom: 15,
  });
  new google.maps.Marker({
		position: myLatLng,
		map,
    title:"Hello World!"
  });
}


// var marker = new google.maps.Marker({
//     position: myLatlng,
//     title:"Hello World!"
// });
// marker.setMap(map);


const term = new Terminal();

term.open(document.getElementById("terminal_container"));
term.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");