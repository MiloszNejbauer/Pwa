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
      <h1>Memories App</h1>
      <p>
        Aplikacja służąca do zapisywania wspomnień w albumie.
        Zrób lub dodaj zdjęcie, dodaj opis i zapisz swoje wspomnienie.
      </p>
      
      <button onClick={goToAddMemory}>Add Memory</button>
      <button onClick={goToAlbum}>Album</button>
      
    </div>
  );
}

export default Home;
