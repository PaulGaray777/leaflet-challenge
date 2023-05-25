// creating the map
var map = L.map("map", {
    center: [0, 0],
    zoom: 1.5,
  });
  
  initialize();
  
  function initialize() {
  
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  
    console.log("Map initialized successfully");
  }
  
  // fetching earthquake data from the url which provide our JSON
  const datasetUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  d3.json(datasetUrl)
    .then(function (data) {
      data.features.forEach((earthquake) => {
        let mag = earthquake.properties.mag;
        let lat = earthquake.geometry.coordinates[1];
        let lon = earthquake.geometry.coordinates[0];
        let place = earthquake.properties.place;
        let time = earthquake.properties.time;
        let depth = earthquake.geometry.coordinates[2];
  
        // defining the marker size and color based on the magnitude and depth
        let size = mag;
        let color = getColor(depth);
  
        // creating a circle marker for the earthquake with popup showing all the relevant information
        let marker = L.circleMarker([lat, lon], {
          radius: size,
          fillColor: color,
          fillOpacity: 0.6,
          color: "#000",
          weight: 1.7,
          opacity: 0.7,
        })
          .bindPopup(
            `Magnitude: M${mag}<br>Location: ${place}<br>Latitude: ${lat}°<br>Longitude: ${lon}°<br>
            Time: ${new Date(time)}<br>Depth: ${depth} km`
          )
          .addTo(map);
  
        // creating the click event to the circle marker to open the popup with the relevant information
        marker.on("click", () => {
          marker.openPopup();
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching earthquake data:", error);
    });
  
  // function to determine marker color based on depth
  function getColor(depth) {
    if (depth < 10) {
      return "green";
    } else if (depth < 30) {
      return "yellow";
    } else if (depth < 50) {
      return "red";
    } else if (depth < 70) {
      return "darkred";
    } else {
      return "brown";
    }
  }
  
  // creating our legend with information about the depths ranges
  var legend = L.control({ position: "bottomright" });
  
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let differentDepths = [-10, 10, 30, 50, 70, 90];

    // adding title to the legend
    div.innerHTML = "<h4>Depths (km)</h4>";
  
    // looping through the depth ranges for the labels creation for our legend
    for (let i = 0; i < differentDepths.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        getColor(differentDepths[i] + 1) +
        '"></i> ' +
        differentDepths[i] +
        (differentDepths[i + 1] ? "&ndash;" + differentDepths[i + 1] + " km<br>" : "+ km");
        
    // console log for debugging
    console.log("Current depth:", differentDepths[i]);
    }
  
    return div;
  };
  
  legend.addTo(map);
  
  
  
  
