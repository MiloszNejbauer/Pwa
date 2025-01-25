import React, { useState, useRef, useEffect } from 'react';

function Memories() {
  const videoRef = useRef(null);           // referencja do <video>
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null); 
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [memories, setMemories] = useState(() => {
    // Odczytaj zapisane wspomnienia z localStorage
    const saved = localStorage.getItem('memories');
    return saved ? JSON.parse(saved) : [];
  });

  // 1. Funkcja do uruchomienia kamery
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Błąd dostępu do kamery:', err);
    }
  };

  // 2. Funkcja do zrobienia zdjęcia (przechwycenie klatki z <video>)
  const capturePhoto = () => {
    if (!videoRef.current) return;

    // Tworzymy tymczasowo <canvas>, rysujemy tam aktualną klatkę z video, pobieramy base64
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);
  };

  // 3. Funkcja do pobrania lokalizacji (geolokalizacja -> reverse geocoding)
  const fetchLocation = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            // Przykład z bigdatacloud, zwróci nam m.in. city / locality / principalSubdivision
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            const data = await res.json();
            // Ustawiamy w stanie np. nazwe miasta lub regionu
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

  // 4. Funkcja do zapisania wspomnienia
  const saveMemory = () => {
    if (!photo) {
      alert('Zrób zdjęcie przed zapisem!');
      return;
    }
    if (!location) {
      alert('Pobierz lokalizację przed zapisem!');
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

    // Zapis do localStorage, by przetrwać odświeżenie
    localStorage.setItem('memories', JSON.stringify(updatedMemories));

    // Czyścimy formularz
    setPhoto(null);
    setDescription('');
    setLocation(null);
    alert('Memory saved!');
  };

  // 5. Sprzątanie po zamknięciu widoku – wyłącz strumień (opcjonalnie)
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div>
      <h1>Memories</h1>

      <section style={{ marginBottom: '1rem' }}>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={capturePhoto}>Take Photo</button>
        <button onClick={fetchLocation}>Get Location</button>
      </section>

      <section style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
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
            <p>Brak zdjęcia</p>
          )}
        </div>
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
        <p>
          <strong>Location: </strong>
          {location ? location : 'Brak'}
        </p>
        <button onClick={saveMemory}>Save Memory</button>
      </section>

      <hr />

      <section>
        <h2>List of Saved Memories</h2>
        {memories.length === 0 ? (
          <p>No memories saved yet.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {memories.map((mem) => (
              <div key={mem.id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
                <img src={mem.photo} alt="Captured" style={{ width: '200px' }} />
                <p><strong>Description:</strong> {mem.description}</p>
                <p><strong>Location:</strong> {mem.location}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Memories;
