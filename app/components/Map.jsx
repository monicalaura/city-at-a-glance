import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Overlay from "ol/Overlay";
import { defaults as defaultControls, ZoomToExtent } from "ol/control";

export default function MapComponent({ latitude, longitude }) {
  const mapRef = useRef(null);
  const previousView = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create a new map when latitude or longitude changes
    const map = new Map({
      target: mapRef.current,
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

    // Store the initial view
    previousView.current = map.getView().getProperties();

    // Add a marker to the map
    const marker = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
    });
    const vectorSource = new VectorSource({
      features: [marker],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

    // Add a popup overlay to the map
    const popup = new Overlay({
      element: document.getElementById("popup"),
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -50],
    });

    map.addOverlay(popup);

    // Zoom in when the marker is clicked
    marker.on("click", () => {
      map.getView().animate({
        center: fromLonLat([longitude, latitude]),
        zoom: 16, // Adjust the zoom level as needed
        duration: 1000, // Animation duration in milliseconds
      });
    });

    mapRef.current.olMap = map;

    return () => {
      // Clean up the map when the component is unmounted
      map.setTarget("");
    };
  }, [latitude, longitude]);

  // Handle zoom out event
  const handleZoomOut = () => {
    if (previousView.current) {
      mapRef.current.olMap.getView().setProperties(previousView.current);
    }
  };

  return (
    <div>
      <h1>{name}</h1>
      <div
        id="map"
        ref={mapRef}
        style={{
          height: "400px",
          width: "100%",
          boxShadow: "0px -5px 5px -5px rgba(63, 61, 86, 0.8)",
        }}
      ></div>
      <div id="popup" className="ol-popup">
        <a href="#" id="popup-closer" className="ol-popup-closer"></a>
        <div id="popup-content"></div>
      </div>
      <button onClick={handleZoomOut}>Reset View</button>
    </div>
  );
}
