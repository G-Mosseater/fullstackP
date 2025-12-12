import "./Map.css";
import { useRef, useEffect } from "react";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
console.log("API URL IS HTIS", apiKey);
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
        mapId: apiKey,
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
