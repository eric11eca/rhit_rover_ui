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


var marker = new google.maps.Marker({
     position: myLatlng,
     title:"Hello World!"
});
marker.setMap(map);