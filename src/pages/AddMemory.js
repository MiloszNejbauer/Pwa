import React, { useState, useRef, useEffect } from 'react';

function AddMemory() {
  const videoRef = useRef(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);

  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);

  // Wczytujemy zapisane wspomnienia
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

  // 4. Funkcja do zrobienia zdjęcia
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);

    // Wyłącz kamerę zaraz po zrobieniu zdjęcia
    stopCamera();
  };

  // 5. Wyłącz kamerę i zwolnij zasoby
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraActive(false);
  };

  // 6. Funkcja do zapisania wspomnienia w localStorage
  const saveMemory = () => {
    if (!photo) {
      alert('Zrób zdjęcie przed zapisem!');
      return;
    }

    if (!location) {
      alert('Lokalizacja nie jest jeszcze gotowa!');
      return;
    }

    const newMemory = {
      id: Date.now(),
      photo,
      description,
      location
    };
    const updatedMemories = [...memories, newMemory];
    setMemories(updatedMemories);
    localStorage.setItem('memories', JSON.stringify(updatedMemories));

    // Reset pola
    setPhoto(null);
    setDescription('');
    alert('Memory saved!');
  };

  // 7. Sprzątanie przy odmontowaniu komponentu – wyłącz kamerę, jeśli aktywna
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1>Add Memory</h1>

      <section style={{ marginBottom: '1rem' }}>
        {/* 
          Jeśli isCameraActive === false, to przycisk startu kamery
          Jeśli true, przycisk do zrobienia zdjęcia 
        */}
        {!isCameraActive && !photo && (
          <button onClick={startCamera}>Start Camera</button>
        )}

        {isCameraActive && (
          <button onClick={capturePhoto}>Take Photo</button>
        )}

        {/* 
          Jeśli mamy już photo, to daj opcję zrobienia kolejnego 
        */}
        {photo && (
          <button onClick={() => {
            setPhoto(null);
            startCamera();
          }}>
            Take Another
          </button>
        )}
      </section>

      <section style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {/* Podgląd kamery, jeśli isCameraActive */}
        {isCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '300px', border: '1px solid #ccc', background: '#000' }}
          />
        ) : (
          <div style={{ width: '300px', height: '225px', border: '1px solid #ccc' }}>
            {photo ? (
              <img
                src={photo}
                alt="Captured"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : (
              <p>Camera off / No photo</p>
            )}
          </div>
        )}
      </section>

      <section>
        <label>
          Description:
          <br />
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '300px' }}
          />
        </label>
        <br />
        <p><strong>Location:</strong> {location ? location : 'Pobieranie...'}</p>
        <button onClick={saveMemory}>Save Memory</button>
      </section>
    </div>
  );
}

export default AddMemory;
