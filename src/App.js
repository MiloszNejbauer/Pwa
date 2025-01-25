import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Camera from './pages/Camera';
import Location from './pages/Location';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/camera">Camera</Link></li>
            <li><Link to="/location">Location</Link></li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/location" element={<Location />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
