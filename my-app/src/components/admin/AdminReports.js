import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminReports.css';

const API_URL = 'http://localhost:8000/api';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [response, setResponse] = useState('');
  const [responseSuccess, setResponseSuccess] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/reports`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReports(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Échec du chargement des rapports. Veuillez réessayer plus tard.');
      setLoading(false);
    }
  };

  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setResponse(report.reponse || '');
    setResponseSuccess(false);
  };

  const handleResponseChange = (e) => {
    setResponse(e.target.value);
  };

  const submitResponse = async () => {
    if (!response.trim()) {
      alert('Veuillez saisir une réponse avant de soumettre.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/reports/${selectedReport.id}/respond`,
        { reponse: response },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update the local state
      const updatedReports = reports.map(report => {
        if (report.id === selectedReport.id) {
          return { ...report, reponse: response };
        }
        return report;
      });
      
      setReports(updatedReports);
      setSelectedReport({ ...selectedReport, reponse: response });
      setResponseSuccess(true);
      
      // Refresh reports after a short delay
      setTimeout(() => {
        fetchReports();
      }, 2000);
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Échec de l\'envoi de la réponse. Veuillez réessayer.');
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/reports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the local state
      const updatedReports = reports.filter(report => report.id !== id);
      setReports(updatedReports);
      
      if (selectedReport && selectedReport.id === id) {
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Échec de la suppression du rapport. Veuillez réessayer.');
    }
  };

  if (loading) {
    return <div className="admin-reports-container loading">Chargement des rapports...</div>;
  }

  if (error) {
    return <div className="admin-reports-container error">{error}</div>;
  }

  return (
    <div className="admin-reports-container">      <h2>Gestion des Rapports</h2>
      
      <div className="reports-layout">
        <div className="reports-list">
          <h3>Tous les Rapports</h3>
          {reports.length === 0 ? (
            <p>Aucun rapport disponible.</p>
          ) : (
            <ul>
              {reports.map(report => (
                <li 
                  key={report.id} 
                  className={`report-item ${selectedReport && selectedReport.id === report.id ? 'active' : ''} ${report.reponse ? 'responded' : 'pending'}`}
                  onClick={() => handleSelectReport(report)}
                >
                  <div className="report-header">
                    <span className="report-title">{report.titre}</span>                    <span className="report-status">
                      {report.reponse ? 'Répondu' : 'En attente'}
                    </span>
                  </div>
                  <div className="report-meta">
                    <span>Par: {report.utilisateur ? `${report.utilisateur.nom} ${report.utilisateur.prenom}` : 'Inconnu'}</span>
                    <span>{new Date(report.created_at).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="report-detail">
          {selectedReport ? (
            <>
              <div className="report-detail-header">
                <h3>{selectedReport.titre}</h3>                <button 
                  className="delete-button" 
                  onClick={() => deleteReport(selectedReport.id)}
                >
                  Supprimer
                </button>
              </div>
              
              <div className="report-user-info">
                <p>
                  <strong>Signalé par:</strong> {selectedReport.utilisateur 
                    ? `${selectedReport.utilisateur.nom} ${selectedReport.utilisateur.prenom} (${selectedReport.utilisateur.email})` 
                    : 'Inconnu'}
                </p>
                <p><strong>Date:</strong> {new Date(selectedReport.created_at).toLocaleString()}</p>
              </div>
              
              <div className="report-content">
                <h4>Contenu du Rapport:</h4>
                <p>{selectedReport.contenu}</p>
              </div>
              
              <div className="admin-response">
                <h4>Réponse de l'Administrateur:</h4>
                <textarea 
                  value={response} 
                  onChange={handleResponseChange}
                  placeholder="Saisissez votre réponse ici..."
                  rows={5}
                ></textarea>
                
                <div className="response-actions">
                  {responseSuccess && (
                    <span className="response-success">Réponse soumise avec succès!</span>
                  )}
                  <button 
                    className="submit-button" 
                    onClick={submitResponse}
                    disabled={!response.trim()}
                  >
                    {selectedReport.reponse ? 'Mettre à jour la réponse' : 'Soumettre la réponse'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-report-selected">
              <p>Veuillez sélectionner un rapport dans la liste pour voir les détails et répondre.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;