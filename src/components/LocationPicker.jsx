import React, { useState, useEffect, forwardRef, useCallback, useMemo } from "react";
import { Input, List, Spin, Typography, message } from 'antd';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import axios from "axios";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const { Text } = Typography;

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = forwardRef(({ onLocationSelect, onSuggestionsToggle, style }, ref) => {
  const [loading, setLoading] = useState(false);
  const [reverseGeocoding, setReverseGeocoding] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([35.6892, 51.3890]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  // Map view component to handle navigation
  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
      if (center && map) {
        map.setView(center, zoom || map.getZoom());
      }
    }, [center, zoom, map]);
    return null;
  };

  // Initialize map instance
  const handleMapCreated = (map) => {
    setMapInstance(map);
  };

  // Reverse geocode coordinates to get human-readable address
  const reverseGeocode = async (lat, lng) => {
    setReverseGeocoding(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      
      if (response.data && response.data.display_name) {
        return response.data.display_name;
      }
      return `Near ${response.data.address?.road || response.data.address?.neighbourhood || 'this location'}`;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return `Selected location (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
    } finally {
      setReverseGeocoding(false);
    }
  };

  // Notify parent about suggestions visibility changes
  useEffect(() => {
    if (onSuggestionsToggle) {
      onSuggestionsToggle(showSuggestions);
    }
  }, [showSuggestions, onSuggestionsToggle]);

  const searchLocation = async (value) => {
    if (!value) {
      setLocations([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`
      );
      setLocations(response.data);
      setShowSuggestions(true);

      // If we get results, center map on first result
      if (response.data.length > 0 && mapInstance) {
        const firstResult = response.data[0];
        const newCenter = [parseFloat(firstResult.lat), parseFloat(firstResult.lon)];
        setMapCenter(newCenter);
        mapInstance.setView(newCenter, 13);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      message.error("Failed to search locations");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = useCallback(async (location) => {
    let displayName = location.display_name;
    
    // If we have coordinates but no display name (from map click), reverse geocode
    if (location.lat && location.lon && !displayName) {
      displayName = await reverseGeocode(parseFloat(location.lat), parseFloat(location.lon));
    }

    const selected = {
      ...location,
      display_name: displayName || `Selected location (${location.lat}, ${location.lon})`
    };

    setSelectedLocation(selected);
    const newCenter = [parseFloat(selected.lat), parseFloat(selected.lon)];
    setMapCenter(newCenter);
    
    // Center map on selected location
    if (mapInstance) {
      mapInstance.setView(newCenter, 13);
    }

    setSearchQuery(selected.display_name);
    setShowSuggestions(false);
    
    onLocationSelect({
      address: selected.display_name,
      lat: selected.lat,
      lon: selected.lon,
    });
  }, [onLocationSelect, mapInstance]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 2) {
      searchLocation(value);
    } else {
      setLocations([]);
      setShowSuggestions(false);
    }
  };

  // Map click handler component
  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        handleLocationSelect({
          lat: lat.toString(),
          lon: lng.toString()
        });
      },
    });
    return null;
  };

  return (
    <div ref={ref} style={{ ...style, position: 'relative' }}>
      <Input.Search
        placeholder="Search location (address, city, landmark, etc.)"
        value={searchQuery}
        onChange={handleInputChange}
        onSearch={searchLocation}
        style={{ width: '100%', marginBottom: 16 }}
        loading={loading || reverseGeocoding}
        allowClear
        enterButton
      />
      
      {showSuggestions && locations.length > 0 && (
        <div style={{
          position: 'absolute',
          zIndex: 1000,
          width: '100%',
          maxHeight: '200px',
          overflowY: 'auto',
          background: '#fff',
          boxShadow: '0 3px 6px rgba(0,0,0,0.16)',
          borderRadius: 4,
          border: '1px solid #d9d9d9'
        }}>
          <List
            itemLayout="horizontal"
            dataSource={locations}
            renderItem={(item) => (
              <List.Item 
                style={{ 
                  padding: '8px 16px',
                  cursor: 'pointer',
                  ':hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
                onClick={() => handleLocationSelect(item)}
              >
                <List.Item.Meta
                  title={<Text ellipsis>{item.display_name}</Text>}
                  description={`${item.lat}, ${item.lon}`}
                />
              </List.Item>
            )}
          />
        </div>
      )}

      <div style={{ height: 'calc(100% - 60px)', width: '100%' }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%', borderRadius: 4 }}
          whenCreated={handleMapCreated}
        >
          <ChangeView center={mapCenter} zoom={13} />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler />
          {selectedLocation && (
            <Marker
              position={[parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon)]}
            />
          )}
        </MapContainer>
      </div>
      
      <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
        {reverseGeocoding ? 'Looking up address...' : 'Click on the map to select your delivery location'}
      </Text>
    </div>
  );
});

LocationPicker.displayName = 'LocationPicker';

export default LocationPicker;