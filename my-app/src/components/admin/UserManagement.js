import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = ({ onNavigate }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);  const [message, setMessage] = useState({ type: '', text: '' });
  const [sortField, setSortField] = useState('nom');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    role: 'adherent'
  });
  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-badge admin';
      case 'coach': return 'role-badge coach';
      case 'adherent': return 'role-badge adherent';
      default: return 'role-badge';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'coach': return 'Coach';
      case 'adherent': return 'Adhérent';
      default: return role;
    }
  };

  const getStatusBadge = (user) => {
    if (user.role === 'adherent') {
      if (!user.date_fin) return <span className="status-badge inactive">Sans abonnement</span>;
      
      const endDate = new Date(user.date_fin);
      const now = new Date();
      
      if (endDate < now) {
        return <span className="status-badge expired">Expiré</span>;
      } else {
        const diffTime = endDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
          return <span className="status-badge warning">Expire bientôt</span>;
        }
        return <span className="status-badge active">Actif</span>;
      }
    }
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
    // Only show adherents
    let filtered = users.filter(user => {
      const isAdherent = user.role === 'adherent';
      const matchesSearch = searchTerm === '' || 
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return isAdherent && matchesSearch;
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
  };

  const handleAddUser = () => {
    setModalMode('add');
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      mot_de_passe: '',
      role: 'adherent'
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
      role: user.role
    });
    setSelectedUser(user);
    setShowModal(true);
  };
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
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
          alert('Erreur lors de la suppression de l\'utilisateur');
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
            text: modalMode === 'add' ? 'Adhérent ajouté avec succès!' : 'Adhérent modifié avec succès!' 
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
  return (    <div className="user-management">
      <div className="user-management-header">
        <h1>Gestion des Adhérents</h1>
        <button onClick={handleAddUser} className="add-user-btn">
          AJOUTER ADHÉRENT
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
        <div className="results-count">
          {getSortedAndFilteredUsers().length} adhérent(s) trouvé(s)
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
                Email                <span className="sort-icon">
                  {sortField === 'email' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </th>
              <th>Statut</th>
              <th>Abonnement</th>
              
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
                    <small>ID: {user.id}</small>                  </div>
                </td>
                <td>
                  <div className="user-email">
                    {user.email}
                  </div>
                </td>
                <td>
                  {getStatusBadge(user)}
                </td>
                <td>
                  <div className="subscription-info">
                    <strong>{user.abonnement_type || 'N/A'}</strong>
                    {user.date_debut && (
                      <small>Depuis: {formatDate(user.date_debut)}</small>
                    )}
                  </div>
                </td>
                
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="modify-btn"
                      title="Modifier l'utilisateur"
                    >
                      MODIFIER
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="delete-btn"
                      disabled={deleting === user.id}
                      title="Supprimer l'utilisateur"
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
            ))}
            {getSortedAndFilteredUsers().length === 0 && (
              <tr>                <td colSpan="8" className="no-results">
                  Aucun adhérent trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit User */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{modalMode === 'add' ? 'Ajouter un adhérent' : 'Modifier l\'adhérent'}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>            <form onSubmit={handleSubmit} className="user-form">
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
                </div>              </div>
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

export default UserManagement;
