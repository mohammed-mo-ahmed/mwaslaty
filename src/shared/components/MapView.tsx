'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import type {Map as LeafletMap} from 'leaflet';

type MarkerData = {
  id: string;
  name: string;
  nameAr?: string;
  lat: number;
  lng: number;
  type?: 'stop' | 'place' | 'origin' | 'destination';
};

type MapViewProps = {
  stops?: MarkerData[];
  places?: MarkerData[];
  route?: Array<[number, number]>;
  center?: [number, number];
  zoom?: number;
  height?: string;
  onClick?: (lat: number, lng: number) => void;
  origin?: MarkerData;
  destination?: MarkerData;
};

export default function MapView({
  stops,
  places,
  route,
  center,
  zoom = 12,
  height = 'h-64',
  onClick,
  origin,
  destination,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const initStarted = useRef(false);
  const [ready, setReady] = useState(false);

  const defaultCenter: [number, number] = center ?? [30.0444, 31.2357];

  useEffect(() => {
    if (!mapRef.current || mapInstance.current || initStarted.current) return;
    initStarted.current = true;

    const initMap = async () => {
      const L = await import('leaflet');

      if (!mapRef.current || mapInstance.current) return;

      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      const map = L.map(mapRef.current!, {
        center: defaultCenter,
        zoom,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      if (onClick) {
        map.on('click', (e: {latlng: {lat: number; lng: number}}) => {
          onClick(e.latlng.lat, e.latlng.lng);
        });
      }

      mapInstance.current = map;
      LRef.current = L;
      setReady(true);
    };

    initMap();

    return () => {
      initStarted.current = false;
      LRef.current = null;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null);

  const allMarkers = useMemo(() => {
    const markers: MarkerData[] = [];
    if (stops) markers.push(...stops.map(s => ({...s, type: 'stop' as const})));
    if (places) markers.push(...places.map(p => ({...p, type: 'place' as const})));
    if (origin) markers.push({...origin, type: 'origin' as const});
    if (destination) markers.push({...destination, type: 'destination' as const});
    return markers;
  }, [stops, places, origin, destination]);

  useEffect(() => {
    const L = LRef.current;
    if (!mapInstance.current || !L || allMarkers.length === 0) return;

    const bounds: Array<[number, number]> = [];
    const markers: Array<ReturnType<typeof L.marker>> = [];

    for (const marker of allMarkers) {
      const icon = marker.type === 'origin'
        ? L.divIcon({className: 'custom-marker origin-marker', html: '<div style="background:#2563eb;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);">A</div>', iconSize: [24, 24], iconAnchor: [12, 12]})
        : marker.type === 'destination'
        ? L.divIcon({className: 'custom-marker destination-marker', html: '<div style="background:#dc2626;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);">B</div>', iconSize: [24, 24], iconAnchor: [12, 12]})
        : marker.type === 'stop'
        ? L.divIcon({className: 'custom-marker stop-marker', html: '<div style="background:#059669;color:white;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,.3);">●</div>', iconSize: [20, 20], iconAnchor: [10, 10]})
        : L.divIcon({className: 'custom-marker place-marker', html: '<div style="background:#f59e0b;color:white;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,.3);">★</div>', iconSize: [20, 20], iconAnchor: [10, 10]});

      const m = L.marker([marker.lat, marker.lng], {icon}).addTo(mapInstance.current!);
      const label = marker.nameAr || marker.name;
      m.bindPopup(`<b>${label}</b>`);
      markers.push(m);
      bounds.push([marker.lat, marker.lng]);
    }

    if (bounds.length > 0) {
      mapInstance.current.fitBounds(bounds, {padding: [50, 50]});
    }

    return () => {
      markers.forEach(m => m.remove());
    };
  }, [allMarkers, ready]);

  useEffect(() => {
    const L = LRef.current;
    if (!mapInstance.current || !L || !route || route.length === 0) return;

    const polyline = L.polyline(route, {
      color: '#2563eb',
      weight: 4,
      opacity: 0.8,
      dashArray: '10, 10',
    }).addTo(mapInstance.current);

    return () => {
      polyline.remove();
    };
  }, [route, ready]);

  return (
    <div className={`${height} w-full overflow-hidden rounded-lg`} ref={mapRef}>
      <style jsx global>{`
        .custom-marker { background: none; border: none; }
        .leaflet-popup-content-wrapper { border-radius: 8px; }
        .leaflet-popup-content { margin: 8px 12px; font-size: 14px; }
      `}</style>
    </div>
  );
}
