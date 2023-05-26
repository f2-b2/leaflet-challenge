//Create map object
let myMap = L.map("map", {
    center: [39.8282, -98.5696],
    zoom: 5
});


//Create tile layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Set url = to our API endpoint
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// GET request
d3.json(url).then(function(data) {
    console.log(data.features);
    createFeatures(data.features);
  });
  

  // Determine marker size
  function marker_size(magnitude) {
    return magnitude * 9500;
  };


  // Determine marker color
function marker_color(depth){
    if (depth < 10) return "#0097CE";
    else if (depth < 30) return "#38D430";
    else if (depth < 50) return "#FFE800";
    else if (depth < 70) return "#FFAB4D";
    else if (depth < 90) return "#FF7276";
    else return "#FF40B4";
  };

// Plots earthquakes 
function createFeatures(earthquake_data) {

    // Create pup that describes the place, time, mag, and depth of each earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Place: ${feature.properties.place}
      <hr>Time: ${new Date(feature.properties.time)}
      <hr>Magnitude: ${feature.properties.mag}
      <hr>Depth: ${feature.geometry.coordinates[2]}
      </h3>`);
      // 
    }

    // Add create and add earthquakes to myMap
    var earthquakes = L.geoJSON(earthquake_data, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        
        // Determine marker style
        var markers = {
          radius: marker_size(feature.properties.mag),
          fillColor: marker_color(feature.geometry.coordinates[2]),
          fillOpacity: 0.8,
          color: "black",
          weight: .5
        };
        return L.circle(latlng, markers);
      }
    }).addTo(myMap);

    // Add legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
    
        var div = L.DomUtil.create('div', 'legend'),
        depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML+='Depth<br><hr>'
    
        // Loop through density intervals 
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style = "background:' + marker_color(depth[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    
    return div;
    };
    
    legend.addTo(myMap);
};
  
