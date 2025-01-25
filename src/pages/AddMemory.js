import React, { useState, useRef, useEffect } from 'react';

function AddMemory() {
  const videoRef = useRef(null);

  // Stan strumienia i flaga, czy kamera jest aktywna
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Dane wspomnienia
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  // Wczytujemy zapisane wspomnienia z localStorage
  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem('memories');
    return saved ? JSON.parse(saved) : [];
  });

  // 1. Automatyczne pobranie lokalizacji (reverse geocoding) po pierwszym renderze
  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
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

  // 2. Uruchomienie kamery
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      // if (videoRef.current) {
      //   videoRef.current.srcObject = mediaStream;
      // }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Błąd dostępu do kamery:', err);
    }
  };

  // 3. Zrobienie zdjęcia (canvas) + wyłączenie kamery
  const capturePhoto = () => {
    if (!videoRef.current) return;

    // Stworzenie <canvas> i przechwycenie klatki z <video>
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Konwersja do base64 i zapis w stanie
    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);

    // Wyłączenie kamery
    stopCamera();
  };

  // 4. Zatrzymanie kamery
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
    setStream(null);
  };

  // 5. Zapis wspomnienia
  const saveMemory = () => {
    if (!photo) {
      alert('Najpierw zrób zdjęcie!');
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

    // Czyścimy formularz
    setPhoto(null);
    setDescription('');
    alert('Memory saved!');
  };

  // 6. Gdy opuszczamy komponent (np. przejście do innej strony),
  //    zatrzymujemy kamerę, jeśli jest aktywna
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line
  }, [stream]);

  

  return (
    <div>
      <h1>Add Memory</h1>

      <div style={{ marginBottom: '1rem' }}>
        {/* Przyciski sterujące */}
        {!isCameraActive && !photo && (
          <button onClick={startCamera}>Start Camera</button>
        )}
        {isCameraActive && (
          <button onClick={capturePhoto}>Take Photo</button>
        )}
        <button onClick={() => {
  console.log('Clicked the button');
  alert('Button clicked!');
  startCamera(); 
}}>
  Start Camera (Debug)
</button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        {/* 
          Jeśli kamera jest aktywna, pokaż <video>.
          Jeśli nie – pokaż zdjęcie (o ile istnieje), albo placeholder.
        */}
        {isCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '300px', border: '1px solid #ccc', background: '#000' }}
          />
        ) : (
          <div style={{ width: '300px', height: '225px', border: '1px solid #ccc', position: 'relative' }}>
            {photo ? (
              <img
                src={photo}
                alt="Captured"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  display: 'block',
                  margin: 'auto'
                }}
              />
            ) : (
              <p style={{ textAlign: 'center' }}>No camera / no photo</p>
            )}
          </div>
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

export default AddMemory;
