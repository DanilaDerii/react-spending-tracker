import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
} from 'react-router-dom';
import Journal from './pages/Journal.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 border-b border-gray-300 bg-white shadow-sm">
        <NavLink
          to="/journal"
          className={({ isActive }) =>
            `mr-4 font-medium ${
              isActive ? 'text-blue-600 underline' : 'text-gray-700'
            }`
          }
        >
          Journal
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `font-medium ${
              isActive ? 'text-blue-600 underline' : 'text-gray-700'
            }`
          }
        >
          Dashboard
        </NavLink>
      </nav>

      <div className="p-4">
        <Routes>
          <Route path="/journal" element={<Journal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/journal" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
