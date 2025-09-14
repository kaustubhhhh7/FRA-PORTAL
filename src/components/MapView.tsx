import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockVillages, Village, mockForestAreas, ForestArea } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// GeoJSON will be loaded dynamically

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

// Custom forest marker icons
const createForestIcon = (type: string, biodiversity: string) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'National Park': return '#10b981';
      case 'Wildlife Sanctuary': return '#059669';
      case 'Reserve Forest': return '#16a34a';
      case 'Protected Forest': return '#15803d';
      case 'Community Forest': return '#65a30d';
      case 'Forest Range': return '#84cc16';
      default: return '#6b7280';
    }
  };

  const getBiodiversitySize = (biodiversity: string) => {
    switch (biodiversity) {
      case 'High': return 18;
      case 'Medium': return 14;
      case 'Low': return 10;
      default: return 14;
    }
  };

  const color = getTypeColor(type);
  const size = getBiodiversitySize(biodiversity);

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;
        font-weight: bold;
        color: white;
      ">
        🌲
      </div>
    `,
    className: 'forest-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

interface MapViewProps {
  onVillageSelect: (village: Village) => void;
  onForestSelect?: (forest: ForestArea) => void;
  selectedFilters?: {
    state: string;
    district: string;
    status: string;
  };
  userType?: 'government' | 'local';
  showForests?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ 
  onVillageSelect, 
  onForestSelect,
  selectedFilters = { state: 'all-states', district: 'all-districts', status: 'all-status' },
  userType = 'government',
  showForests = false
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const forestMarkersRef = useRef<L.Marker[]>([]);
  const stateBoundariesRef = useRef<L.Polygon[]>([]);
  const districtBoundariesRef = useRef<L.Polygon[]>([]);
  
  // Use real GeoJSON data for state boundaries
  
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

  // Add state boundary overlays using real GeoJSON data
  const addStateBoundaries = async () => {
    if (!mapInstanceRef.current) return;
    
    // Clear existing boundaries
    stateBoundariesRef.current.forEach(boundary => boundary.remove());
    stateBoundariesRef.current = [];
    
    try {
      // Load GeoJSON data dynamically
      const response = await fetch('/four_states_india.geojson');
      const geoJsonData = await response.json();
      
      // Add GeoJSON layer with bright red outline styling
      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: {
          color: '#dc2626', // Bright red color
          weight: 4,
          opacity: 0.9,
          fillColor: 'transparent',
          fillOpacity: 0,
          dashArray: '6, 6' // Dashed line for outline effect
        },
        onEachFeature: (feature, layer) => {
          // Add popup with state name
          const stateName = feature.properties?.NAME_1 || feature.properties?.name || 'State';
          layer.bindPopup(`<div class="text-center"><strong>${stateName}</strong><br/>Click to zoom to state</div>`);
          
          // Add click handler to zoom to state
          layer.on('click', () => {
            zoomToState(stateName);
          });
          
          // Store reference for cleanup
          stateBoundariesRef.current.push(layer as L.Polygon);
        }
      }).addTo(mapInstanceRef.current);
    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
      // Fallback to simplified boundaries if GeoJSON fails to load
      addFallbackBoundaries();
    }
  };

  // Add district boundary overlays using real GeoJSON data
  const addDistrictBoundaries = async () => {
    if (!mapInstanceRef.current) return;
    
    // Clear existing district boundaries
    districtBoundariesRef.current.forEach(boundary => boundary.remove());
    districtBoundariesRef.current = [];
    
    try {
      // Load district GeoJSON data dynamically
      const response = await fetch('/four_states_districts.geojson');
      const geoJsonData = await response.json();
      
      // Add GeoJSON layer with bright outline styling for districts
      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: {
          color: '#10b981', // Bright emerald green for districts
          weight: 2,
          opacity: 0.8,
          fillColor: 'transparent',
          fillOpacity: 0,
          dashArray: '3, 4' // Slightly larger dashed line for districts
        },
        onEachFeature: (feature, layer) => {
          // Add popup with district and state name
          const districtName = feature.properties?.NAME_2 || 'District';
          const stateName = feature.properties?.NAME_1 || 'State';
          layer.bindPopup(`<div class="text-center"><strong>${districtName}</strong><br/>${stateName}<br/>Click to zoom to district</div>`);
          
          // Add click handler to zoom to district
          layer.on('click', () => {
            zoomToDistrict(districtName, stateName);
          });
          
          // Store reference for cleanup and feature data
          (layer as any).feature = feature;
          districtBoundariesRef.current.push(layer as L.Polygon);
        }
      }).addTo(mapInstanceRef.current);
    } catch (error) {
      console.error('Error loading district GeoJSON data:', error);
    }
  };

  // Function to zoom to a specific state
  const zoomToState = (stateName: string) => {
    if (!mapInstanceRef.current) return;
    
    const stateBounds = {
      'Madhya Pradesh': [[21.0, 74.0], [26.0, 82.0]] as L.LatLngBoundsExpression,
      'Odisha': [[17.5, 81.5], [22.5, 87.5]] as L.LatLngBoundsExpression,
      'Telangana': [[15.5, 77.0], [19.5, 81.0]] as L.LatLngBoundsExpression,
      'Tripura': [[22.5, 91.0], [24.5, 92.5]] as L.LatLngBoundsExpression
    };
    
    const bounds = stateBounds[stateName as keyof typeof stateBounds];
    if (bounds) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  };

  // Function to zoom to a specific district
  const zoomToDistrict = (districtName: string, stateName: string) => {
    if (!mapInstanceRef.current) return;
    
    // Find the district boundary and zoom to it
    const districtLayer = districtBoundariesRef.current.find(layer => {
      const feature = (layer as any).feature;
      return feature && feature.properties && 
             feature.properties.NAME_2 === districtName && 
             feature.properties.NAME_1 === stateName;
    });
    
    if (districtLayer) {
      const bounds = (districtLayer as L.Polygon).getBounds();
      mapInstanceRef.current.fitBounds(bounds, { padding: [10, 10] });
    }
  };

  // Fallback function with simplified boundaries
  const addFallbackBoundaries = () => {
    if (!mapInstanceRef.current) return;
    
    const fallbackStates = {
      'Madhya Pradesh': [
        [24.0, 74.0], [24.0, 82.0], [22.0, 82.0], [22.0, 80.0], [21.0, 80.0], 
        [21.0, 78.0], [22.0, 78.0], [22.0, 76.0], [23.0, 76.0], [23.0, 74.0], [24.0, 74.0]
      ] as L.LatLngExpression[],
      'Odisha': [
        [22.5, 81.5], [22.5, 87.5], [17.5, 87.5], [17.5, 81.5], [22.5, 81.5]
      ] as L.LatLngExpression[],
      'Telangana': [
        [19.5, 77.0], [19.5, 81.0], [15.5, 81.0], [15.5, 77.0], [19.5, 77.0]
      ] as L.LatLngExpression[],
      'Tripura': [
        [24.5, 91.0], [24.5, 92.5], [22.5, 92.5], [22.5, 91.0], [24.5, 91.0]
      ] as L.LatLngExpression[]
    };
    
    Object.entries(fallbackStates).forEach(([stateName, coordinates]) => {
      const polygon = L.polygon(coordinates, {
        color: '#dc2626',
        weight: 4,
        opacity: 0.9,
        fillColor: 'transparent',
        fillOpacity: 0,
        dashArray: '6, 6'
      }).addTo(mapInstanceRef.current!);
      
      polygon.bindPopup(`<div class="text-center"><strong>${stateName}</strong><br/>Click to zoom to state</div>`);
      
      // Add click handler to zoom to state
      polygon.on('click', () => {
        zoomToState(stateName);
      });
      
      stateBoundariesRef.current.push(polygon);
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
      
      // Add state and district boundaries after map is initialized
      setTimeout(() => {
        addStateBoundaries();
        addDistrictBoundaries();
      }, 200);
    }
    
    // Force a resize after a short delay to ensure proper rendering
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);

    // Handle window resize for mobile orientation changes
    const handleResize = () => {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current?.invalidateSize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      // Clear village markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Clear forest markers
      forestMarkersRef.current.forEach(marker => marker.remove());
      forestMarkersRef.current = [];
      
      // Clear state boundaries
      stateBoundariesRef.current.forEach(boundary => boundary.remove());
      stateBoundariesRef.current = [];
      
      // Clear district boundaries
      districtBoundariesRef.current.forEach(boundary => boundary.remove());
      districtBoundariesRef.current = [];
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when filters change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    // Clear existing village markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Clear existing forest markers
    forestMarkersRef.current.forEach(marker => marker.remove());
    forestMarkersRef.current = [];
    
    // Add markers for filtered villages
    const filteredVillages = getFilteredVillages();
    filteredVillages.forEach((village) => {
      const marker = L.marker(village.coordinates, {
        icon: createMarkerIcon(village.status, village.fraType)
      }).addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
      
      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 min-w-[200px] sm:min-w-[240px] lg:min-w-[280px]';
      popupContent.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-semibold text-sm sm:text-lg leading-tight">${village.name}</h3>
            <span class="text-white px-2 py-1 rounded-full text-xs flex-shrink-0 ${getStatusColor(village.status)}">
              ${village.status}
            </span>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
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

    // Add forest markers if showForests is true
    if (showForests && onForestSelect) {
      mockForestAreas.forEach((forest) => {
        const marker = L.marker(forest.coordinates, {
          icon: createForestIcon(forest.type, forest.biodiversity)
        }).addTo(mapInstanceRef.current!);
        forestMarkersRef.current.push(marker);
        
        // Create forest popup content
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 min-w-[200px] sm:min-w-[240px] lg:min-w-[280px]';
        popupContent.innerHTML = `
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-semibold text-sm sm:text-lg leading-tight">${forest.name}</h3>
              <span class="text-white px-2 py-1 rounded-full text-xs bg-green-600 flex-shrink-0">
                ${forest.type}
              </span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div>
                <span class="text-muted-foreground">State:</span>
                <p class="font-medium">${forest.state}</p>
              </div>
              <div>
                <span class="text-muted-foreground">District:</span>
                <p class="font-medium">${forest.district}</p>
              </div>
              <div>
                <span class="text-muted-foreground">Area:</span>
                <p class="font-medium">${forest.area} ha</p>
              </div>
              <div>
                <span class="text-muted-foreground">Forest Cover:</span>
                <p class="font-medium">${forest.forestCover}%</p>
              </div>
              <div>
                <span class="text-muted-foreground">Biodiversity:</span>
                <p class="font-medium">${forest.biodiversity}</p>
              </div>
              <div>
                <span class="text-muted-foreground">Protection:</span>
                <p class="font-medium">${forest.protectionStatus}</p>
              </div>
            </div>
            
            <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">${forest.description}</p>
          </div>
        `;
        
        // Add button to popup
        const button = document.createElement('button');
        button.className = 'w-full bg-green-600 text-white py-2 px-3 rounded-md text-sm mt-3 hover:bg-green-700';
        button.textContent = 'View Forest Details';
        button.onclick = () => onForestSelect(forest);
        popupContent.appendChild(button);
        
        // Bind popup to marker
        marker.bindPopup(popupContent);
        
        // Add click handler
        marker.on('click', () => {
          marker.openPopup();
        });
      });
    }
  }, [selectedFilters, onVillageSelect, showForests, onForestSelect]);

  // Add explicit styles to ensure map container has height
  const mapContainerStyle = {
    height: '100%',
    width: '100%',
    minHeight: '300px', // Reduced minimum height for mobile
    position: 'relative' as 'relative',
    zIndex: 1
  };

  // Define border styles based on user type
  const getBorderStyle = () => {
    if (userType === 'government') {
      return 'border-4 border-blue-500 shadow-blue-200';
    } else {
      return 'border-4 border-green-500 shadow-green-200';
    }
  };

  return (
    <div className={`h-full relative bg-card rounded-lg overflow-hidden shadow-card ${getBorderStyle()}`} style={{...mapContainerStyle, display: 'block', height: '100%', minHeight: '300px'}}>
      <div 
        ref={mapRef}
        style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
        className="h-full w-full z-10"
      />
      
      {/* Map Legend - Responsive */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-card p-2 sm:p-3 lg:p-4 rounded-lg shadow-card z-[1000] max-w-[180px] sm:max-w-xs">
        <h4 className="font-semibold mb-2 text-xs sm:text-sm">Legend</h4>
        <div className="space-y-1 sm:space-y-2">
          {[
            { status: 'Approved', color: '#22c55e' },
            { status: 'Pending', color: '#f59e0b' },
            { status: 'Rejected', color: '#ef4444' }
          ].map(({ status, color }) => (
            <div key={status} className="flex items-center space-x-1 sm:space-x-2 text-xs">
              <div 
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs truncate">{status}</span>
            </div>
          ))}
          
          {/* Forest Markers Legend */}
          {showForests && (
            <>
              <div className="flex items-center space-x-1 sm:space-x-2 text-xs mt-2 pt-2 border-t border-gray-200">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs flex-shrink-0">🌲</div>
                <span className="text-xs">Forest Areas</span>
              </div>
              <div className="text-xs text-gray-600 ml-3 sm:ml-5">
                <div>• Large: High Biodiversity</div>
                <div>• Medium: Medium Biodiversity</div>
                <div>• Small: Low Biodiversity</div>
              </div>
            </>
          )}
          
          {/* State Boundaries Legend */}
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs mt-2 pt-2 border-t border-gray-200">
            <div 
              className="w-3 h-1 sm:w-4 sm:h-1 border-2 border-red-600 flex-shrink-0"
              style={{ 
                background: 'repeating-linear-gradient(to right, #dc2626 0px, #dc2626 3px, transparent 3px, transparent 6px)'
              }}
            />
            <span className="text-xs">State Boundaries</span>
          </div>
          
          {/* District Boundaries Legend */}
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs mt-1">
            <div 
              className="w-3 h-1 sm:w-4 sm:h-1 border border-emerald-500 flex-shrink-0"
              style={{ 
                background: 'repeating-linear-gradient(to right, #10b981 0px, #10b981 2px, transparent 2px, transparent 4px)'
              }}
            />
            <span className="text-xs">District Boundaries</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;