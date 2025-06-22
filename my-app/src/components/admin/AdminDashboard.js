import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserManagement from './UserManagement';
import CoachManagement from './CoachManagement';
import AbonnementsPage from './AbonnementsPage';
import CoursPage from './CoursPage';
import './AdminDashboard.css';
import AdminReports from './AdminReports';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [stats, setStats] = useState({
    totalAdherents: 0,
    coursThisWeek: 0,
    monthlyRevenue: '0',
    occupationRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/statistics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } else {
        console.error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
  };  const renderCurrentView = () => {
    switch (currentView) {
      case 'users':
        return <UserManagement onNavigate={handleNavigation} />;
      case 'coaches':
        return <CoachManagement onNavigate={handleNavigation} />;
      case 'subscriptions':
        return <AbonnementsPage onNavigate={handleNavigation} />;
      case 'cours':
        return <CoursPage onNavigate={handleNavigation} />;
      case 'reporting':
        return <AdminReports onNavigate={handleNavigation} />;
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => {
    return (
      <main className="dashboard-content">        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Nombre d'Adhérents</div>
              <div className="stat-icon">👥</div>
            </div>
            <div className="stat-value">{stats.totalAdherents}</div>
            <div className="stat-label">Utilisateurs actifs</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Cours / Semaine</div>
              <div className="stat-icon">🕐</div>
            </div>
            <div className="stat-value">{stats.coursThisWeek}</div>
            <div className="stat-label">Séances programmées</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Revenus du Mois</div>
              <div className="stat-icon">💰</div>
            </div>
            <div className="stat-value">{stats.monthlyRevenue}€</div>
            <div className="stat-label">Total des abonnements</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Taux d'Occupation</div>
              <div className="stat-icon">📊</div>
            </div>
            <div className="stat-value">{stats.occupationRate}%</div>
            <div className="stat-label">Capacité utilisée</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Actions Rapides</h2>
          <div className="action-buttons">
            <button 
              className="action-btn primary"
              onClick={() => handleNavigation('users')}
            >
              ➕ Nouvel Adhérent
            </button>              <button 
              className="action-btn secondary"
              onClick={() => handleNavigation('cours')}
            >
              🏋️ Gérer Cours
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => handleNavigation('subscriptions')}
            >
              🎯 Gérer Abonnements
            </button>            <button 
              className="action-btn secondary"
              onClick={() => handleNavigation('reporting')}
            >
              📊 Voir Rapports
            </button>
          </div>
        </div>

        </main>
    );  };
  
  if (!user || loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="user-avatar">
              {user.prenom.charAt(0)}{user.nom.charAt(0)}
            </div>
            <div className="user-info">
              <h3>{user.prenom} {user.nom}</h3>
              <p>{user.role}</p>
            </div>
          </div>
        </div>
          <nav className="nav-menu">
          <div className="nav-main">
            <a 
              href="#" 
              className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavigation('dashboard'); }}
            >
              📊 Dashboard
            </a>
            <a 
              href="#" 
              className={`nav-item ${currentView === 'users' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavigation('users'); }}
            >
              🏃‍♂️ Gestion des Adhérents
            </a>
            <a 
              href="#" 
              className={`nav-item ${currentView === 'coaches' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavigation('coaches'); }}
            >
              💪 Gestion des Coaches
            </a>
            <a 
              href="#" 
              className={`nav-item ${currentView === 'subscriptions' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavigation('subscriptions'); }}
            >
              🎫 Les Abonnements
            </a>
            <a 
              href="#" 
              className={`nav-item ${currentView === 'cours' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavigation('cours'); }}
            >
              🏋️ Gestion des Cours
            </a>
            <a 
              href="#" 
              className={`nav-item ${currentView === 'reporting' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavigation('reporting'); }}
            >
              📈 Reporting
            </a>
          </div>
          <div className="nav-bottom">
            <a 
              href="#" 
              className="nav-item logout-btn"
              onClick={(e) => { e.preventDefault(); handleLogout(); }}
            >
              🚪 Déconnexion
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default AdminDashboard;
