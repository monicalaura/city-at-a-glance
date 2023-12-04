//Open Layers Map

import React, { useEffect } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls, ZoomToExtent } from 'ol/control';


export default function MapComponent({ latitude, longitude }) {


  useEffect(() => {
    // Create a new map when latitude or longitude changes
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      controls: defaultControls().extend([new ZoomToExtent()]),
      view: new View({
        center: fromLonLat([longitude, latitude]),
        zoom: 13,
      }),
    });

    // Add a marker to the map
    const marker = new Feature(new Point(fromLonLat([longitude, latitude])));
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [marker],
      }),
    });

    map.addLayer(vectorLayer);

    // Add a popup overlay to the map
    const popup = new Overlay({
      element: document.getElementById('popup'),
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -50],
    });

    map.addOverlay(popup);

    // Show the popup when the marker is clicked
    map.on('click', (event) => {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature instanceof Feature && feature
      );

      if (feature && feature.getGeometry()) {
        const coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
      }
    });

    return () => {
      // Clean up the map when the component is unmounted
      map.setTarget('');
    };
  }, [latitude, longitude]);

  return (
    <div>
      <h1>{name}</h1>
      <div id="map" style={{ height: '400px', width: '100%', boxShadow: '0px -5px 5px -5px rgba(63, 61, 86, 0.8)' }} ></div>
      <div id="popup" className="ol-popup">
        <a href="#" id="popup-closer" className="ol-popup-closer"></a>
        <div id="popup-content"></div>
      </div>
    </div>
  );
}
