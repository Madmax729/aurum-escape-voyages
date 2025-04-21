
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property, PropertyType } from '@/data/properties';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHR0Z3B5cXIwMGF1MmptbGVydWF6ZHN0In0.a9QuumijHhaTVbBG2eUHZA';

interface MapViewProps {
  properties: Property[];
  onPropertySelect?: (propertyId: string) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const MapView: React.FC<MapViewProps> = ({
  properties,
  onPropertySelect,
  center = [0, 20], // Default center
  zoom = 1.5,
  height = '400px',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Function to get property color based on type
  const getPropertyColor = (type: PropertyType): string => {
    switch (type) {
      case 'villa':
        return '#FF5A5F';
      case 'apartment':
        return '#00A699';
      case 'house':
        return '#FC642D';
      case 'penthouse':
        return '#6E7A8A';
      case 'resort':
        return '#FFAA42';
      default:
        return '#484848';
    }
  };

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }

    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: center,
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for properties when map loads
    map.current.on('load', () => {
      // Add property markers
      properties.forEach((property) => {
        if (property.location) {
          const el = document.createElement('div');
          el.className = 'property-marker';
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = getPropertyColor(property.type);
          el.style.cursor = 'pointer';
          el.style.border = '2px solid white';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

          // Create a popup
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="max-width:200px;">
                <strong>${property.name}</strong>
                <p>${property.location.address}</p>
                <p>$${property.price} per night</p>
              </div>
            `);

          // Create a marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat([property.location.longitude, property.location.latitude])
            .setPopup(popup)
            .addTo(map.current!);

          // Add click event
          el.addEventListener('click', () => {
            if (onPropertySelect) {
              onPropertySelect(property.id);
            }
          });
        }
      });

      // Add user location marker if available
      if (userLocation) {
        const userEl = document.createElement('div');
        userEl.className = 'user-location-marker';
        userEl.style.width = '18px';
        userEl.style.height = '18px';
        userEl.style.borderRadius = '50%';
        userEl.style.backgroundColor = '#4285F4';
        userEl.style.border = '3px solid white';
        userEl.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';
        
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML('<div><strong>Your Location</strong></div>');

        new mapboxgl.Marker(userEl)
          .setLngLat(userLocation)
          .setPopup(popup)
          .addTo(map.current!);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [properties, center, zoom, onPropertySelect, userLocation]);

  // Check if user location changed and re-center map
  useEffect(() => {
    if (map.current && userLocation) {
      // Optionally re-center map to user location
      // map.current.flyTo({ center: userLocation, zoom: 10 });
    }
  }, [userLocation]);

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapView;
