import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getAllDevices } from "../../api/deviceApi";
import { getGpsDataByDeviceId } from "../../api/gpsApi";
import "leaflet/dist/leaflet.css";

const defaultPosition: [number, number] = [10.3157, 123.8854]; // Cebu

interface GpsData {
  lat: number;
  long: number;
  speed: number;
  timestamp: number;
}

interface DeviceLocation {
  deviceId: string;
  data?: GpsData;
  hasValidCoords: boolean;
}

export default function LiveBus() {
  const [deviceLocations, setDeviceLocations] = useState<DeviceLocation[]>([]);

  const fetchAll = async () => {
    try {
      const devices = await getAllDevices();
      const results = await Promise.all(
        devices.map(async (device: any) => {
          try {
            const data = await getGpsDataByDeviceId(device.deviceUID);
            const lat = parseFloat(data.lat as any);
            const long = parseFloat(data.long as any);
            const hasValidCoords = !isNaN(lat) && !isNaN(long);

            return {
              deviceId: device.deviceUID,
              data: hasValidCoords ? { ...data, lat, long } : data,
              hasValidCoords,
            };
          } catch (err) {
            console.warn(`GPS fetch failed for device ${device.deviceUID}`, err);
            return {
              deviceId: device.deviceUID,
              hasValidCoords: false,
            };
          }
        })
      );
      setDeviceLocations(results);
    } catch (err) {
      console.error("Failed to fetch devices or GPS data:", err);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Live Bus Tracking</h2>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {deviceLocations
          .filter((d) => !d.hasValidCoords)
          .map((d) => (
            <div
              key={d.deviceId}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                minWidth: "200px",
              }}
            >
              <strong>Device: {d.deviceId}</strong>
              <br />
              Speed: {d.data?.speed ?? "N/A"} km/h
              <br />
              <em>No GPS data available</em>
            </div>
          ))}
      </div>

      <div style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
        <MapContainer center={defaultPosition} zoom={13} style={{ height: "600px", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {deviceLocations
            .filter((d) => d.hasValidCoords && d.data)
            .map(({ deviceId, data }) => (
              <Marker
                key={deviceId}
                position={[data!.lat, data!.long]}
                icon={L.icon({
                  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              >
                <Popup>
                  <strong>{deviceId}</strong>
                  <br />
                  Speed: {data!.speed} km/h
                  <br />
                  Time: {new Date(data!.timestamp).toLocaleTimeString()}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
