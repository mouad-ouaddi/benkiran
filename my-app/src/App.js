import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import CoachDashboard from './components/CoachDashboard';
import AdherentDashboard from './components/AdherentDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    console.log('Login successful, user data:', userData);
    setUser(userData);
  };

  const handleLogout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('user');
  };

  console.log('Current user state:', user);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to={`/${user.role}-dashboard`} replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              user && user.role === 'admin' ? (
                <AdminDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/coach-dashboard" 
            element={
              user && user.role === 'coach' ? (
                <CoachDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/adherent-dashboard" 
            element={
              user && user.role === 'adherent' ? (
                <AdherentDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
