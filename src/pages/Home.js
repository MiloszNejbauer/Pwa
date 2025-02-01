import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();

  const goToAddMemory = () => {
    navigate('./add-memory');
  }

  const goToAlbum = () => {
    navigate('./album');
  }

  return (
    <div>
      <h1>Welcome to My Memories App</h1>
      <p>
        This application allows you to capture photos, add a short description and 
        save the location where they were taken. You can then view all your saved 
        memories in a dedicated album.
      </p>
      
      <button onClick={goToAddMemory}>Add Memory</button>
      <button onClick={goToAlbum}>Album</button>
      
    </div>
  );
}

export default Home;
