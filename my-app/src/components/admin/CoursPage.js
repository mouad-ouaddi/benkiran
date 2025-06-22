import React, { useState, useEffect } from 'react';
import './CoursPage.css';

const CoursPage = ({ onNavigate }) => {
  const [cours, setCours] = useState([]);
  const [coachs, setCoachs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedCours, setSelectedCours] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    type: '',
    coach_id: '',
    date_debut: '',
    duree: ''
  });

  useEffect(() => {
    fetchCours();
    fetchCoachs();
  }, []);

  const fetchCours = async () => {
    try {
      console.log('Fetching cours...');
      const response = await fetch('http://localhost:8000/api/cours', {
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
          setCours(data.data);
          console.log('Cours set:', data.data);
        } else {
          console.error('API returned success: false', data);
        }
      } else {
        console.error('Failed to fetch cours, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching cours:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoachs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/coachs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {          setCoachs(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching coachs:', error);
    }
  };
  const handleAddCours = () => {
    setModalMode('add');
    setFormData({
      nom: '',
      description: '',
      type: '',
      coach_id: '',
      date_debut: '',
      duree: ''
    });
    setSelectedCours(null);
    setShowModal(true);
  };

  const handleEditCours = (coursItem) => {
    setModalMode('edit');
    const dateDebut = new Date(coursItem.date_debut);
    const formattedDate = dateDebut.toISOString().slice(0, 16);
    
    setFormData({
      nom: coursItem.nom,
      description: coursItem.description || '',
      type: coursItem.type,
      coach_id: coursItem.coach_id.toString(),
      date_debut: formattedDate,
      duree: coursItem.duree.toString()
    });
    setSelectedCours(coursItem);
    setShowModal(true);
  };

  const handleDeleteCours = async (coursId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      setDeleting(coursId);
      try {
        const response = await fetch(`http://localhost:8000/api/cours/${coursId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            fetchCours(); // Refresh the list
          }
        } else {
          console.error('Failed to delete cours');
          alert('Erreur lors de la suppression du cours');
        }
      } catch (error) {
        console.error('Error deleting cours:', error);
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
        ? 'http://localhost:8000/api/cours'
        : `http://localhost:8000/api/cours/${selectedCours.id}`;
        
      const method = modalMode === 'add' ? 'POST' : 'PUT';
        const submitData = {
        ...formData,
        coach_id: parseInt(formData.coach_id),
        duree: parseInt(formData.duree)
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
            text: modalMode === 'add' ? 'Cours ajouté avec succès!' : 'Cours modifié avec succès!' 
          });
          setTimeout(() => {
            setShowModal(false);
            setMessage({ type: '', text: '' });
            fetchCours(); // Refresh the list
          }, 1500);
        } else {
          setMessage({ type: 'error', text: data.message || 'Erreur lors de l\'opération' });
        }
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Erreur du serveur' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
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

  const closeModal = () => {
    setShowModal(false);
    setMessage({ type: '', text: '' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  };

  const getCoachName = (coursItem) => {
    if (coursItem.coach && coursItem.coach.utilisateur) {
      return `${coursItem.coach.utilisateur.prenom} ${coursItem.coach.utilisateur.nom}`;
    }
    return 'Coach non défini';
  };

  if (loading) {
    return (
      <div className="cours-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cours-page">
      <div className="cours-header">
        <h1>Gestion des Cours</h1>
        <button className="add-cours-btn" onClick={handleAddCours}>
          <span className="btn-icon">+</span>
          Ajouter un Cours
        </button>
      </div>

      <div className="cours-stats">
        <div className="stat-card">
          <div className="stat-number">{cours.length}</div>
          <div className="stat-label">Cours Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{new Set(cours.map(c => c.coach_id)).size}</div>
          <div className="stat-label">Coachs Actifs</div>
        </div>
      </div>

      <div className="cours-grid">
        {cours.length === 0 ? (
          <div className="no-cours">
            <div className="no-cours-icon">📚</div>
            <h3>Aucun cours trouvé</h3>
            <p>Commencez par ajouter votre premier cours</p>
            <button className="add-first-cours-btn" onClick={handleAddCours}>
              Ajouter un Cours
            </button>
          </div>
        ) : (
          cours.map((coursItem) => (
            <div key={coursItem.id} className="cours-card">
              <div className="cours-card-header">
                <h3 className="cours-nom">{coursItem.nom}</h3>
                <span className="cours-type">{coursItem.type}</span>
              </div>
              
              <div className="cours-card-body">
                <div className="cours-info">
                  <div className="info-item">
                    <span className="info-label">Coach:</span>
                    <span className="info-value">{getCoachName(coursItem)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Date:</span>
                    <span className="info-value">{formatDate(coursItem.date_debut)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Durée:</span>
                    <span className="info-value">{formatDuration(coursItem.duree)}</span>
                  </div>
                  {coursItem.description && (
                    <div className="cours-description">
                      <span className="info-label">Description:</span>
                      <p>{coursItem.description}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="cours-card-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEditCours(coursItem)}
                  disabled={deleting === coursItem.id}
                >
                  ✏️ Modifier
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteCours(coursItem.id)}
                  disabled={deleting === coursItem.id}
                >
                  {deleting === coursItem.id ? '⏳' : '🗑️'} Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'add' ? 'Ajouter un Cours' : 'Modifier le Cours'}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="cours-form">
              <div className="form-group">
                <label htmlFor="nom">Nom du Cours *</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Yoga débutant"
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Type de Cours *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Pilates">Pilates</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Musculation">Musculation</option>
                  <option value="Danse">Danse</option>
                  <option value="Aqua Fitness">Aqua Fitness</option>
                  <option value="Boxing">Boxing</option>
                  <option value="Spinning">Spinning</option>
                  <option value="Crossfit">Crossfit</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="coach_id">Coach *</label>
                <select
                  id="coach_id"
                  name="coach_id"
                  value={formData.coach_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Sélectionner un coach</option>
                  {coachs.map(coach => (
                    <option key={coach.id} value={coach.id}>
                      {coach.utilisateur ? `${coach.utilisateur.prenom} ${coach.utilisateur.nom}` : `Coach ${coach.id}`}
                      {coach.specialite && ` - ${coach.specialite}`}                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date_debut">Date et Heure de Début *</label>
                  <input
                    type="datetime-local"
                    id="date_debut"
                    name="date_debut"
                    value={formData.date_debut}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duree">Durée (minutes) *</label>
                  <input
                    type="number"
                    id="duree"
                    name="duree"
                    value={formData.duree}
                    onChange={handleInputChange}
                    required
                    min="15"
                    max="300"
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Description du cours (optionnel)"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Traitement...' : (modalMode === 'add' ? 'Ajouter' : 'Modifier')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursPage;
