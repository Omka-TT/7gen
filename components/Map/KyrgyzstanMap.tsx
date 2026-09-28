'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, GeoJSON, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const canvasRenderer = L.canvas({ padding: 1.5 });

// Красная точка вместо стандартной синей "булавки" Leaflet
const dotIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 14px;
    height: 14px;
    background: #D22730;
    border: 2px solid #0a0a0a;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(210,39,48,0.4);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

type Place = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  region_slug?: string;
};

export default function KyrgyzstanMap({ places }: { places: Place[] }) {
  const [regionsGeoJson, setRegionsGeoJson] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [freeMode, setFreeMode] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const boundsRef = useRef<L.LatLngBounds | null>(null);
  const regionBoundsBySlug = useRef<Record<string, L.LatLngBounds>>({});

  // Загружаем границы областей
  useEffect(() => {
    fetch('/data/regions.geojson')
      .then((res) => res.json())
      .then((data) => setRegionsGeoJson(data))
      .catch((err) => console.error('Ошибка загрузки границ областей:', err));
  }, []);

  // Определяем, телефон это или нет
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Подгоняем вид под всю страну + запоминаем границы каждого региона отдельно
  useEffect(() => {
    if (regionsGeoJson && mapRef.current) {
      const layer = L.geoJSON(regionsGeoJson);
      const bounds = layer.getBounds();
      boundsRef.current = bounds;
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });

      const bySlug: Record<string, L.LatLngBounds> = {};
      regionsGeoJson.features.forEach((feature: any) => {
        const slug = feature.properties?.slug;
        if (slug) {
          bySlug[slug] = L.geoJSON(feature).getBounds();
        }
      });
      regionBoundsBySlug.current = bySlug;
    }
  }, [regionsGeoJson]);

  // Управляем поведением карты напрямую через объект Leaflet, а не через свойства React —
  // это единственный надёжный способ переключать их "на лету"
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (freeMode || isMobile) {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
    }

    const container = map.getContainer();
    container.style.cursor = freeMode ? 'grab' : 'default';
  }, [freeMode, isMobile]);

  const resetView = () => {
    if (mapRef.current && boundsRef.current) {
      mapRef.current.flyToBounds(boundsRef.current, {
        padding: [20, 20],
        duration: 0.8,
      });
    }
  };

  const toggleFreeMode = () => {
    if (freeMode) {
      resetView();
    }
    setFreeMode(!freeMode);
  };

  const flyToPlace = (place: Place) => {
    const map = mapRef.current;
    if (!map) return;

    const regionBounds = place.region_slug
      ? regionBoundsBySlug.current[place.region_slug]
      : null;

    if (regionBounds) {
      map.flyToBounds(regionBounds, { padding: [30, 30], duration: 0.8 });
    } else {
      map.flyTo([place.lat, place.lng], 9, { duration: 0.8 });
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Кнопка возврата к виду всей страны */}
      <button
  onClick={resetView}
  title="Вернуться к виду всей страны"
  className="absolute top-4 left-4 z-[1000] bg-white border border-red-300 text-black w-10 h-10 rounded-lg flex items-center justify-center hover:border-red-500 shadow-sm transition-colors"
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12l9-9 9 9" />
    <path d="M5 10v10h14V10" />
  </svg>
</button>

<button
  onClick={toggleFreeMode}
  title={freeMode ? 'Выключить свободное перемещение' : 'Включить свободное перемещение'}
  className={`absolute top-16 left-4 z-[1000] w-10 h-10 rounded-lg flex items-center justify-center border shadow-sm transition-colors ${
    freeMode
      ? 'bg-red-600 border-red-600 text-white'
      : 'bg-white border-red-300 text-black hover:border-red-500'
  }`}
>
  {freeMode ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 11V6a2 2 0 0 0-4 0v5" />
      <path d="M14 10V4a2 2 0 0 0-4 0v6" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M6 14v0a6 6 0 0 0 6 6h2a8 8 0 0 0 8-8v-1a2 2 0 0 0-4 0" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4l16 8-7 2-2 7-7-17z" />
    </svg>
  )}
</button>

      <MapContainer
        ref={mapRef}
        center={[41.2, 74.7]}
        zoom={7}
        minZoom={5}
        maxZoom={13}
        preferCanvas={true}
        renderer={canvasRenderer}
        className="h-full w-full"
        style={{ minHeight: '500px', background: '#ffffff' }}
        zoomControl={false}
        attributionControl={false}
        boxZoom={false}
        keyboard={false}
      >

        {/* Границы областей */}
        {regionsGeoJson && (
          <GeoJSON
            data={regionsGeoJson}
            style={{
              color: '#D22730',
              weight: 2,
              fillColor: '#D22730',
              fillOpacity: 0.08,
            }}
            onEachFeature={(feature, layer) => {
              const slug = feature.properties?.slug;
              const name = feature.properties?.shapeName;

              layer.on('mouseover', () => {
                (layer as any).setStyle({ fillOpacity: 0.35 });
              });
              layer.on('mouseout', () => {
                (layer as any).setStyle({ fillOpacity: 0.08 });
              });
              layer.on('click', () => {
                if (slug) {
                  window.location.href = `/regions/${slug}`;
                }
              });

              layer.bindTooltip(name, { sticky: true });
            }}
          />
        )}

        {/* Точки мест */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={dotIcon}
            eventHandlers={{
              click: () => flyToPlace(place),
            }}
          >
            <Popup>
              <div className="text-sm">
                <b>{place.name}</b>
                <p className="text-gray-500">{place.type}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

