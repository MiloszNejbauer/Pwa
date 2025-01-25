// AddMemory.js
import React, { useState, useRef, useEffect } from 'react';

function AddMemory() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Wczytujemy zapisane wspomnienia z localStorage
  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem('memories');
    return saved ? JSON.parse(saved) : [];
  });

  // 1. Po pierwszym załadowaniu komponentu automatycznie pobierz lokalizację
  useEffect(() => {
    fetchLocation();
  }, []);

  // 2. Funkcja do pobrania lokalizacji (auto w useEffect)
  const fetchLocation = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            // Darmowe API (BigDataCloud), bez klucza; ewentualnie inna usługa
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            const data = await res.json();
            setLocation(data.city || data.locality || `${lat},${lng}`);
          } catch (error) {
            console.error('Błąd reverse geocoding:', error);
            setLocation(`(${lat}, ${lng})`); // fallback
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

   // 3. Funkcja do uruchomienia kamery
   const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Błąd dostępu do kamery:', err);
    }
  };

  // 2. capturePhoto -> rysujemy klatkę z <video> na <canvas>
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);
  };

  // 3. saveMemory
  const saveMemory = () => {
    if (!photo) {
      alert('Zrób zdjęcie!');
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
    // czyszczenie formularza
    setPhoto(null);
    setDescription('');
    alert('Memory saved!');
  };

  // 4. Sprzątanie: po opuszczeniu komponentu zatrzymujemy strumień (opcjonalnie)
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div>
      <h1>Add Memory</h1>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={capturePhoto}>Take Photo</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '300px', border: '1px solid #ccc', background: '#000' }}
          />
        </div>
        <div>
          {photo ? (
            <img
              src={photo}
              alt="Captured"
              style={{ width: '300px', border: '1px solid #ccc' }}
            />
          ) : (
            <p>No photo yet</p>
          )}
        </div>
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

export default AddMemory;
