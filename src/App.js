import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddMemory from './pages/AddMemory';
import MemoriesAlbum from './pages/MemoriesAlbum.js';

function App() {
  return (
    <Router>
      <div>
        <nav>
          {/* <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/add-memory">Add Memory</Link></li>
            <li><Link to="/album">Memories Album</Link></li>
          </ul> */}
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-memory" element={<AddMemory />} />
          <Route path="/album" element={<MemoriesAlbum />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
