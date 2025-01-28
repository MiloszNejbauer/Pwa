import React, { useState, useEffect } from 'react';
import '../App.css';

function AddMemoryInputFile() {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem('memories');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // Wstaw swój reverse geocoding, np. BigDataCloud
          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            const data = await res.json();
            setLocation(data.city || data.locality || `${lat},${lng}`);
          } catch (error) {
            console.error('Błąd reverse geocoding:', error);
            setLocation(`(${lat}, ${lng})`);
          }
        },
        (err) => {
          console.error('Błąd geolokalizacji:', err);
          setLocation('Nie udało się pobrać lokalizacji');
        }
      );
    } else {
      setLocation('Geolokalizacja niedostępna w tej przeglądarce');
    }
  };

  // Handler dla inputa plików
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Odczytaj plik jako base64 (data URL)
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result); 
    };
    reader.readAsDataURL(file);
  };

  const saveMemory = () => {
    if (!photo) {
      alert('Najpierw wybierz lub zrób zdjęcie!');
      return;
    }
    const newMemory = {
      id: Date.now(),
      photo,
      description,
      location,
    };
    const updatedMemories = [...memories, newMemory];
    setMemories(updatedMemories);
    localStorage.setItem('memories', JSON.stringify(updatedMemories));

    // Reset
    setPhoto(null);
    setDescription('');
    alert('Memory saved!');
  };

  return (
    <div>
      <h1>Add Memory</h1>

      <div style={{ marginBottom: '1rem' }}>
        {/* Input akceptuje obrazy i może otworzyć kamerę na telefonie */}
        <input
          type="file"
          accept="image/*"
          capture="camera"
          onChange={handleFileChange}
        />
      </div>

      <div style={{ marginBottom: '1rem', width: '300px', height: '225px', border: '1px solid #ccc' }}>
        {photo ? (
          <img
            src={photo}
            alt="Selected"
            style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', margin: 'auto' }}
          />
        ) : (
          <p style={{ textAlign: 'center' }}>Take, or choose a pic</p>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Description:</label>
        <br />
        <textarea
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '300px' }}
        />
        <br />
        <p><strong>Location:</strong> {location || 'No location'}</p>
      </div>

      <button onClick={saveMemory}>Save Memory</button>
    </div>
  );
}

export default AddMemoryInputFile;
