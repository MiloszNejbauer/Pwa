import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Memories from './pages/Memories';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/memories">Memories</Link></li>
          </ul>
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memories" element={<Memories />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
