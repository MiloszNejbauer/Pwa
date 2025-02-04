// MapOfMemories.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';



// Konfiguracja domyślnych ikon (w niektórych przypadkach Leaflet nie ładuje ich poprawnie)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapOfMemories() {
  const [memories, setMemories] = useState([]);
  const navigate = useNavigate();

  const goHome = () => {
        navigate('/');
  }

  const goToAddMemory = () => {
        navigate('/add-memory');
  }

  const goToAlbum = () => {
        navigate('/album');
  }

  useEffect(() => {
    const saved = localStorage.getItem('memories');
    if (saved) {
      const parsedMemories = JSON.parse(saved);
      setMemories(parsedMemories);
    }
  }, []);

  // Ustalanie domyślnego środka mapy – tutaj ustawiamy jakiś globalny środek (np. [20, 0])
  const center = [20, 0];

  return (
    <div>
      <h1>Map of Memories</h1>
      <MapContainer center={center} zoom={2} style={{ height: '80vh', width: '80vh' }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {memories.map((memory) => {
          // Upewnij się, że wspomnienie zawiera współrzędne (lat i lng)
          if (memory.lat && memory.lng) {
            return (
              <Marker key={memory.id} position={[memory.lat, memory.lng]}>
                <Popup>
                  <div>
                    <img src={memory.photo} alt="Memory" style={{ width: '100px' }} />
                    <p>{memory.description}</p>
                    <p>{memory.location}</p>
                    <p>{new Date(memory.createdAt).toLocaleString()}</p>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>

      <button onClick={goHome}>Back</button>
      <button onClick={goToAlbum}>Album</button>
      <button onClick={goToAddMemory}>Add Memory</button>
    </div>
  );
}

export default MapOfMemories;
