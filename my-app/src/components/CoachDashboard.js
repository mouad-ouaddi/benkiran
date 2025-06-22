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

  // Chart data
  const [chartData] = useState({
    monthlyStats: [
      { month: 'Jan', courses: 45, members: 89, satisfaction: 4.2 },
      { month: 'Fév', courses: 52, members: 95, satisfaction: 4.4 },
      { month: 'Mar', courses: 48, members: 102, satisfaction: 4.6 },
      { month: 'Avr', courses: 55, members: 108, satisfaction: 4.8 },
      { month: 'Mai', courses: 60, members: 115, satisfaction: 4.7 },
      { month: 'Jun', courses: 58, members: 120, satisfaction: 4.9 }
    ],
    courseTypes: [
      { name: 'Cardio', count: 25, color: '#00d4aa' },
      { name: 'Yoga', count: 20, color: '#5b9bd5' },
      { name: 'Musculation', count: 18, color: '#ffa726' },
      { name: 'Pilates', count: 15, color: '#ef5350' },
      { name: 'CrossFit', count: 12, color: '#ab47bc' }
    ]
  });

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "#00d4aa" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#2a2a2a"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{percentage}%</div>
        </div>
      </div>
    );
  };

  const SimpleLineChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.courses));
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.courses / maxValue) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div style={{ width: '100%', height: '300px', position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          <polyline
            points={points}
            fill="none"
            stroke="#00d4aa"
            strokeWidth="0.5"
            style={{ vectorEffect: 'non-scaling-stroke' }}
          />
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - (d.courses / maxValue) * 80;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1"
                fill="#00d4aa"
                style={{ vectorEffect: 'non-scaling-stroke' }}
              />
            );
          })}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.8rem', color: '#ccc' }}>
          {data.map(d => <span key={d.month}>{d.month}</span>)}
        </div>
      </div>
    );
  };

  const SimplePieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let currentAngle = 0;
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
          <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
            {data.map((item, index) => {
              const percentage = (item.count / total) * 100;
              const angle = (percentage / 100) * 360;
              const radius = 80;
              const x1 = 100 + radius * Math.cos((currentAngle * Math.PI) / 180);
              const y1 = 100 + radius * Math.sin((currentAngle * Math.PI) / 180);
              const x2 = 100 + radius * Math.cos(((currentAngle + angle) * Math.PI) / 180);
              const y2 = 100 + radius * Math.sin(((currentAngle + angle) * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              const pathData = `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              
              currentAngle += angle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  stroke="#1a1a1a"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {data.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '2px' }} />
              <span style={{ fontSize: '0.9rem' }}>{item.name}: {item.count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
        setModalType('view-course');
        setShowModal(true);
        break;
        
      case 'edit':
        setSelectedCourse(course);
        setModalType('edit-course');
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
    setModalType('create-course');
    setShowModal(true);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const saveCourse = (courseData) => {
    if (modalType === 'create-course') {
      const newId = Math.max(...courses.map(c => c.id)) + 1;
      const newCourse = {
        ...courseData,
        id: newId,
        capacite_actuelle: 0
      };
      setCourses([...courses, newCourse]);
      alert('Cours créé avec succès!');
    } else if (modalType === 'edit-course') {
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
          <div style={styles.userName}>Coach {user.prenom}</div>
          <div style={styles.userSpecialty}>{user.specialite}</div>
        </div>

        <nav style={styles.nav}>
          <div 
            style={{...styles.navItem, ...(activeTab === 'dashboard' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'courses' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('courses')}
          >
            📚 Gestion des cours
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'planning' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('planning')}
          >
            📅 Planning/Calendrier
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'attendance' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('attendance')}
          >
            ✅ Listes des présences
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'members' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('members')}
          >
            👥 Mes Adhérents
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'evaluations' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('evaluations')}
          >
            ⭐ Évaluations
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
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard Coach</h1>
            <p style={styles.pageSubtitle}>Gérez vos cours et suivez vos performances</p>
          </div>
          <button style={styles.downloadBtn}>
            📄 Télécharger Rapport
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={styles.content}>
            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>📚</div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{dashboardStats.coursesThisWeek}</div>
                  <div style={styles.statLabel}>Cours cette semaine</div>
                  <div style={styles.statChange}>+8% vs semaine dernière</div>
                </div>
                <CircularProgress percentage={75} color="#00d4aa" />
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>👥</div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{dashboardStats.activeMembers}</div>
                  <div style={styles.statLabel}>Adhérents actifs</div>
                  <div style={styles.statChange}>+3 nouveaux ce mois</div>
                </div>
                <CircularProgress percentage={88} color="#5b9bd5" />
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>📋</div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{dashboardStats.reservations}</div>
                  <div style={styles.statLabel}>Réservations</div>
                  <div style={styles.statChange}>+12% ce mois</div>
                </div>
                <CircularProgress percentage={92} color="#ffa726" />
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>⭐</div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{dashboardStats.averageRating}</div>
                  <div style={styles.statLabel}>Note moyenne</div>
                  <div style={styles.statChange}>Excellent niveau</div>
                </div>
                <CircularProgress percentage={96} color="#ef5350" />
              </div>
            </div>

            {/* Charts Section */}
            <div style={styles.chartsGrid}>
              {/* Performance Chart */}
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Évolution Mensuelle</h3>
                <SimpleLineChart data={chartData.monthlyStats} title="Cours par mois" />
              </div>

              {/* Course Types Distribution */}
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Répartition des Cours</h3>
                <SimplePieChart data={chartData.courseTypes} />
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
                    <tr key={course.id} style={{...styles.tableRow, backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#1a1a1a'}}>
                      <td style={styles.td}>{course.type}</td>
                      <td style={styles.td}>{formatDate(course.date)} à {course.time}</td>
                      <td style={styles.td}>{course.lieu}</td>
                      <td style={styles.td}>{formatCapacity(course.capacite_actuelle, course.capacite_max)}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: course.statut === 'À venir' ? '#00d4aa' : 
                                         course.statut === 'En cours' ? '#ffa726' : 
                                         course.statut === 'Terminé' ? '#5b9bd5' : '#ef5350'
                        }}>
                          {course.statut}
                        </span>
                      </td>
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
                            style={{...styles.actionBtn, backgroundColor: '#ef5350'}}
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
            <div style={styles.planningContainer}>
              <h2 style={styles.sectionTitle}>Planning de la Semaine</h2>
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
                        {course.members.map((member, index) => (
                          <tr key={member.id} style={{...styles.tableRow, backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#1a1a1a'}}>
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
                    <tr key={member.id} style={{...styles.tableRow, backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#1a1a1a'}}>
                      <td style={styles.td}>{member.prenom} {member.nom}</td>
                      <td style={styles.td}>{member.email}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: member.abonnement === 'VIP' ? '#ab47bc' : 
                                         member.abonnement === 'Premium' ? '#ffa726' : '#5b9bd5'
                        }}>
                          {member.abonnement}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: member.statut === 'Actif' ? '#00d4aa' : '#ef5350'
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
                              backgroundColor: member.statut === 'Actif' ? '#ffa726' : '#00d4aa'
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
                      style={{...styles.actionBtn, backgroundColor: '#ef5350'}}
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
          onSave={modalType.includes('course') ? saveCourse : 
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
            {type === 'create-course' && 'Créer un nouveau cours'}
            {type === 'edit-course' && 'Modifier le cours'}
            {type === 'view-course' && 'Détails du cours'}
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
                          color: star <= formData.note ? '#ffa726' : '#444',
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

// Modern Dark Theme Styles
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '1.2rem',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
  },
  loadingText: {
    color: '#ffffff',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#2a2a2a',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #444',
  },
  profile: {
    padding: '2rem 1rem',
    textAlign: 'center',
    borderBottom: '1px solid #444',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    margin: '0 auto 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  userName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  userSpecialty: {
    color: '#00d4aa',
    fontSize: '0.9rem',
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    borderRadius: '12px',
    display: 'inline-block',
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
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  navItemActive: {
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    color: '#00d4aa',
    borderLeft: '4px solid #00d4aa',
    fontWeight: 'bold',
  },
  logoutSection: {
    padding: '1rem',
    borderTop: '1px solid #444',
  },
  logoutBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#ef5350',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1a1a1a',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem 3rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
  },
  pageTitle: {
    margin: 0,
    fontSize: '2.5rem',
    fontWeight: '700',
  },
  pageSubtitle: {
    margin: '0.5rem 0 0 0',
    fontSize: '1.1rem',
    opacity: 0.9,
  },
  downloadBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  content: {
    flex: 1,
    padding: '2rem 3rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: '#2a2a2a',
    padding: '2rem',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    border: '1px solid #444',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  statIcon: {
    fontSize: '2.5rem',
    minWidth: '60px',
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  statLabel: {
    color: '#ccc',
    fontSize: '1rem',
    marginBottom: '0.25rem',
  },
  statChange: {
    color: '#00d4aa',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
    marginBottom: '3rem',
  },
  chartCard: {
    backgroundColor: '#2a2a2a',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid #444',
  },
  chartTitle: {
    color: '#fff',
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
  },
  quickActionsSection: {
    marginTop: '2rem',
  },
  sectionTitle: {
    color: '#fff',
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
    background: 'linear-gradient(135deg, #00d4aa 0%, #00b895 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 212, 170, 0.3)',
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
    backgroundColor: '#2a2a2a',
    border: '1px solid #444',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#fff',
    cursor: 'pointer',
    minWidth: '120px',
  },
  createBtn: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #00d4aa 0%, #00b895 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 212, 170, 0.3)',
  },
  tableContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #444',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#1a1a1a',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#00d4aa',
  },
  tableRow: {
    borderBottom: '1px solid #444',
  },
  td: {
    padding: '1rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#fff',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '0.5rem 0.75rem',
    backgroundColor: '#00d4aa',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textAlign: 'center',
    display: 'inline-block',
    minWidth: '80px',
    color: 'white',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#ccc',
  },
  planningContainer: {
    backgroundColor: '#2a2a2a',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid #444',
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
    backgroundColor: '#00d4aa',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  calendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1rem',
  },
  calendarDay: {
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #444',
  },
  dayHeader: {
    backgroundColor: '#00d4aa',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dayContent: {
    padding: '1rem',
    minHeight: '200px',
  },
  calendarEvent: {
    backgroundColor: '#2a2a2a',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #444',
    marginBottom: '0.5rem',
  },
  eventTime: {
    color: '#00d4aa',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  eventType: {
    fontWeight: 'bold',
    margin: '0.25rem 0',
  },
  eventLocation: {
    color: '#ccc',
    fontSize: '0.8rem',
  },
  attendanceSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  attendanceCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid #444',
  },
  attendanceTitle: {
    margin: '0 0 1.5rem 0',
    color: '#fff',
    fontSize: '1.3rem',
    fontWeight: '600',
  },
  attendanceTable: {
    marginBottom: '1.5rem',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#00d4aa',
  },
  attendanceActions: {
    textAlign: 'right',
  },
  saveAttendanceBtn: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #00d4aa 0%, #00b895 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    boxShadow: '0 4px 15px rgba(0, 212, 170, 0.3)',
  },
  evaluationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },
  evaluationCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid #444',
  },
  evaluationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  evaluationRating: {
    fontSize: '1.2rem',
    color: '#ffa726',
  },
  evaluationContent: {
    marginBottom: '1.5rem',
    lineHeight: '1.6',
    color: '#ccc',
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#2a2a2a',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid #444',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem',
    borderBottom: '1px solid #444',
  },
  body: {
    padding: '2rem',
  },
  field: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#fff',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #444',
    borderRadius: '8px',
    fontSize: '0.9rem',
    boxSizing: 'border-box',
    color: '#fff',
  },
  footer: {
    padding: '1.5rem 2rem',
    borderTop: '1px solid #444',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  saveBtn: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #00d4aa 0%, #00b895 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#ccc',
  },
  ratingContainer: {
    display: 'flex',
    gap: '4px',
  },
  star: {
    fontSize: '1.5rem',
    transition: 'color 0.2s ease',
  },
};

export default CoachDashboard;