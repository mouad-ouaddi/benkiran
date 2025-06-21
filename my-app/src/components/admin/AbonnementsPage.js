import React, { useState, useEffect } from 'react';
import './AbonnementsPage.css';

const AbonnementsPage = ({ onNavigate }) => {
  const [abonnements, setAbonnements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedAbonnement, setSelectedAbonnement] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    nom: '',
    duree: '',
    prix: '',
    description: ''
  });

  useEffect(() => {
    fetchAbonnements();
  }, []);
  const fetchAbonnements = async () => {
    try {
      console.log('Fetching abonnements...');
      const response = await fetch('http://localhost:8000/api/abonnements', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        if (data.success) {
          setAbonnements(data.data);
          console.log('Abonnements set:', data.data);
        } else {
          console.error('API returned success: false', data);
        }
      } else {
        console.error('Failed to fetch abonnements, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching abonnements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAbonnement = () => {
    setModalMode('add');
    setFormData({
      nom: '',
      duree: '',
      prix: '',
      description: ''
    });
    setSelectedAbonnement(null);
    setShowModal(true);
  };

  const handleEditAbonnement = (abonnement) => {
    setModalMode('edit');
    setFormData({
      nom: abonnement.nom,
      duree: abonnement.duree.toString(),
      prix: abonnement.prix.toString(),
      description: abonnement.description
    });
    setSelectedAbonnement(abonnement);
    setShowModal(true);
  };

  const handleDeleteAbonnement = async (abonnementId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
      setDeleting(abonnementId);
      try {
        const response = await fetch(`http://localhost:8000/api/abonnements/${abonnementId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            fetchAbonnements(); // Refresh the list
          }
        } else {
          console.error('Failed to delete abonnement');
          alert('Erreur lors de la suppression de l\'abonnement');
        }
      } catch (error) {
        console.error('Error deleting abonnement:', error);
        alert('Erreur de connexion au serveur');
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      const url = modalMode === 'add' 
        ? 'http://localhost:8000/api/abonnements'
        : `http://localhost:8000/api/abonnements/${selectedAbonnement.id}`;
        
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const submitData = {
        ...formData,
        duree: parseInt(formData.duree),
        prix: parseFloat(formData.prix)
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage({ 
            type: 'success', 
            text: modalMode === 'add' ? 'Abonnement ajouté avec succès!' : 'Abonnement modifié avec succès!' 
          });
          setTimeout(() => {
            setShowModal(false);
            setMessage({ type: '', text: '' });
            fetchAbonnements(); // Refresh the list
          }, 1500);
        }
      } else {
        const errorData = await response.json();
        setMessage({ 
          type: 'error', 
          text: errorData.message || 'Erreur lors de la sauvegarde' 
        });
        console.error('Failed to save abonnement:', errorData);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Erreur de connexion au serveur' 
      });
      console.error('Error saving abonnement:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDuration = (duree) => {
    return `${duree} mois`;
  };

  const formatPrice = (prix) => {
    return `${prix} dh`;
  };
  if (loading) {
    return <div className="loading">Chargement des abonnements...</div>;
  }

  console.log('Rendering with abonnements:', abonnements);
  console.log('Abonnements length:', abonnements.length);

  return (
    <div className="abonnements-page">
      <div className="abonnements-header">
        <h1>LES ABONNEMENTS</h1>
        <button onClick={handleAddAbonnement} className="add-abonnement-btn">
          AJOUTER
        </button>
      </div>      {/* Modal for Add Abonnement */}
      {showModal && modalMode === 'add' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Ajouter un abonnement</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="abonnement-form">
              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="nom"
                    placeholder="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>                <div className="form-group">
                  <input
                    type="number"
                    name="duree"
                    placeholder="durée (en mois)"
                    value={formData.duree}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="12"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    name="prix"
                    placeholder="prix"
                    value={formData.prix}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <textarea
                    name="description"
                    placeholder="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn" disabled={submitting}>
                  Annuler
                </button>
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner"></span>
                      Ajout en cours...
                    </>
                  ) : (
                    'AJOUTER'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Abonnements Cards Grid */}
      <div className="abonnements-grid">
        {abonnements.map((abonnement) => (
          <div key={abonnement.id} className="abonnement-card">            <div className="card-header">
              <h3 className="abonnement-name">{abonnement.nom}</h3>
            </div>
            <div className="card-content">
              <div className="card-info">
                <div className="info-row">
                  <span className="label">Durée :</span>
                  <span className="value">{formatDuration(abonnement.duree)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Prix :</span>
                  <span className="value">{formatPrice(abonnement.prix)}</span>
                </div>
              </div>
              <div className="card-description">
                {abonnement.description}
              </div>
            </div>
            <div className="card-actions">
              <button 
                onClick={() => handleEditAbonnement(abonnement)}
                className="edit-btn"
              >
                Modifier
              </button>
              <button 
                onClick={() => handleDeleteAbonnement(abonnement.id)}
                className="delete-btn"
                disabled={deleting === abonnement.id}
              >
                {deleting === abonnement.id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        ))}
        
        {abonnements.length === 0 && (
          <div className="no-abonnements">
            Aucun abonnement trouvé
          </div>
        )}
      </div>

      {/* Modal for Edit Abonnement */}
      {showModal && modalMode === 'edit' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Modifier l'abonnement</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="abonnement-form">
              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="nom"
                    placeholder="Nom de l'abonnement"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>                <div className="form-group">
                  <input
                    type="number"
                    name="duree"
                    placeholder="Durée (en mois)"
                    value={formData.duree}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="12"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="number"
                    name="prix"
                    placeholder="Prix (en DH)"
                    value={formData.prix}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <textarea
                    name="description"
                    placeholder="Description de l'abonnement"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn" disabled={submitting}>
                  Annuler
                </button>
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner"></span>
                      Modification en cours...
                    </>
                  ) : (
                    'Modifier'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbonnementsPage;
