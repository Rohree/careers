import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Careers from './pages/Careers';
import Admin from './pages/Admin';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Careers />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;