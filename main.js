let map, draw, source, layer;

initializeMap = () => {

    source = new ol.source.Vector({ wrapX: false });

    layer = new ol.layer.Vector({
        source: source,
    });

    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            layer
        ],
        view: new ol.View({
            center: [3875337.272593909, 4673762.797695817],
            zoom: 7
        })
    });
}

addInteraction = () => {

    draw = new ol.interaction.Draw({
        source: source,
        type: "LineString"
    });

    map.addInteraction(draw);

    draw.setActive(false);

    draw.on("drawend",
        (event) => {

            console.log(event.feature.getGeometry().getCoordinates());

            draw.setActive(false);
        });
}

addDrawing = () => {

    draw.setActive(true);
}