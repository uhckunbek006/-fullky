"use client";

import { FC, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Navigation, Phone, Clock, MapPin, Compass } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import "leaflet/dist/leaflet.css";
import "./BasesMap.scss";

import { COAL_BASES, CoalBase } from "../basaSelector/BasaSelector";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const userIcon = L.divIcon({
  className: "user-location-marker",
  html: `<div class="pulse-dot"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

L.Marker.prototype.options.icon = defaultIcon;

const RecenterMap: FC<{ center: [number, number]; zoom?: number }> = ({
  center,
  zoom = 13,
}) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

interface BasesMapProps {
  onSelectBase?: (base: CoalBase) => void;
}

const BasesMap: FC<BasesMapProps> = ({ onSelectBase }) => {
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [bases, setBases] = useState<CoalBase[]>(COAL_BASES);
  const [selectedBase, setSelectedBase] = useState<CoalBase | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    42.8746, 74.5698,
  ]);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Геолокация не поддерживается вашим браузером");
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const uCoords: [number, number] = [latitude, longitude];
        setUserCoords(uCoords);
        setMapCenter(uCoords);

        const sorted = COAL_BASES.map((b) => ({
          ...b,
          distance: calculateDistance(latitude, longitude, b.lat, b.lng),
        })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

        setBases(sorted);
        setSelectedBase(sorted[0]);
        setGeoLoading(false);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setGeoError("Доступ к геолокации не разрешен");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <section id="BasesMap">
      <div className="container">
        <div className="BasesMap">
          <div className="BasesMap--header" data-aos="fade-down">
            <div className="title">
              <MapPin size={20} />
              <div>
                <h3>Угольные базы на карте</h3>
                <p>Найдите ближайшую базу</p>
              </div>
            </div>

            <button
              type="button"
              className={`geo-btn ${geoLoading ? "loading" : ""}`}
              onClick={handleDetectLocation}
              disabled={geoLoading}
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <Compass size={16} />
              <span>{geoLoading ? "Определение..." : "Найти ближайшую"}</span>
            </button>
          </div>

          {geoError && (
            <div className="BasesMap--error" data-aos="fade-in">
              {geoError}
            </div>
          )}

          {/* MAIN CONTENT AREA */}
          <div className="BasesMap--content">
            {/* MAP SECTION */}
            <div className="map-wrapper" data-aos="fade-right" data-aos-delay="150">
              <MapContainer
                center={mapCenter}
                zoom={11}
                scrollWheelZoom={true}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap center={mapCenter} zoom={selectedBase ? 14 : 11} />

                {userCoords && (
                  <Marker position={userCoords} icon={userIcon}>
                    <Popup>
                      <strong>Вы здесь</strong>
                    </Popup>
                  </Marker>
                )}

                {bases.map((base) => (
                  <Marker
                    key={base.id}
                    position={[base.lat, base.lng]}
                    eventHandlers={{
                      click: () => {
                        setSelectedBase(base);
                        setMapCenter([base.lat, base.lng]);
                      },
                    }}
                  >
                    <Popup>
                      <div className="map-popup">
                        <strong>{base.name}</strong>
                        <p>{base.address}</p>
                        <small>📞 {base.phone}</small>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* SIDEBAR LIST */}
            <div className="bases-sidebar" data-aos="fade-left" data-aos-delay="250">
              <h4>Список баз ({bases.length})</h4>
              <div className="bases-list">
                {bases.map((base, idx) => {
                  const isActive = selectedBase?.id === base.id;
                  const isNearest = idx === 0 && base.distance !== undefined;

                  return (
                    <div
                      key={base.id}
                      className={`base-item ${isActive ? "active" : ""}`}
                      onClick={() => {
                        setSelectedBase(base);
                        setMapCenter([base.lat, base.lng]);
                      }}
                      data-aos="fade-up"
                      data-aos-delay={100 + idx * 80}
                      data-aos-anchor=".bases-sidebar"
                    >
                      <div className="base-item--head">
                        <span className="region">{base.region}</span>
                        {base.distance !== undefined && (
                          <span className="distance">
                            <Navigation size={12} /> {base.distance} км
                          </span>
                        )}
                      </div>

                      <h5>
                        {base.name}{" "}
                        {isNearest && <span className="badge">Ближайшая</span>}
                      </h5>

                      <p className="address">
                        <MapPin size={13} /> {base.address}
                      </p>

                      <div className="details">
                        <span>
                          <Phone size={12} /> {base.phone}
                        </span>
                        <span>
                          <Clock size={12} /> {base.workHours}
                        </span>
                      </div>

                      {onSelectBase && (
                        <button
                          type="button"
                          className="select-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBase(base);
                          }}
                        >
                          Выбрать эту базу
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasesMap;