import React, { useState, useRef } from 'react';

function Camera() {
  const videoRef = useRef(null);
  const [error, setError] = useState('');

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError(`Błąd dostępu do kamery: ${err.message}`);
    }
  };

  return (
    <div>
      <h1>Camera View</h1>
      <button onClick={handleStartCamera}>Start Camera</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <video ref={videoRef} autoPlay playsInline style={{ width: '400px', border: '1px solid black' }} />
      </div>
    </div>
  );
}

export default Camera;
