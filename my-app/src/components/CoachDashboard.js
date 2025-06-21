import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin/Dashboard.css';

const CoachDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard Coach</h1>
        <div className="user-info">
          <span>Bienvenue, Coach {user.prenom} {user.nom}</span>
          <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="coach-profile">
          <h2>Mon Profil</h2>
          <div className="profile-info">
            <p><strong>Spécialité:</strong> {user.specialite || 'Non spécifiée'}</p>
            <p><strong>Expérience:</strong> {user.experience || 0} ans</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Mes Cours</h3>
            <p>Gérer mes cours et programmes</p>
            <div className="stats">
              <span className="stat-number">12</span>
              <span className="stat-label">Cours cette semaine</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Planning</h3>
            <p>Consulter et modifier mon planning</p>
            <div className="stats">
              <span className="stat-number">25</span>
              <span className="stat-label">Heures planifiées</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Mes Adhérents</h3>
            <p>Suivre les progrès de mes adhérents</p>
            <div className="stats">
              <span className="stat-number">48</span>
              <span className="stat-label">Adhérents actifs</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Réservations</h3>
            <p>Voir les réservations pour mes cours</p>
            <div className="stats">
              <span className="stat-number">156</span>
              <span className="stat-label">Réservations ce mois</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Évaluations</h3>
            <p>Notes et commentaires des adhérents</p>
            <div className="stats">
              <span className="stat-number">4.8/5</span>
              <span className="stat-label">Note moyenne</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Créer un Cours</h3>
            <p>Ajouter un nouveau cours au planning</p>
            <div className="stats">
              <span className="stat-number">+</span>
              <span className="stat-label">Nouveau cours</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoachDashboard;
