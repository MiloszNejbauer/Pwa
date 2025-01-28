import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
  return (
    <div>
      <h1>Welcome to My Memories App</h1>
      <p>
        This application allows you to capture photos, add a short description and 
        save the location where they were taken. You can then view all your saved 
        memories in a dedicated album.
      </p>
      
      <div style={{ marginTop: '1rem' }}>
        <Link to="/add-memory" style={{ marginRight: '1rem' }}>
          <button>Add Memory</button>
        </Link>

        <Link to="/album">
          <button>Album</button>
        </Link>

      </div>
    </div>
  );
}

export default Home;
