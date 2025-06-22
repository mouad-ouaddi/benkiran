import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();      if (response.ok) {
        // Store user data
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Call the onLogin prop to update the parent component's state
        if (onLogin) {
          onLogin(data.user);
        }
        
        // Redirect based on role using React Router
        switch (data.user.role) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'coach':
            navigate('/coach-dashboard');
            break;
          case 'adherent':
            navigate('/adherent-dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(data.message || 'Erreur de connexion');
      }    } catch (err) {
      console.error('Login error:', err);
      setError(`Erreur de connexion au serveur: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Gym Management</h1>
          <h2>Connexion</h2>
          <p>Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="Entrez votre email"
              required
            />
          </div>          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default Login;
