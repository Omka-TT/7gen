'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapContainer, GeoJSON, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const canvasRenderer = L.canvas({ padding: 1.5 });

const CATEGORY_ORDER = ['hotel', 'cafe', 'attraction', 'guide', 'campsite'];

// Иконки внутри красной точки (viewBox 24x24)
const ICONS: Record<string, string> = {
  hotel:
    '<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16"/><path d="M15 9h4a1 1 0 0 1 1 1v11"/><path d="M8 8h3M8 12h3M8 16h3"/>',
  cafe:
    '<path d="M5 8h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V8z"/><path d="M16 9h2a2 2 0 0 1 0 4h-2"/><path d="M8 3v2M12 3v2"/>',
  attraction: '<path d="M3 19l6-10 4 6 2-3 6 7H3z"/>',
  guide: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"/>',
  campsite: '<path d="M3 20L12 5l9 15z"/><path d="M12 20v-6"/>',
};

const iconCache = new Map<string, L.DivIcon>();

function getIcon(type: string, selected: boolean) {
  const key = `${type}-${selected}`;
  const cached = iconCache.get(key);
  if (cached) return cached;

  const size = selected ? 38 : 30;
  const svg = ICONS[type] ?? ICONS.attraction;

  const icon = L.divIcon({
    className: '',
    html: `<div class="${selected ? 'marker-selected' : ''}" style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:#D22730;border:3px solid #fff;
      box-shadow:0 4px 12px rgba(0,0,0,.25);
      display:flex;align-items:center;justify-content:center;">
      <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none"
        stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${svg}</svg>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

  iconCache.set(key, icon);
  return icon;
}

type Place = {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  price_range: string | null;
  type: string;
  lat: number;
  lng: number;
  region_slug?: string;
};

type Labels = {
  all: string;
  learnMore: string;
  close: string;
  reset: string;
  freeOn: string;
  freeOff: string;
  hint: string;
  categories: Record<string, string>;
};

export default function KyrgyzstanMap({
  places,
  regionNames,
  labels,
  lang,
}: {
  places: Place[];
  regionNames: Record<string, string>;
  labels: Labels;
  lang: string;
}) {
  const router = useRouter();
  const [regionsGeoJson, setRegionsGeoJson] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [freeMode, setFreeMode] = useState(false);
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<Place | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const boundsRef = useRef<L.LatLngBounds | null>(null);
  const regionBoundsBySlug = useRef<Record<string, L.LatLngBounds>>({});

  // Категории, которые реально есть в данных
  const availableCategories = CATEGORY_ORDER.filter((c) => places.some((p) => p.type === c));
  const visiblePlaces = category === 'all' ? places : places.filter((p) => p.type === category);

  useEffect(() => {
    fetch('/data/regions.geojson')
      .then((res) => res.json())
      .then((data) => setRegionsGeoJson(data))
      .catch((err) => console.error('Ошибка загрузки границ областей:', err));
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Общий вид страны + границы каждого региона отдельно
  useEffect(() => {
    if (regionsGeoJson && mapRef.current) {
      const layer = L.geoJSON(regionsGeoJson);
      const bounds = layer.getBounds();
      boundsRef.current = bounds;
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });

      const bySlug: Record<string, L.LatLngBounds> = {};
      regionsGeoJson.features.forEach((feature: any) => {
        const slug = feature.properties?.slug;
        if (slug) bySlug[slug] = L.geoJSON(feature).getBounds();
      });
      regionBoundsBySlug.current = bySlug;
    }
  }, [regionsGeoJson]);

  // Режим "рука" / курсор
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

    map.getContainer().style.cursor = freeMode ? 'grab' : 'default';
  }, [freeMode, isMobile]);

  const resetView = () => {
    setSelected(null);
    if (mapRef.current && boundsRef.current) {
      mapRef.current.flyToBounds(boundsRef.current, { padding: [20, 20], duration: 0.8 });
    }
  };

  const toggleFreeMode = () => {
    if (freeMode) resetView();
    setFreeMode(!freeMode);
  };

  const changeCategory = (c: string) => {
    setCategory(c);
    if (selected && c !== 'all' && selected.type !== c) setSelected(null);
  };

  const selectPlace = (place: Place) => {
    setSelected(place);
    const map = mapRef.current;
    if (!map) return;

    const bounds = place.region_slug ? regionBoundsBySlug.current[place.region_slug] : undefined;
    const wide = window.innerWidth >= 768;

    if (bounds) {
      // Оставляем место под карточку места справа (на ПК) или снизу (на телефоне)
      map.flyToBounds(bounds, {
        paddingTopLeft: [30, 80],
        paddingBottomRight: [wide ? 420 : 30, wide ? 30 : 340],
        duration: 0.8,
      });
    } else {
      map.flyTo([place.lat, place.lng], 9, { duration: 0.8 });
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Кнопки слева */}
      <button
        onClick={resetView}
        title={labels.reset}
        className="absolute top-4 left-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-lg border border-red-300 bg-white text-black shadow-sm transition-colors hover:border-red-500"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12l9-9 9 9" />
          <path d="M5 10v10h14V10" />
        </svg>
      </button>

      <button
        onClick={toggleFreeMode}
        title={freeMode ? labels.freeOff : labels.freeOn}
        className={`absolute top-16 left-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm transition-colors ${
          freeMode
            ? 'border-red-600 bg-red-600 text-white'
            : 'border-red-300 bg-white text-black hover:border-red-500'
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

      {/* Фильтр по категориям */}
      <div
        className={`no-scrollbar absolute top-4 left-16 right-4 z-[1000] flex gap-2 overflow-x-auto pb-1 ${
          selected ? 'md:right-[404px]' : ''
        }`}
      >
        {['all', ...availableCategories].map((c) => (
          <button
            key={c}
            onClick={() => changeCategory(c)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
              category === c
                ? 'border-red-600 bg-red-600 text-white shadow-md'
                : 'border-red-200 bg-white text-neutral-700 hover:border-red-500'
            }`}
          >
            {c === 'all' ? labels.all : labels.categories[c] ?? c}
          </button>
        ))}
      </div>

      {/* Подсказка */}
      {!selected && (
        <div className="pointer-events-none absolute bottom-4 left-4 z-[1000] rounded-full border border-red-100 bg-white/90 px-4 py-2 text-xs font-medium text-neutral-600 shadow">
          {labels.hint}
        </div>
      )}

      {/* Карточка выбранного места */}
      {selected && (
        <aside
          key={selected.id}
          className="animate-panel-in absolute bottom-0 left-0 right-0 z-[1000] flex flex-col overflow-hidden rounded-t-3xl border border-red-100 bg-white shadow-2xl md:bottom-auto md:left-auto md:top-4 md:right-4 md:max-h-[calc(100%-2rem)] md:w-[380px] md:rounded-3xl"
        >
          <div className="relative h-52 shrink-0 overflow-hidden bg-gradient-to-br from-red-600 to-red-800">
            {selected.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.image_url}
                alt={selected.name}
                className="animate-image-in h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/70">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 19l6-10 4 6 2-3 6 7H3z" />
                </svg>
              </div>
            )}

            <button
              onClick={() => setSelected(null)}
              title={labels.close}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow transition-colors hover:bg-red-600 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <span className="absolute bottom-3 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-red-600">
              {labels.categories[selected.type] ?? selected.type}
            </span>
          </div>

          <div className="overflow-y-auto p-6">
            <h3
              className="animate-fade-up font-heading text-2xl font-extrabold leading-tight text-neutral-900"
              style={{ animationDelay: '120ms' }}
            >
              {selected.name}
            </h3>

            {selected.price_range && (
              <p
                className="animate-fade-up mt-2 text-sm font-semibold text-red-600"
                style={{ animationDelay: '180ms' }}
              >
                {selected.price_range}
              </p>
            )}

            <p
              className="animate-fade-up mt-3 line-clamp-5 leading-relaxed text-neutral-600"
              style={{ animationDelay: '240ms' }}
            >
              {selected.description}
            </p>

            <Link
              href={`/places/${selected.id}`}
              className="animate-fade-up mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg"
              style={{ animationDelay: '300ms' }}
            >
              {labels.learnMore}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </aside>
      )}

      <MapContainer
        ref={mapRef}
        center={[41.2, 74.7]}
        zoom={7}
        minZoom={5}
        maxZoom={13}
        preferCanvas={true}
        renderer={canvasRenderer}
        className="h-full w-full"
        style={{ minHeight: '500px', background: '#fbf6f6' }}
        zoomControl={false}
        attributionControl={false}
        boxZoom={false}
        keyboard={false}
      >
        {regionsGeoJson && (
          <GeoJSON
            key={lang}
            data={regionsGeoJson}
            style={{
              color: '#D22730',
              weight: 2,
              fillColor: '#D22730',
              fillOpacity: 0.08,
            }}
            onEachFeature={(feature, layer) => {
              const slug = feature.properties?.slug;
              const name = regionNames[slug] ?? feature.properties?.shapeName;

              layer.on('mouseover', () => (layer as any).setStyle({ fillOpacity: 0.35 }));
              layer.on('mouseout', () => (layer as any).setStyle({ fillOpacity: 0.08 }));
              layer.on('click', () => {
                if (slug) router.push(`/regions/${slug}`);
              });

              layer.bindTooltip(name, { sticky: true });
            }}
          />
        )}

        {visiblePlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={getIcon(place.type, selected?.id === place.id)}
            zIndexOffset={selected?.id === place.id ? 1000 : 0}
            eventHandlers={{ click: () => selectPlace(place) }}
          >
            <Tooltip direction="top" offset={[0, -14]}>
              {place.name}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

