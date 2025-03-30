// Create map object
let map = L.map("map").setView([37.09, -95.71], 5); // Centered on US

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Get Earthquake data from USGS
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(data => {
  function getColor(depth) {
    return depth > 90 ? "#ea2c2c" :
           depth > 70 ? "#ea822c" :
           depth > 50 ? "#ee9c00" :
           depth > 30 ? "#eecc00" :
           depth > 10 ? "#d4ee00" :
                        "#98ee00";
  }

  function getRadius(magnitude) {
    return magnitude === 0 ? 1 : magnitude * 4;
  }

  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: function (feature) {
      return {
        color: "#000",
        weight: 0.5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.8,
        radius: getRadius(feature.properties.mag)
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
        <strong>Location:</strong> ${feature.properties.place}<br>
        <strong>Magnitude:</strong> ${feature.properties.mag}<br>
        <strong>Depth:</strong> ${feature.geometry.coordinates[2]}
      `);
    }
  }).addTo(map);

  // Add legend
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 50, 70, 90],
        colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        `<i style="background:${colors[i]}"></i> ${depths[i]}${depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+"}`;
    }

    return div;
  };

  legend.addTo(map);
});
