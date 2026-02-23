import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Features from './Features'
import UserLogin from './UserLogin';
import UserMetaverse from './UserMetaverse';
import AdminMetaverse from './AdminMetaverse';
import AiChat from './AiChat';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features/>}/>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/usermetaverse" element={<UserMetaverse />} />
        <Route path="/adminmetaverse" element={<AdminMetaverse />} />
        <Route path="/aichat" element={<AiChat />} />
        
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
