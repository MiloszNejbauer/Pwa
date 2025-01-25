import React, { useState } from 'react';

function Location() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState('');

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          setError(`Błąd geolokalizacji: ${err.message}`);
        }
      );
    } else {
      setError('Geolokalizacja niedostępna w tej przeglądarce.');
    }
  };

  return (
    <div>
      <h1>Location View</h1>
      <button onClick={handleGetLocation}>Pobierz lokalizację</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {coords && (
        <p>
          Twoja lokalizacja: <br />
          Szerokość: {coords.latitude}, Długość: {coords.longitude}
        </p>
      )}
    </div>
  );
}

export default Location;
