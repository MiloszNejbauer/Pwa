import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';

function MemoriesAlbum() {
  const [memories, setMemories] = useState([]);

  const navigate = useNavigate();

  const goHome = () => {
    navigate('/')
  }

  // Wczytujemy wspomnienia z localStorage
  useEffect(() => {
    const saved = localStorage.getItem('memories');
    if (saved) {
      setMemories(JSON.parse(saved));
    }
  }, []);

  return (
    <div>
      <h1>Memories Album</h1>
      {memories.length === 0 ? (
        <p>No memories saved yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', margin: '1rem' }}>
          {memories.map((mem) => (
            <div key={mem.id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
              <img src={mem.photo} alt="Captured" style={{ width: '200px' }} />
              <p><strong>Description:</strong> {mem.description}</p>
              <p><strong>Location:</strong> {mem.location}</p>
              <p><strong>Date: </strong> {mem.createdAt}</p>
            </div>
          ))}
        </div>
      )}
      <button onClick={goHome}><IoIosArrowRoundBack/> <br/>Back</button>
    </div>
  );
}

export default MemoriesAlbum;
