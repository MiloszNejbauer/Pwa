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

  const [logs, setLogs] = useState([]);  // <-- tablica komunikatów

  const addLog = (msg) => {
    // Dodajemy komunikat na początek listy (lub koniec – wg uznania)
    setLogs((prev) => [msg, ...prev]);
  };

  // 1. Automatyczne pobranie lokalizacji (reverse geocoding) po pierwszym renderze
  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    addLog('fetchLocation() start');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          addLog(`Got coords lat=${lat}, lng=${lng}`);
          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            if (!res.ok) {
              addLog(`Reverse geocode not ok: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            addLog(`Reverse geocode data: ${JSON.stringify(data)}`);
            setLocation(data.city || data.locality || `${lat},${lng}`);
          } catch (error) {
            addLog(`Reverse geocoding error: ${error.message}`);
            setLocation(`(${lat}, ${lng})`);
          }
        },
        (err) => {
          addLog(`Geolocation error: ${err.message}`);
          setLocation('Nie udało się pobrać lokalizacji');
        }
      );
    } else {
      addLog('Geolocation not available in this browser');
      setLocation('Geolokalizacja niedostępna w tej przeglądarce');
    }
  };

  const startCamera = async () => {
    addLog('startCamera() called');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      addLog('mediaStream acquired');
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        addLog('srcObject assigned to video');
      }
      setIsCameraActive(true);
      addLog('setIsCameraActive(true)');
    } catch (err) {
      addLog(`Camera error: ${err.name} - ${err.message}`);
      console.error('Błąd dostępu do kamery:', err);
    }
  };

  const capturePhoto = () => {
    addLog('capturePhoto() called');
    if (!videoRef.current) {
      addLog('videoRef.current is null - cannot capture');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);
    addLog('Photo captured, dataUrl set');

    stopCamera();
  };

  const stopCamera = () => {
    addLog('stopCamera() called');
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      addLog('tracks stopped');
    }
    setIsCameraActive(false);
    setStream(null);
  };

  const saveMemory = () => {
    addLog('saveMemory() called');
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
    setPhoto(null);
    setDescription('');
    alert('Memory saved!');
    addLog('Memory saved to localStorage');
  };

  useEffect(() => {
    return () => {
      addLog('Cleaning up - stopCamera()');
      stopCamera();
    };
    // eslint-disable-next-line
  }, [stream]);

  return (
    <div>
      <h1>Add Memory</h1>

      <div style={{ marginBottom: '1rem' }}>
        {!isCameraActive && !photo && (
          <button onClick={startCamera}>Start Camera</button>
        )}
        {isCameraActive && (
          <button onClick={capturePhoto}>Take Photo</button>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
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

      <hr />
      <h2>Debug Log:</h2>
      <ul>
        {logs.map((msg, idx) => (
          <li key={idx} style={{ fontSize: '0.9rem' }}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default AddMemory;