function cityToGeoJSON(properties, coordinates) {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates,
        },
        properties,
    };
}

// let coords = [151.21, -33.868];
// let attribs = {
//     city: 'Sydney, AU',
//     listeners: 99999
// }

// console.log(cityToGeoJSON(attribs, coords));
