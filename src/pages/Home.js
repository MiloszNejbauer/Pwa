import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { IoAddCircleOutline } from "react-icons/io5";
import { BiSolidPhotoAlbum } from 'react-icons/bi';

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
      An application for saving memories in an album.
      Take or add a photo, write a description, and save your memory.
      </p>
      
      <button onClick={goToAddMemory}> <IoAddCircleOutline /> <br/>Add Memory</button>
      <button onClick={goToAlbum}><BiSolidPhotoAlbum/> <br/>Album</button>
      
    </div>
  );
}

export default Home;
