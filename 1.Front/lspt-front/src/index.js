import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Features from './Features';
import UserLogin from './UserLogin';
import Metaverse from './Metaverse';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/metaverse" element={<Metaverse />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
