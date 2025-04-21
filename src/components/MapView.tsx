
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/data/properties';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

interface MapViewProps {
  properties: Property[];
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHR0Z3B5cXIwMGF1MmptbGVydWF6ZHN0In0.a9QuumijHhaTVbBG2eUHZA';

const MapView: React.FC<MapViewProps> = ({ properties }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const navigate = useNavigate();
  const { convertPrice } = useApp();

  // Generate pseudo-random but consistent coordinates based on property id
  const getCoordinates = (property: Property) => {
    // Use property id to generate a stable random-like number
    const seed = parseInt(property.id, 10) || 0;
    
    // Generate coordinates in different parts of the world based on property type
    let baseLat = 0;
    let baseLng = 0;
    
    switch(property.type) {
      case 'villa':
        baseLat = 34; // Southern Europe
        baseLng = -5;
        break;
      case 'apartment':
        baseLat = 40; // North America
        baseLng = -80;
        break;
      case 'cabin':
        baseLat = 60; // Northern Europe
        baseLng = 10;
        break;
      case 'chalet':
        baseLat = 46; // Alps
        baseLng = 8;
        break;
      default:
        baseLat = 25;
        baseLng = -80;
    }
    
    // Use the seed to create some variation
    const lat = baseLat + (((seed * 13) % 20) - 10) * 0.5;
    const lng = baseLng + (((seed * 7) % 40) - 20) * 0.5;
    
    return { lat, lng };
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20], // Center of the world
      zoom: 1.5
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

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
      const { lat, lng } = getCoordinates(property);

      // Create a custom marker element
      const el = document.createElement('div');
      el.className = 'cursor-pointer transition-transform hover:scale-105';
      el.innerHTML = `
        <div class="bg-white p-2 rounded-lg shadow-lg border border-gold-light">
          <div class="text-gold-dark font-bold">${convertPrice(property.price)}</div>
          <div class="text-sm max-w-[120px] truncate">${property.name}</div>
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
  }, [properties, navigate, convertPrice]);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default MapView;
