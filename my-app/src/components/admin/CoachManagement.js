import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const CoachManagement = ({ onNavigate }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [sortField, setSortField] = useState('nom');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    role: 'coach',
    specialite: 'fitness',
    experience: ''
  });

  // Specialty options for coaches
  const specialtyOptions = [
    { value: 'fitness', label: 'Fitness & Musculation', icon: '💪' },
    { value: 'cardio', label: 'Cardio & Endurance', icon: '🏃‍♂️' },
    { value: 'yoga', label: 'Yoga & Pilates', icon: '🧘‍♀️' },
    { value: 'crossfit', label: 'CrossFit', icon: '🏋️‍♂️' },
    { value: 'boxe', label: 'Boxe & Arts Martiaux', icon: '🥊' },
    { value: 'natation', label: 'Natation', icon: '🏊‍♂️' },
    { value: 'danse', label: 'Danse & Zumba', icon: '💃' },
    { value: 'nutrition', label: 'Nutrition & Diététique', icon: '🥗' },
    { value: 'rehabilitation', label: 'Rééducation & Kiné', icon: '🩺' },
    { value: 'senior', label: 'Sport Senior', icon: '👴' },
    { value: 'enfant', label: 'Sport Enfant', icon: '🧒' },
    { value: 'general', label: 'Coach Général', icon: '⭐' }
  ];

  // Get specialty display info
  const getSpecialtyInfo = (specialtyValue) => {
    const specialty = specialtyOptions.find(opt => opt.value === specialtyValue);
    return specialty || { value: 'general', label: 'Coach Général', icon: '⭐' };
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getStatusBadge = () => {
    return <span className="status-badge active">Actif</span>;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const getSortedAndFilteredUsers = () => {
    // Only show coaches
    let filtered = users.filter(user => {
      const isCoach = user.role === 'coach';
      const matchesSearch = searchTerm === '' || 
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = filterSpecialty === 'all' || user.specialite === filterSpecialty;
      return isCoach && matchesSearch && matchesSpecialty;
    });

    return filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'nom') {
        aVal = `${a.nom} ${a.prenom}`;
        bVal = `${b.nom} ${b.prenom}`;
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        }
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };  const handleAddUser = () => {
    setModalMode('add');
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      mot_de_passe: '',
      role: 'coach',
      specialite: 'fitness',
      experience: ''
    });
    setSelectedUser(null);
    setShowModal(true);
  };
  const handleEditUser = (user) => {
    setModalMode('edit');
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      mot_de_passe: '',
      role: user.role,
      specialite: user.specialite || 'fitness',
      experience: user.experience || ''
    });
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce coach ?')) {
      setDeleting(userId);
      try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            fetchUsers(); // Refresh the list
          }
        } else {
          console.error('Failed to delete user');
          alert('Erreur lors de la suppression du coach');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
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
        ? 'http://localhost:8000/api/users'
        : `http://localhost:8000/api/users/${selectedUser.id}`;
        
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const submitData = { ...formData };
      if (modalMode === 'edit' && !formData.mot_de_passe) {
        delete submitData.mot_de_passe;
      }

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
            text: modalMode === 'add' ? 'Coach ajouté avec succès!' : 'Coach modifié avec succès!' 
          });
          setTimeout(() => {
            setShowModal(false);
            setMessage({ type: '', text: '' });
            fetchUsers(); // Refresh the list
          }, 1500);
        }
      } else {
        const errorData = await response.json();
        setMessage({ 
          type: 'error', 
          text: errorData.message || 'Erreur lors de la sauvegarde' 
        });
        console.error('Failed to save user:', errorData);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Erreur de connexion au serveur' 
      });
      console.error('Error saving user:', error);
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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1>Gestion des Coaches</h1>
        <button onClick={handleAddUser} className="add-user-btn">
          AJOUTER COACH
        </button>
      </div>      {/* Search Section */}
      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="specialty-filter">
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les spécialités</option>
            {specialtyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="results-count">
          {getSortedAndFilteredUsers().length} coach(es) trouvé(s)
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th></th>
              <th 
                className={`sortable ${sortField === 'nom' ? 'sorted-' + sortDirection : ''}`}
                onClick={() => handleSort('nom')}
              >
                Nom & Prénom
                <span className="sort-icon">
                  {sortField === 'nom' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </th>
              <th 
                className={`sortable ${sortField === 'email' ? 'sorted-' + sortDirection : ''}`}
                onClick={() => handleSort('email')}
              >
                Email
                <span className="sort-icon">
                  {sortField === 'email' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </th>              <th>Statut</th>
              <th>Spécialité</th>
              
              <th
                className={`sortable ${sortField === 'date_creation' ? 'sorted-' + sortDirection : ''}`}
                onClick={() => handleSort('date_creation')}
              >
                Date Création
                <span className="sort-icon">
                  {sortField === 'date_creation' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getSortedAndFilteredUsers().map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-avatar">
                    {user.prenom.charAt(0)}{user.nom.charAt(0)}
                  </div>
                </td>
                <td>
                  <div className="user-name">
                    <strong>{user.prenom} {user.nom}</strong>
                    <small>ID: {user.id}</small>
                  </div>
                </td>
                <td>
                  <div className="user-email">
                    {user.email}
                  </div>
                </td>
                <td>
                  {getStatusBadge()}
                </td>                <td>
                  <div className="specialty-info">
                    <strong>
                      {getSpecialtyInfo(user.specialite || 'general').icon} {getSpecialtyInfo(user.specialite || 'general').label}
                    </strong>
                    <small>Spécialité du coach</small>
                  </div>
                </td>
                <td>
                  <div className="experience-info">
                    <strong>{user.experience || 0} {(user.experience || 0) <= 1 ? 'an' : 'ans'}</strong>
                    <small>d'expérience</small>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="modify-btn"
                      title="Modifier le coach"
                    >
                      MODIFIER
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="delete-btn"
                      disabled={deleting === user.id}
                      title="Supprimer le coach"
                    >
                      {deleting === user.id ? (
                        <>
                          <span className="spinner"></span>
                          SUPPRESSION...
                        </>
                      ) : (
                        'SUPPRIMER'
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}            {getSortedAndFilteredUsers().length === 0 && (
              <tr>
                <td colSpan="8" className="no-results">
                  Aucun coach trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Coach */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{modalMode === 'add' ? 'Ajouter un coach' : 'Modifier le coach'}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="user-form">
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
                    placeholder="Nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="prenom"
                    placeholder="Prénom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="mot_de_passe"
                    placeholder={modalMode === 'edit' ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
                    value={formData.mot_de_passe}
                    onChange={handleInputChange}
                    required={modalMode === 'add'}
                  />
                </div>              </div>              <div className="form-row">
                <div className="form-group">
                  <select
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleInputChange}
                    required
                    className="specialty-select"
                  >
                    {specialtyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    name="experience"
                    placeholder="Années d'expérience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    min="0"
                    max="50"
                    required
                    className="experience-input"
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
                      {modalMode === 'add' ? 'Ajout en cours...' : 'Modification en cours...'}
                    </>
                  ) : (
                    modalMode === 'add' ? 'Ajouter' : 'Modifier'
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

export default CoachManagement;
