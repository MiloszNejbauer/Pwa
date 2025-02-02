import React, { useState, useEffect } from 'react';

function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Czyszczenie po odmontowaniu komponentu
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const statusStyle = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    backgroundColor: isOnline ? 'green' : 'red',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    zIndex: 1000,
  };

  return (
    <div style={statusStyle}>
      Status: {isOnline ? 'online' : 'offline'}
    </div>
  );
}

export default OnlineStatus;
