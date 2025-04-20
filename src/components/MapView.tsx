
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/data/properties';
import { useNavigate } from 'react-router-dom';

interface MapViewProps {
  properties: Property[];
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHR0Z3B5cXIwMGF1MmptbGVydWF6ZHN0In0.a9QuumijHhaTVbBG2eUHZA';

const MapView: React.FC<MapViewProps> = ({ properties }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98, 39], // Center of US
      zoom: 3
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each property
    properties.forEach(property => {
      // Create a random coordinate for demo purposes
      // In a real app, you would use actual coordinates from your property data
      const lat = 25 + Math.random() * 25;
      const lng = -120 + Math.random() * 50;

      const el = document.createElement('div');
      el.className = 'cursor-pointer';
      el.innerHTML = `
        <div class="bg-white p-2 rounded-lg shadow-lg">
          <div class="text-gold-dark font-bold">$${property.price}</div>
          <div class="text-sm">${property.name}</div>
        </div>
      `;

      el.addEventListener('click', () => {
        navigate(`/properties/${property.id}`);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Fit bounds to include all markers
    if (markersRef.current.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      markersRef.current.forEach(marker => {
        bounds.extend(marker.getLngLat());
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [properties, navigate]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default MapView;
