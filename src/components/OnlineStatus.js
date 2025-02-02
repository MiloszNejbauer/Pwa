import React, { useState, useEffect } from 'react';
import { Transition } from 'react-transition-group';

function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    setShowStatus(true);
    const timer = setTimeout(() => {
      setShowStatus(false);
    }, 5000);

    return () => clearTimeout(timer);
    }, [isOnline]);
  

  const duration = 300;

  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
    position: 'fixed',
    top: '10px',
    right: '10px',
    backgroundColor: isOnline ? 'green' : 'red',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    zIndex: 1000,
  };


  const transitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 1 },
    exiting:  { opacity: 0 },
    exited:  { opacity: 0 },
  };

  return (
    <Transition in={showStatus} timeout={duration} unmountOnExit>
      {(state) => (
        <div style={{ ...defaultStyle, ...transitionStyles[state] }}>
          Status: {isOnline ? 'online' : 'offline'}
        </div>
      )}
    </Transition>
  );
}

export default OnlineStatus;