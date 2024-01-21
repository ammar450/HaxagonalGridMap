mapboxgl.accessToken = 'pk.eyJ1Ijoib2xpZ2FzIiwiYSI6ImNscG81NGd0ajBzeWYya3F5NGg1ejRzMHAifQ.LHIi266Bo0loKzlbpscWPg'; // Replace with your Mapbox access token
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // Mapbox street style
    center: [-98.5795, 39.8283], // Center the map on the United States
    zoom: 3 // Set the initial zoom level
});

map.on('click', function(e) {
    var coordinates = [e.lngLat.lng, e.lngLat.lat]; // Convert to an array
    addOctagonToMap(coordinates);
});

function addOctagonToMap(center) {
    var radiusInKilometers = 20/1000 // Convert 20 meters to kilometers
    var octagon = turf.circle(center, radiusInKilometers, { steps: 8, units: 'kilometers' });

    var octagonFeature = {
        'type': 'Feature',
        'geometry': octagon.geometry,
        'properties': {}
    };

    if (map.getSource('octagon-source')) {
        map.getSource('octagon-source').setData(octagonFeature);
    } else {
        map.addSource('octagon-source', {
            'type': 'geojson',
            'data': octagonFeature
        });

        map.addLayer({
            'id': 'octagon-layer',
            'type': 'fill',
            'source': 'octagon-source',
            'layout': {},
            'paint': {
                'fill-color': '#ff69b4', // Pink color fill
                'fill-opacity': 0.5
            }
        });
    }

    // Zoom to the octagon
    var bounds = turf.bbox(octagon);
    map.fitBounds(bounds, { padding: 20 });
}
