import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddMemory from './pages/AddMemory';
import MemoriesAlbum from './pages/MemoriesAlbum.js';
import OnlineStatus from './components/OnlineStatus.js';

function App() {
  return (
    <Router>
      <OnlineStatus />
      <div>
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
