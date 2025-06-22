import React, { useEffect, useState } from 'react';

const CoachDashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState([
    { id: 1, type: 'Cardio', date: '2025-04-12', time: '10:00', lieu: 'Salle A', capacite_max: 20, capacite_actuelle: 15, statut: 'À venir', description: 'Cours de cardio intensif' },
    { id: 2, type: 'Yoga', date: '2025-04-15', time: '18:30', lieu: 'Salle B', capacite_max: 20, capacite_actuelle: 20, statut: 'À venir', description: 'Yoga relaxant' },
    { id: 3, type: 'AquaGym', date: '2025-04-18', time: '09:00', lieu: 'Piscine', capacite_max: 10, capacite_actuelle: 9, statut: 'À venir', description: 'Aquagym pour tous niveaux' },
    { id: 4, type: 'Pilates', date: '2025-04-20', time: '19:00', lieu: 'Salle C', capacite_max: 15, capacite_actuelle: 12, statut: 'À venir', description: 'Pilates débutant' },
    { id: 5, type: 'CrossFit', date: '2025-04-22', time: '07:00', lieu: 'Salle D', capacite_max: 12, capacite_actuelle: 8, statut: 'À venir', description: 'CrossFit avancé' }
  ]);
  
  // State for members
  const [members, setMembers] = useState([
    { id: 1, nom: 'Dupont', prenom: 'Marie', email: 'marie.dupont@email.com', abonnement: 'Premium', dateInscription: '2024-01-15', statut: 'Actif', telephone: '0123456789', coursInscrits: ['Yoga', 'Pilates'] },
    { id: 2, nom: 'Martin', prenom: 'Jean', email: 'jean.martin@email.com', abonnement: 'Basic', dateInscription: '2024-02-10', statut: 'Actif', telephone: '0123456788', coursInscrits: ['Cardio'] },
    { id: 3, nom: 'Bernard', prenom: 'Sophie', email: 'sophie.bernard@email.com', abonnement: 'VIP', dateInscription: '2024-03-05', statut: 'Actif', telephone: '0123456787', coursInscrits: ['CrossFit', 'AquaGym'] },
    { id: 4, nom: 'Dubois', prenom: 'Pierre', email: 'pierre.dubois@email.com', abonnement: 'Premium', dateInscription: '2023-12-20', statut: 'Suspendu', telephone: '0123456786', coursInscrits: ['Yoga'] },
    { id: 5, nom: 'Moreau', prenom: 'Lucie', email: 'lucie.moreau@email.com', abonnement: 'Basic', dateInscription: '2024-04-01', statut: 'Actif', telephone: '0123456785', coursInscrits: ['Pilates', 'Yoga'] }
  ]);

  // State for attendance
  const [attendance, setAttendance] = useState([
    { courseId: 1, courseName: 'Cardio - 12/04 10:00', members: [
      { id: 1, nom: 'Dupont', prenom: 'Marie', present: true, retard: false },
      { id: 2, nom: 'Martin', prenom: 'Jean', present: true, retard: true },
      { id: 3, nom: 'Bernard', prenom: 'Sophie', present: false, retard: false }
    ]},
    { courseId: 2, courseName: 'Yoga - 15/04 18:30', members: [
      { id: 1, nom: 'Dupont', prenom: 'Marie', present: true, retard: false },
      { id: 4, nom: 'Dubois', prenom: 'Pierre', present: true, retard: false },
      { id: 5, nom: 'Moreau', prenom: 'Lucie', present: false, retard: false }
    ]}
  ]);

  // State for evaluations
  const [evaluations, setEvaluations] = useState([
    { id: 1, memberName: 'Marie Dupont', courseType: 'Yoga', date: '2025-04-10', note: 4, commentaire: 'Excellente progression, continue comme ça!', objectifs: 'Améliorer la flexibilité' },
    { id: 2, memberName: 'Jean Martin', courseType: 'Cardio', date: '2025-04-08', note: 3, commentaire: 'Bon effort, mais peut mieux faire', objectifs: 'Augmenter l\'endurance' },
    { id: 3, memberName: 'Sophie Bernard', courseType: 'CrossFit', date: '2025-04-05', note: 5, commentaire: 'Performance exceptionnelle!', objectifs: 'Maintenir le niveau' }
  ]);

  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  
  const [filters, setFilters] = useState({
    type: '',
    statut: '',
    date: ''
  });

  // Mock dashboard stats
  const [dashboardStats] = useState({
    coursesThisWeek: 12,
    activeMembers: members.filter(m => m.statut === 'Actif').length,
    reservations: 156,
    averageRating: 4.8
  });

  useEffect(() => {
    const mockUser = {
      prenom: "Claire",
      nom: "Martin",
      specialite: "Fitness & Yoga",
      experience: 5,
      email: "claire.martin@example.com"
    };
    setUser(mockUser);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, courses]);

  const applyFilters = () => {
    let filtered = [...courses];

    if (filters.type) {
      filtered = filtered.filter(course => course.type === filters.type);
    }

    if (filters.statut) {
      filtered = filtered.filter(course => course.statut === filters.statut);
    }

    if (filters.date) {
      const today = new Date();
      
      switch (filters.date) {
        case 'today':
          filtered = filtered.filter(course => {
            const cDate = new Date(course.date);
            return cDate.toDateString() === today.toDateString();
          });
          break;
        case 'week':
          const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
          const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
          filtered = filtered.filter(course => {
            const cDate = new Date(course.date);
            return cDate >= weekStart && cDate <= weekEnd;
          });
          break;
        case 'month':
          filtered = filtered.filter(course => {
            const cDate = new Date(course.date);
            return cDate.getMonth() === today.getMonth();
          });
          break;
      }
    }

    setFilteredCourses(filtered);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleAction = (action, courseId) => {
    const course = courses.find(c => c.id === courseId);
    
    switch (action) {
      case 'view':
        setSelectedCourse(course);
        setModalType('view');
        setShowModal(true);
        break;
        
      case 'edit':
        setSelectedCourse(course);
        setModalType('edit');
        setShowModal(true);
        break;
        
      case 'delete':
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
          deleteCourse(courseId);
        }
        break;
    }
  };

  const deleteCourse = (courseId) => {
    const updatedCourses = courses.filter(c => c.id !== courseId);
    setCourses(updatedCourses);
    alert('Cours supprimé avec succès!');
  };

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    setModalType('create');
    setShowModal(true);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const saveCourse = (courseData) => {
    if (modalType === 'create') {
      const newId = Math.max(...courses.map(c => c.id)) + 1;
      const newCourse = {
        ...courseData,
        id: newId,
        capacite_actuelle: 0
      };
      setCourses([...courses, newCourse]);
      alert('Cours créé avec succès!');
    } else if (modalType === 'edit') {
      const updatedCourses = courses.map(c => 
        c.id === selectedCourse.id ? { ...c, ...courseData } : c
      );
      setCourses(updatedCourses);
      alert('Cours modifié avec succès!');
    }
    
    setShowModal(false);
    setSelectedCourse(null);
  };

  // Member management functions
  const handleMemberAction = (action, memberId) => {
    const member = members.find(m => m.id === memberId);
    
    switch (action) {
      case 'view':
        setSelectedMember(member);
        setModalType('view-member');
        setShowModal(true);
        break;
      case 'edit':
        setSelectedMember(member);
        setModalType('edit-member');
        setShowModal(true);
        break;
      case 'delete':
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet adhérent ?')) {
          setMembers(members.filter(m => m.id !== memberId));
          alert('Adhérent supprimé avec succès!');
        }
        break;
      case 'suspend':
        const updatedMembers = members.map(m => 
          m.id === memberId ? { ...m, statut: m.statut === 'Actif' ? 'Suspendu' : 'Actif' } : m
        );
        setMembers(updatedMembers);
        alert(`Adhérent ${member.statut === 'Actif' ? 'suspendu' : 'réactivé'} avec succès!`);
        break;
    }
  };

  const saveMember = (memberData) => {
    if (modalType === 'edit-member') {
      const updatedMembers = members.map(m => 
        m.id === selectedMember.id ? { ...m, ...memberData } : m
      );
      setMembers(updatedMembers);
      alert('Adhérent modifié avec succès!');
    }
    
    setShowModal(false);
    setSelectedMember(null);
  };

  // Attendance functions
  const updateAttendance = (courseId, memberId, field, value) => {
    setAttendance(attendance.map(course => 
      course.courseId === courseId 
        ? {
            ...course,
            members: course.members.map(member => 
              member.id === memberId 
                ? { ...member, [field]: value }
                : member
            )
          }
        : course
    ));
  };

  // Evaluation functions
  const handleEvaluationAction = (action, evalId) => {
    const evaluation = evaluations.find(e => e.id === evalId);
    
    switch (action) {
      case 'view':
        setSelectedEvaluation(evaluation);
        setModalType('view-evaluation');
        setShowModal(true);
        break;
      case 'edit':
        setSelectedEvaluation(evaluation);
        setModalType('edit-evaluation');
        setShowModal(true);
        break;
      case 'delete':
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette évaluation ?')) {
          setEvaluations(evaluations.filter(e => e.id !== evalId));
          alert('Évaluation supprimée avec succès!');
        }
        break;
    }
  };

  const saveEvaluation = (evalData) => {
    if (modalType === 'create-evaluation') {
      const newId = Math.max(...evaluations.map(e => e.id)) + 1;
      const newEval = { ...evalData, id: newId };
      setEvaluations([...evaluations, newEval]);
      alert('Évaluation créée avec succès!');
    } else if (modalType === 'edit-evaluation') {
      const updatedEvals = evaluations.map(e => 
        e.id === selectedEvaluation.id ? { ...e, ...evalData } : e
      );
      setEvaluations(updatedEvals);
      alert('Évaluation modifiée avec succès!');
    }
    
    setShowModal(false);
    setSelectedEvaluation(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  const formatCapacity = (current, max) => {
    return `${current}/${max}`;
  };

  if (!user) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingText}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.profile}>
          <div style={styles.avatar}>
            <span style={styles.avatarText}>
              {user.prenom.charAt(0)}{user.nom.charAt(0)}
            </span>
          </div>
          <div style={styles.coachName}>Coach {user.prenom}</div>
        </div>

        <nav style={styles.nav}>
          <div 
            style={{...styles.navItem, ...(activeTab === 'dashboard' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('dashboard')}
          >
            DASHBOARD
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'courses' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('courses')}
          >
            Gestion des cours
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'planning' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('planning')}
          >
            Planning/Calendrier
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'attendance' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('attendance')}
          >
            Listes des présences
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'members' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('members')}
          >
            Mes Adhérents
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'evaluations' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('evaluations')}
          >
            Évaluations
          </div>
        </nav>

        <div style={styles.logoutSection}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>
            {activeTab === 'courses' && 'Gestion des cours'}
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'planning' && 'Planning/Calendrier'}
            {activeTab === 'attendance' && 'Listes des présences'}
            {activeTab === 'members' && 'Mes Adhérents'}
            {activeTab === 'evaluations' && 'Évaluations'}
          </h1>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={styles.content}>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <h3 style={styles.statTitle}>Cours cette semaine</h3>
                <div style={styles.statNumber}>{dashboardStats.coursesThisWeek}</div>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statTitle}>Adhérents actifs</h3>
                <div style={styles.statNumber}>{dashboardStats.activeMembers}</div>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statTitle}>Réservations</h3>
                <div style={styles.statNumber}>{dashboardStats.reservations}</div>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statTitle}>Note moyenne</h3>
                <div style={styles.statNumber}>{dashboardStats.averageRating}/5</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.quickActionsSection}>
              <h2 style={styles.sectionTitle}>Actions Rapides</h2>
              <div style={styles.quickActionsGrid}>
                <button 
                  style={styles.quickActionBtn}
                  onClick={() => setActiveTab('courses')}
                >
                  📚 Gérer les cours
                </button>
                <button 
                  style={styles.quickActionBtn}
                  onClick={() => setActiveTab('attendance')}
                >
                  ✅ Marquer présences
                </button>
                <button 
                  style={styles.quickActionBtn}
                  onClick={() => setActiveTab('members')}
                >
                  👥 Voir adhérents
                </button>
                <button 
                  style={styles.quickActionBtn}
                  onClick={() => {
                    setModalType('create-evaluation');
                    setSelectedEvaluation(null);
                    setShowModal(true);
                  }}
                >
                  ⭐ Nouvelle évaluation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div style={styles.content}>
            <div style={styles.controlsSection}>
              <div style={styles.filters}>
                <select 
                  style={styles.filterSelect}
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="">Type</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Yoga">Yoga</option>
                  <option value="AquaGym">AquaGym</option>
                  <option value="Pilates">Pilates</option>
                  <option value="CrossFit">CrossFit</option>
                </select>

                <select 
                  style={styles.filterSelect}
                  value={filters.statut}
                  onChange={(e) => handleFilterChange('statut', e.target.value)}
                >
                  <option value="">Statut</option>
                  <option value="À venir">À venir</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="Annulé">Annulé</option>
                </select>

                <select 
                  style={styles.filterSelect}
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                >
                  <option value="">Date</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                </select>
              </div>

              <button 
                style={styles.createBtn}
                onClick={handleCreateCourse}
              >
                ⊕ Créer un cours
              </button>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Date & heure</th>
                    <th style={styles.th}>Lieu</th>
                    <th style={styles.th}>Capacité</th>
                    <th style={styles.th}>Statut</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course, index) => (
                    <tr key={course.id} style={{...styles.tableRow, backgroundColor: index % 2 === 0 ? '#c4f000' : '#b8e000'}}>
                      <td style={styles.td}>{course.type}</td>
                      <td style={styles.td}>{formatDate(course.date)} à {course.time}</td>
                      <td style={styles.td}>{course.lieu}</td>
                      <td style={styles.td}>{formatCapacity(course.capacite_actuelle, course.capacite_max)}</td>
                      <td style={styles.td}>{course.statut}</td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button 
                            style={styles.actionBtn}
                            onClick={() => handleAction('view', course.id)}
                          >
                            Voir
                          </button>
                          <button 
                            style={styles.actionBtn}
                            onClick={() => handleAction('edit', course.id)}
                          >
                            Modifier
                          </button>
                          <button 
                            style={{...styles.actionBtn, ...styles.deleteBtn}}
                            onClick={() => handleAction('delete', course.id)}
                          >
                            Supp
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredCourses.length === 0 && (
                <div style={styles.emptyState}>
                  <p>Aucun cours trouvé avec ces filtres</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Planning Tab */}
        {activeTab === 'planning' && (
          <div style={styles.content}>
            <div style={styles.calendarContainer}>
              <div style={styles.calendarHeader}>
                <h3>Semaine du 21 au 27 Avril 2025</h3>
                <div style={styles.calendarControls}>
                  <button style={styles.calendarBtn}>← Semaine précédente</button>
                  <button style={styles.calendarBtn}>Semaine suivante →</button>
                </div>
              </div>
              
              <div style={styles.calendar}>
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, index) => (
                  <div key={day} style={styles.calendarDay}>
                    <div style={styles.dayHeader}>{day}</div>
                    <div style={styles.dayContent}>
                      {courses.filter(course => {
                        const courseDate = new Date(course.date);
                        return courseDate.getDay() === (index + 1) % 7;
                      }).map(course => (
                        <div key={course.id} style={styles.calendarEvent}>
                          <div style={styles.eventTime}>{course.time}</div>
                          <div style={styles.eventType}>{course.type}</div>
                          <div style={styles.eventLocation}>{course.lieu}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div style={styles.content}>
            <div style={styles.attendanceSection}>
              {attendance.map(course => (
                <div key={course.courseId} style={styles.attendanceCard}>
                  <h3 style={styles.attendanceTitle}>{course.courseName}</h3>
                  <div style={styles.attendanceTable}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.tableHeader}>
                          <th style={styles.th}>Nom</th>
                          <th style={styles.th}>Prénom</th>
                          <th style={styles.th}>Présent</th>
                          <th style={styles.th}>Retard</th>
                        </tr>
                      </thead>
                      <tbody>
                        {course.members.map(member => (
                          <tr key={member.id} style={styles.tableRow}>
                            <td style={styles.td}>{member.nom}</td>
                            <td style={styles.td}>{member.prenom}</td>
                            <td style={styles.td}>
                              <input
                                type="checkbox"
                                checked={member.present}
                                onChange={(e) => updateAttendance(course.courseId, member.id, 'present', e.target.checked)}
                                style={styles.checkbox}
                              />
                            </td>
                            <td style={styles.td}>
                              <input
                                type="checkbox"
                                checked={member.retard}
                                onChange={(e) => updateAttendance(course.courseId, member.id, 'retard', e.target.checked)}
                                style={styles.checkbox}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={styles.attendanceActions}>
                    <button 
                      style={styles.saveAttendanceBtn}
                      onClick={() => alert('Présences sauvegardées!')}
                    >
                      Sauvegarder les présences
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div style={styles.content}>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Nom</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Abonnement</th>
                    <th style={styles.th}>Statut</th>
                    <th style={styles.th}>Cours inscrits</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr key={member.id} style={{...styles.tableRow, backgroundColor: index % 2 === 0 ? '#c4f000' : '#b8e000'}}>
                      <td style={styles.td}>{member.prenom} {member.nom}</td>
                      <td style={styles.td}>{member.email}</td>
                      <td style={styles.td}>{member.abonnement}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: member.statut === 'Actif' ? '#28a745' : '#dc3545',
                          color: 'white'
                        }}>
                          {member.statut}
                        </span>
                      </td>
                      <td style={styles.td}>{member.coursInscrits.join(', ')}</td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button 
                            style={styles.actionBtn}
                            onClick={() => handleMemberAction('view', member.id)}
                          >
                            Voir
                          </button>
                          <button 
                            style={styles.actionBtn}
                            onClick={() => handleMemberAction('edit', member.id)}
                          >
                            Modifier
                          </button>
                          <button 
                            style={{
                              ...styles.actionBtn,
                              backgroundColor: member.statut === 'Actif' ? '#ffc107' : '#28a745'
                            }}
                            onClick={() => handleMemberAction('suspend', member.id)}
                          >
                            {member.statut === 'Actif' ? 'Suspendre' : 'Réactiver'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Evaluations Tab */}
        {activeTab === 'evaluations' && (
          <div style={styles.content}>
            <div style={styles.controlsSection}>
              <button 
                style={styles.createBtn}
                onClick={() => {
                  setModalType('create-evaluation');
                  setSelectedEvaluation(null);
                  setShowModal(true);
                }}
              >
                ⊕ Nouvelle évaluation
              </button>
            </div>

            <div style={styles.evaluationsGrid}>
              {evaluations.map(evaluation => (
                <div key={evaluation.id} style={styles.evaluationCard}>
                  <div style={styles.evaluationHeader}>
                    <h3>{evaluation.memberName}</h3>
                    <div style={styles.evaluationRating}>
                      {'★'.repeat(evaluation.note)}{'☆'.repeat(5 - evaluation.note)}
                    </div>
                  </div>
                  <div style={styles.evaluationContent}>
                    <p><strong>Cours:</strong> {evaluation.courseType}</p>
                    <p><strong>Date:</strong> {evaluation.date}</p>
                    <p><strong>Commentaire:</strong> {evaluation.commentaire}</p>
                    <p><strong>Objectifs:</strong> {evaluation.objectifs}</p>
                  </div>
                  <div style={styles.evaluationActions}>
                    <button 
                      style={styles.actionBtn}
                      onClick={() => handleEvaluationAction('view', evaluation.id)}
                    >
                      Voir
                    </button>
                    <button 
                      style={styles.actionBtn}
                      onClick={() => handleEvaluationAction('edit', evaluation.id)}
                    >
                      Modifier
                    </button>
                    <button 
                      style={{...styles.actionBtn, ...styles.deleteBtn}}
                      onClick={() => handleEvaluationAction('delete', evaluation.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          type={modalType}
          course={selectedCourse}
          member={selectedMember}
          evaluation={selectedEvaluation}
          members={members}
          onSave={modalType.includes('course') || modalType === 'create' || modalType === 'edit' || modalType === 'view' ? saveCourse : 
                 modalType.includes('member') ? saveMember :
                 modalType.includes('evaluation') ? saveEvaluation : null}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

// Universal Modal Component
const Modal = ({ type, course, member, evaluation, members, onSave, onClose }) => {
  const [formData, setFormData] = useState(() => {
    if (type.includes('course')) {
      return {
        type: course?.type || '',
        date: course?.date || '',
        time: course?.time || '',
        lieu: course?.lieu || '',
        capacite_max: course?.capacite_max || '',
        description: course?.description || '',
        statut: course?.statut || 'À venir'
      };
    } else if (type.includes('member')) {
      return {
        nom: member?.nom || '',
        prenom: member?.prenom || '',
        email: member?.email || '',
        telephone: member?.telephone || '',
        abonnement: member?.abonnement || 'Basic',
        statut: member?.statut || 'Actif'
      };
    } else if (type.includes('evaluation')) {
      return {
        memberName: evaluation?.memberName || '',
        courseType: evaluation?.courseType || '',
        date: evaluation?.date || new Date().toISOString().split('T')[0],
        note: evaluation?.note || 3,
        commentaire: evaluation?.commentaire || '',
        objectifs: evaluation?.objectifs || ''
      };
    }
    return {};
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    if (onSave) onSave(formData);
  };

  const isViewMode = type.includes('view');
  const isEditMode = type.includes('edit');
  const isCreateMode = type.includes('create');

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2>
            {type === 'create' && 'Créer un nouveau cours'}
            {type === 'edit' && 'Modifier le cours'}
            {type === 'view' && 'Détails du cours'}
            {type === 'view-member' && 'Détails de l\'adhérent'}
            {type === 'edit-member' && 'Modifier l\'adhérent'}
            {type === 'create-evaluation' && 'Nouvelle évaluation'}
            {type === 'edit-evaluation' && 'Modifier l\'évaluation'}
            {type === 'view-evaluation' && 'Détails de l\'évaluation'}
          </h2>
          <button onClick={onClose} style={modalStyles.closeBtn}>×</button>
        </div>

        <div>
          <div style={modalStyles.body}>
            
            {/* Course fields */}
            {type.includes('course') && (
              <>
                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Type de cours:</label>
                  <select
                    style={modalStyles.input}
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    disabled={isViewMode}
                    required
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Yoga">Yoga</option>
                    <option value="AquaGym">AquaGym</option>
                    <option value="Pilates">Pilates</option>
                    <option value="CrossFit">CrossFit</option>
                  </select>
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Date:</label>
                  <input
                    style={modalStyles.input}
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Heure:</label>
                  <input
                    style={modalStyles.input}
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Lieu:</label>
                  <input
                    style={modalStyles.input}
                    type="text"
                    value={formData.lieu}
                    onChange={(e) => handleInputChange('lieu', e.target.value)}
                    disabled={isViewMode}
                    placeholder="Ex: Salle A"
                    required
                  />
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Capacité maximale:</label>
                  <input
                    style={modalStyles.input}
                    type="number"
                    value={formData.capacite_max}
                    onChange={(e) => handleInputChange('capacite_max', e.target.value)}
                    disabled={isViewMode}
                    min="1"
                    max="50"
                    required
                  />
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Description:</label>
                  <textarea
                    style={{...modalStyles.input, height: '80px'}}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={isViewMode}
                    rows="3"
                    placeholder="Description du cours (optionnel)"
                  />
                </div>

                {!isCreateMode && (
                  <div style={modalStyles.field}>
                    <label style={modalStyles.label}>Statut:</label>
                    <select
                      style={modalStyles.input}
                      value={formData.statut}
                      onChange={(e) => handleInputChange('statut', e.target.value)}
                      disabled={isViewMode}
                    >
                      <option value="À venir">À venir</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                      <option value="Annulé">Annulé</option>
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Member fields */}
            {type.includes('member') && (
              <>
                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Nom:</label>
                  <input
                    style={modalStyles.input}
                    type="text"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Prénom:</label>
                  <input
                    style={modalStyles.input}
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Email:</label>
                  <input
                    style={modalStyles.input}
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Téléphone:</label>
                  <input
                    style={modalStyles.input}
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    disabled={isViewMode}
                  />
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Abonnement:</label>
                  <select
                    style={modalStyles.input}
                    value={formData.abonnement}
                    onChange={(e) => handleInputChange('abonnement', e.target.value)}
                    disabled={isViewMode}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Statut:</label>
                  <select
                    style={modalStyles.input}
                    value={formData.statut}
                    onChange={(e) => handleInputChange('statut', e.target.value)}
                    disabled={isViewMode}
                  >
                    <option value="Actif">Actif</option>
                    <option value="Suspendu">Suspendu</option>
                  </select>
                </div>
              </>
            )}

            {/* Evaluation fields */}
            {type.includes('evaluation') && (
              <>
                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Adhérent:</label>
                  {isCreateMode ? (
                    <select
                      style={modalStyles.input}
                      value={formData.memberName}
                      onChange={(e) => handleInputChange('memberName', e.target.value)}
                      required
                    >
                      <option value="">Sélectionner un adhérent</option>
                      {members.map(member => (
                        <option key={member.id} value={`${member.prenom} ${member.nom}`}>
                          {member.prenom} {member.nom}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      style={modalStyles.input}
                      type="text"
                      value={formData.memberName}
                      disabled
                    />
                  )}
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Type de cours:</label>
                  <select
                    style={modalStyles.input}
                    value={formData.courseType}
                    onChange={(e) => handleInputChange('courseType', e.target.value)}
                    disabled={isViewMode}
                    required
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Yoga">Yoga</option>
                    <option value="AquaGym">AquaGym</option>
                    <option value="Pilates">Pilates</option>
                    <option value="CrossFit">CrossFit</option>
                  </select>
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Date:</label>
                  <input
                    style={modalStyles.input}
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Note (1-5):</label>
                  <div style={modalStyles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        style={{
                          ...modalStyles.star,
                          color: star <= formData.note ? '#ffc107' : '#e9ecef',
                          cursor: isViewMode ? 'default' : 'pointer'
                        }}
                        onClick={() => !isViewMode && handleInputChange('note', star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Commentaire:</label>
                  <textarea
                    style={{...modalStyles.input, height: '80px'}}
                    value={formData.commentaire}
                    onChange={(e) => handleInputChange('commentaire', e.target.value)}
                    disabled={isViewMode}
                    placeholder="Commentaire sur la performance..."
                  />
                </div>

                <div style={modalStyles.field}>
                  <label style={modalStyles.label}>Objectifs:</label>
                  <textarea
                    style={{...modalStyles.input, height: '60px'}}
                    value={formData.objectifs}
                    onChange={(e) => handleInputChange('objectifs', e.target.value)}
                    disabled={isViewMode}
                    placeholder="Objectifs pour le prochain cours..."
                  />
                </div>
              </>
            )}
          </div>

          <div style={modalStyles.footer}>
            {!isViewMode && (
              <button 
                style={modalStyles.saveBtn}
                onClick={handleSubmit}
              >
                {isCreateMode ? 'Créer' : 'Modifier'}
              </button>
            )}
            <button onClick={onClose} style={modalStyles.cancelBtn}>
              {isViewMode ? 'Fermer' : 'Annuler'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles (keeping existing ones and adding new ones)
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f5f5',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '1.2rem',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    color: '#2c2c2c',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#2c2c2c',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '3px solid #c4f000',
  },
  profile: {
    padding: '2rem 1rem',
    textAlign: 'center',
    borderBottom: '1px solid #444',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'white',
    margin: '0 auto 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#2c2c2c',
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  coachName: {
    color: '#c4f000',
    fontSize: '0.9rem',
    textTransform: 'lowercase',
  },
  nav: {
    flex: 1,
    padding: '1rem 0',
  },
  navItem: {
    padding: '1rem 1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderLeft: '4px solid transparent',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  navItemActive: {
    backgroundColor: '#c4f000',
    color: '#2c2c2c',
    borderLeft: '4px solid #2c2c2c',
    fontWeight: 'bold',
  },
  logoutSection: {
    padding: '1rem',
    borderTop: '1px solid #444',
  },
  logoutBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: '1.5rem 2rem',
    borderBottom: '1px solid #e9ecef',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  pageTitle: {
    margin: 0,
    color: '#2c2c2c',
    fontSize: '1.8rem',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: '2rem',
  },
  controlsSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  filterSelect: {
    padding: '0.75rem 1rem',
    border: '2px solid #c4f000',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '500',
    backgroundColor: '#c4f000',
    color: '#2c2c2c',
    cursor: 'pointer',
    minWidth: '120px',
  },
  createBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'white',
    border: '2px solid #2c2c2c',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    color: '#2c2c2c',
    transition: 'all 0.3s ease',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#2c2c2c',
    color: 'white',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid #2c2c2c',
  },
  td: {
    padding: '1rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#2c2c2c',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '0.5rem 0.75rem',
    backgroundColor: '#2c2c2c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  statTitle: {
    margin: '0 0 1rem 0',
    color: '#6c757d',
    fontSize: '1rem',
    fontWeight: '500',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2c2c2c',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textAlign: 'center',
    display: 'inline-block',
    minWidth: '80px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6c757d',
  },
  // Quick Actions styles
  quickActionsSection: {
    marginTop: '2rem',
  },
  sectionTitle: {
    color: '#2c2c2c',
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  quickActionBtn: {
    padding: '1rem 1.5rem',
    backgroundColor: '#c4f000',
    color: '#2c2c2c',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  // Calendar styles
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  calendarControls: {
    display: 'flex',
    gap: '1rem',
  },
  calendarBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#c4f000',
    color: '#2c2c2c',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  calendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1rem',
  },
  calendarDay: {
    border: '1px solid #e9ecef',
    borderRadius: '4px',
    minHeight: '150px',
  },
  dayHeader: {
    backgroundColor: '#2c2c2c',
    color: 'white',
    padding: '0.5rem',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  dayContent: {
    padding: '0.5rem',
  },
  calendarEvent: {
    backgroundColor: '#c4f000',
    padding: '0.25rem 0.5rem',
    marginBottom: '0.25rem',
    borderRadius: '3px',
    fontSize: '0.8rem',
  },
  eventTime: {
    fontWeight: 'bold',
  },
  eventType: {
    fontSize: '0.75rem',
  },
  eventLocation: {
    fontSize: '0.7rem',
    color: '#666',
  },
  // Attendance styles
  attendanceSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  attendanceCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  attendanceTitle: {
    margin: '0 0 1rem 0',
    color: '#2c2c2c',
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  attendanceTable: {
    marginBottom: '1rem',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  attendanceActions: {
    textAlign: 'right',
  },
  saveAttendanceBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  // Evaluations styles
  evaluationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  evaluationCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  evaluationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  evaluationRating: {
    fontSize: '1.2rem',
    color: '#ffc107',
  },
  evaluationContent: {
    marginBottom: '1rem',
    lineHeight: '1.6',
  },
  evaluationActions: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end',
  },
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e9ecef',
  },
  body: {
    padding: '1.5rem',
  },
  field: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#2c2c2c',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
    boxSizing: 'border-box',
  },
  footer: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #e9ecef',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  saveBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#c4f000',
    color: '#2c2c2c',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6c757d',
  },
  ratingContainer: {
    display: 'flex',
    gap: '2px',
  },
  star: {
    fontSize: '1.5rem',
    transition: 'color 0.2s ease',
  },
};

export default CoachDashboard;