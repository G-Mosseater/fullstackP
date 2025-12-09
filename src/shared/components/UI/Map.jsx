import "./Map.css";
import { useRef, useEffect } from "react";

const Map = ({ className, center, zoom }) => {
  const mapRef = useRef();

  useEffect(() => {
    async function initMap() {
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary(
        "marker"
      );
      const map = new Map(mapRef.current, {
        center: center,
        zoom: zoom,
        mapId: "d8faa6ece36c8025e2a3b37f"
      });
      new AdvancedMarkerElement({
        map,
        position: center,
      });
    }
    initMap();
  }, [center, zoom]);

  return <div className={`map ${className}`} ref={mapRef}></div>;
};

export default Map;
