import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockVillages, Village } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Fix Leaflet CSS import issue
import "leaflet/dist/leaflet.css";
// Fix Leaflet default icon path issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Set up default icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons based on status
const createMarkerIcon = (status: string, fraType: string) => {
  const color = status === 'Approved' ? '#22c55e' : status === 'Pending' ? '#f59e0b' : '#ef4444';
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: white;
      ">
        ${fraType}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

interface MapViewProps {
  onVillageSelect: (village: Village) => void;
  selectedFilters?: {
    state: string;
    district: string;
    status: string;
  };
}

const MapView: React.FC<MapViewProps> = ({ 
  onVillageSelect, 
  selectedFilters = { state: 'all-states', district: 'all-districts', status: 'all-status' } 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-status-approved';
      case 'Pending': return 'bg-status-pending';
      case 'Rejected': return 'bg-status-rejected';
      default: return 'bg-muted';
    }
  };

  // Filter villages based on selected filters
  const getFilteredVillages = () => {
    return mockVillages.filter(village => {
      const stateMatch = selectedFilters.state === 'all-states' || village.state === selectedFilters.state;
      const districtMatch = selectedFilters.district === 'all-districts' || village.district === selectedFilters.district;
      const statusMatch = selectedFilters.status === 'all-status' || village.status === selectedFilters.status;
      return stateMatch && districtMatch && statusMatch;
    });
  };

  // Initialize map using vanilla Leaflet instead of react-leaflet
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Create map instance
      const map = L.map(mapRef.current).setView([21.0, 81.0], 6);
      mapInstanceRef.current = map;
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }
    
    // Force a resize after a short delay to ensure proper rendering
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when filters change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add markers for filtered villages
    const filteredVillages = getFilteredVillages();
    filteredVillages.forEach((village) => {
      const marker = L.marker(village.coordinates, {
        icon: createMarkerIcon(village.status, village.fraType)
      }).addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
      
      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 sm:p-4 min-w-[240px] sm:min-w-[280px]';
      popupContent.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-lg">${village.name}</h3>
            <span class="text-white px-2 py-1 rounded-full text-xs ${getStatusColor(village.status)}">
              ${village.status}
            </span>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-muted-foreground">State:</span>
              <p class="font-medium">${village.state}</p>
            </div>
            <div>
              <span class="text-muted-foreground">District:</span>
              <p class="font-medium">${village.district}</p>
            </div>
            <div>
              <span class="text-muted-foreground">FRA Type:</span>
              <p class="font-medium">${village.fraType}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Land Area:</span>
              <p class="font-medium">${village.landArea} ha</p>
            </div>
          </div>
        </div>
      `;
      
      // Add button to popup
      const button = document.createElement('button');
      button.className = 'w-full bg-primary text-white py-1 px-3 rounded-md text-sm mt-3';
      button.textContent = 'View Details';
      button.onclick = () => onVillageSelect(village);
      popupContent.appendChild(button);
      
      // Bind popup to marker
      marker.bindPopup(popupContent);
      
      // Add click handler
      marker.on('click', () => {
        marker.openPopup();
      });
    });
  }, [selectedFilters, onVillageSelect]);

  // Add explicit styles to ensure map container has height
  const mapContainerStyle = {
    height: '100%',
    width: '100%',
    minHeight: '500px', // Ensure minimum height
    position: 'relative' as 'relative',
    zIndex: 1
  };

  return (
    <div className="h-full relative bg-card rounded-lg overflow-hidden shadow-card" style={{...mapContainerStyle, display: 'block', height: '100%', minHeight: '500px'}}>
      <div 
        ref={mapRef}
        style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
        className="h-full w-full z-10"
      />
      
      {/* Map Legend */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-card p-2 sm:p-4 rounded-lg shadow-card z-[1000]">
        <h4 className="font-semibold mb-2 text-xs sm:text-sm">Legend</h4>
        <div className="space-y-1 sm:space-y-2">
          {[
            { status: 'Approved', color: '#22c55e' },
            { status: 'Pending', color: '#f59e0b' },
            { status: 'Rejected', color: '#ef4444' }
          ].map(({ status, color }) => (
            <div key={status} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;