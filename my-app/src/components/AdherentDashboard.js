import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin/Dashboard.css';

const AdherentDashboard = ({ onLogout }) => {
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
        <h1>Dashboard Adhérent</h1>
        <div className="user-info">
          <span>Bienvenue, {user.prenom} {user.nom}</span>
          <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Mon Abonnement</h3>
            <p>Détails de votre abonnement actuel</p>
            <div className="stats">
              <span className="stat-number">Premium</span>
              <span className="stat-label">Abonnement actif</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Réserver un Cours</h3>
            <p>Réservez vos prochaines séances</p>
            <div className="stats">
              <span className="stat-number">24</span>
              <span className="stat-label">Cours disponibles</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Mes Réservations</h3>
            <p>Vos cours réservés et à venir</p>
            <div className="stats">
              <span className="stat-number">3</span>
              <span className="stat-label">Cours cette semaine</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Planning Personnel</h3>
            <p>Votre planning d'entraînement</p>
            <div className="stats">
              <span className="stat-number">5h</span>
              <span className="stat-label">Temps d'entraînement</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Historique</h3>
            <p>Vos séances passées et progrès</p>
            <div className="stats">
              <span className="stat-number">47</span>
              <span className="stat-label">Séances completées</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Profil</h3>
            <p>Gérer vos informations personnelles</p>
            <div className="stats">
              <span className="stat-number">★★★★☆</span>
              <span className="stat-label">Votre progression</span>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Actions Rapides</h2>
          <div className="action-buttons">
            <button className="action-btn primary">Réserver maintenant</button>
            <button className="action-btn secondary">Voir le planning</button>
            <button className="action-btn secondary">Contacter un coach</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdherentDashboard;
