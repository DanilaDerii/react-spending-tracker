// src/App.jsx
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink
} from 'react-router-dom';
import Journal from './pages/Journal.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <NavLink to="/journal" style={{ marginRight: '1rem' }}>
          Journal
        </NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>

      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/journal" element={<Journal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/journal" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
