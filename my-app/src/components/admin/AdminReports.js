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
      setError('Failed to load reports. Please try again later.');
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
      alert('Please enter a response before submitting.');
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
      alert('Failed to submit response. Please try again.');
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
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
      alert('Failed to delete report. Please try again.');
    }
  };

  if (loading) {
    return <div className="admin-reports-container loading">Loading reports...</div>;
  }

  if (error) {
    return <div className="admin-reports-container error">{error}</div>;
  }

  return (
    <div className="admin-reports-container">
      <h2>Reports Management</h2>
      
      <div className="reports-layout">
        <div className="reports-list">
          <h3>All Reports</h3>
          {reports.length === 0 ? (
            <p>No reports available.</p>
          ) : (
            <ul>
              {reports.map(report => (
                <li 
                  key={report.id} 
                  className={`report-item ${selectedReport && selectedReport.id === report.id ? 'active' : ''} ${report.reponse ? 'responded' : 'pending'}`}
                  onClick={() => handleSelectReport(report)}
                >
                  <div className="report-header">
                    <span className="report-title">{report.titre}</span>
                    <span className="report-status">
                      {report.reponse ? 'Responded' : 'Pending'}
                    </span>
                  </div>
                  <div className="report-meta">
                    <span>By: {report.utilisateur ? `${report.utilisateur.nom} ${report.utilisateur.prenom}` : 'Unknown'}</span>
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
                <h3>{selectedReport.titre}</h3>
                <button 
                  className="delete-button" 
                  onClick={() => deleteReport(selectedReport.id)}
                >
                  Delete
                </button>
              </div>
              
              <div className="report-user-info">
                <p>
                  <strong>Reported by:</strong> {selectedReport.utilisateur 
                    ? `${selectedReport.utilisateur.nom} ${selectedReport.utilisateur.prenom} (${selectedReport.utilisateur.email})` 
                    : 'Unknown'}
                </p>
                <p><strong>Date:</strong> {new Date(selectedReport.created_at).toLocaleString()}</p>
              </div>
              
              <div className="report-content">
                <h4>Report Content:</h4>
                <p>{selectedReport.contenu}</p>
              </div>
              
              <div className="admin-response">
                <h4>Admin Response:</h4>
                <textarea 
                  value={response} 
                  onChange={handleResponseChange}
                  placeholder="Enter your response here..."
                  rows={5}
                ></textarea>
                
                <div className="response-actions">
                  {responseSuccess && (
                    <span className="response-success">Response submitted successfully!</span>
                  )}
                  <button 
                    className="submit-button" 
                    onClick={submitResponse}
                    disabled={!response.trim()}
                  >
                    {selectedReport.reponse ? 'Update Response' : 'Submit Response'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-report-selected">
              <p>Please select a report from the list to view details and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;