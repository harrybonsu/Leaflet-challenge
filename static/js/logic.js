var earthQuakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'

// Perform a GET request to the query URL
d3.json(earthQuakeUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data);
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
            case (color <= 0 && color <= 1.0):
                return "Red";
            case (color <= 1.0 && color <= 2.0):
                return "Orange";
            case (color <= 2.0 && color <= 3.0):
                return "Yellow";
            case (color <= 3.0 && color <= 4.0):
                return "Green";
            case (color <= 4.0 && color <= 5.0):
                return "Blue";
            case (color <= 5.0 && color <= 6.0):
                return "Purple";
            default:
                return "Pink";
        }
    }
    //   Create a circle function

    function CircleMaker(features, latlng) {
        var CircleOptions = {
            radius: features.properties.mag * 8,
            fillColor: QuakeColor(features.properties.mag),
            color: QuakeColor(features.properties.mag),
            opacity: 1.0,
            fillOpacity: .5

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
