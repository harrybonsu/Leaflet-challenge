var earthQuakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'

// Perform a GET request to the query URL
d3.json(earthQuakeUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
   // console.log(data);
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<h4> Magnitude: " + feature.properties.mag + "</h4>");
    }
    // Function for Circle Color Base on Criteria. The Color Scale is base of the 7 colors of a Rainboy ROY G BIV
    function QuakeColor(color) {
        switch (true) {
            case (color >= 4.0 && color <= 5.0):
                return "Blue";
            case (color >= 5.0 && color <= 6.0):
                return "Purple";
            case (color >= 6.0 && color <= 7.0):
                return "Yellow";
            case (color >= 7.0 && color <= 8.0):
                return "Red";
            default:
                return "Pink";
        }
    }
    //   Create a circle function

    function CircleMaker(features, latlng) {
        var CircleOptions = {
            radius: features.properties.mag * 5,
            fillColor: QuakeColor(features.properties.mag),
            color: QuakeColor(features.properties.mag),
            fillOpacity: .3

        }
        return L.circleMarker(latlng, CircleOptions)
    }
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: CircleMaker
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and Satellite layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var Satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
    });


    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Light Map": lightmap,
        "Satellite Map": Satellite
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 2,
        layers: [Satellite, earthquakes]
    });

        // Create a layer control
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // Create a legend to display information about our map
    var info = L.control({
        position: "bottomright"
    });
    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        return div;
    };
    // Add the info legend to the map
    info.addTo(myMap);
}

