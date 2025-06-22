import React, { useEffect, useState } from 'react';

const AdherentDashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // State for reservations
  const [reservations, setReservations] = useState([
    { id: 1, type: 'Yoga', date: '15/04', time: '18h30', coach: 'Claire Martin', statut: 'Confirmé' },
    { id: 2, type: 'Cardio', date: '17/04', time: '10h00', coach: 'Marc Dubois', statut: 'Confirmé' },
    { id: 3, type: 'Pilates', date: '20/04', time: '19h00', coach: 'Sophie Laurent', statut: 'En attente' }
  ]);

  // State for available courses
  const [availableCourses, setAvailableCourses] = useState([
    { id: 1, type: 'Yoga', date: '22/04', time: '18h30', coach: 'Claire Martin', places: 15, capacity: 20 },
    { id: 2, type: 'Cardio', date: '23/04', time: '10h00', coach: 'Marc Dubois', places: 8, capacity: 15 },
    { id: 3, type: 'Pilates', date: '24/04', time: '19h00', coach: 'Sophie Laurent', places: 12, capacity: 15 },
    { id: 4, type: 'CrossFit', date: '25/04', time: '07h00', coach: 'Thomas Bernard', places: 5, capacity: 12 },
    { id: 5, type: 'AquaGym', date: '26/04', time: '09h00', coach: 'Marie Leroy', places: 3, capacity: 10 }
  ]);

  // State for planning
  const [personalPlanning, setPersonalPlanning] = useState([
    { id: 1, day: 'Lundi', courses: [{ time: '18h30', type: 'Yoga', coach: 'Claire' }] },
    { id: 2, day: 'Mercredi', courses: [{ time: '10h00', type: 'Cardio', coach: 'Marc' }] },
    { id: 3, day: 'Vendredi', courses: [{ time: '19h00', type: 'Pilates', coach: 'Sophie' }] },
    { id: 4, day: 'Samedi', courses: [] },
    { id: 5, day: 'Dimanche', courses: [] }
  ]);

  // State for history
  const [history, setHistory] = useState([
    { id: 1, type: 'Yoga', date: '10/04', time: '18h30', coach: 'Claire Martin', statut: 'Complété', note: 5 },
    { id: 2, type: 'Cardio', date: '08/04', time: '10h00', coach: 'Marc Dubois', statut: 'Complété', note: 4 },
    { id: 3, type: 'Pilates', date: '05/04', time: '19h00', coach: 'Sophie Laurent', statut: 'Annulé', note: null },
    { id: 4, type: 'Yoga', date: '03/04', time: '18h30', coach: 'Claire Martin', statut: 'Complété', note: 5 }
  ]);

  // Form states
  const [bookingForm, setBookingForm] = useState({
    courseType: '',
    date: '',
    time: '',
    coach: ''
  });

  const [contactForm, setContactForm] = useState({
    coach: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Mock user data for demo
      const mockUser = {
        prenom: "Youssef",
        nom: "Benali",
        email: "youssef.benali@example.com",
        abonnement: "Premium",
        dateExpiration: "15/12/2025"
      };
      setUser(mockUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
  };

  // Quick Actions Functions
  const handleQuickAction = (action) => {
    switch (action) {
      case 'reserve':
        setActiveTab('reservation');
        break;
      case 'planning':
        setActiveTab('planning');
        break;
      case 'contact':
        setModalType('contact');
        setShowModal(true);
        break;
      case 'abonnement':
        setActiveTab('abonnement');
        break;
    }
  };

  // Reservation Functions
  const handleReservationAction = (action, reservationId) => {
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (action === 'modify') {
      setSelectedCourse(reservation);
      setModalType('modify-reservation');
      setShowModal(true);
    } else if (action === 'cancel') {
      if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
        setReservations(reservations.filter(r => r.id !== reservationId));
        alert('Réservation annulée avec succès!');
      }
    }
  };

  // Course Booking Functions
  const handleBookCourse = (course) => {
    setSelectedCourse(course);
    setModalType('book-course');
    setShowModal(true);
  };

  const confirmBooking = () => {
    if (selectedCourse) {
      const newReservation = {
        id: reservations.length + 1,
        type: selectedCourse.type,
        date: selectedCourse.date,
        time: selectedCourse.time,
        coach: selectedCourse.coach,
        statut: 'Confirmé'
      };
      
      setReservations([...reservations, newReservation]);
      
      // Update available places
      setAvailableCourses(availableCourses.map(course => 
        course.id === selectedCourse.id 
          ? { ...course, places: course.places - 1 }
          : course
      ));
      
      setShowModal(false);
      alert('Cours réservé avec succès!');
    }
  };

  // Contact Coach Function
  const handleContactSubmit = () => {
    if (contactForm.coach && contactForm.subject && contactForm.message) {
      alert(`Message envoyé à ${contactForm.coach} avec succès!`);
      setContactForm({ coach: '', subject: '', message: '' });
      setShowModal(false);
    } else {
      alert('Veuillez remplir tous les champs');
    }
  };

  // Abonnement Functions
  const handleSubscriptionAction = (action) => {
    if (action === 'modify') {
      setModalType('modify-subscription');
      setShowModal(true);
    } else if (action === 'cancel') {
      if (window.confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) {
        alert('Abonnement annulé. Vous recevrez un email de confirmation.');
      }
    }
  };

  // Rating Function
  const handleRating = (historyId, rating) => {
    setHistory(history.map(item => 
      item.id === historyId 
        ? { ...item, note: rating }
        : item
    ));
    alert(`Note ${rating}/5 enregistrée!`);
  };

  // Circular Progress Component
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
          <div style={styles.userName}>{user.prenom} {user.nom}</div>
          <div style={styles.userStatus}>{user.abonnement}</div>
        </div>

        <nav style={styles.nav}>
          <div 
            style={{...styles.navItem, ...(activeTab === 'dashboard' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'abonnement' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('abonnement')}
          >
            💳 Mon Abonnement
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'reservation' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('reservation')}
          >
            📅 Réservation de cours
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'mes-reservations' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('mes-reservations')}
          >
            📋 Mes réservations
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'planning' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('planning')}
          >
            🗓️ Planning Personnel
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'historique' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('historique')}
          >
            📚 Historique
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
            <h1 style={styles.pageTitle}>Mon Espace Fitness</h1>
            <p style={styles.pageSubtitle}>Gérez vos cours et suivez vos progrès</p>
          </div>
          <button style={styles.downloadBtn}>
            📄 Mon Rapport
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={styles.content}>
            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>💳</div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{user.abonnement}</div>
                  <div style={styles.statLabel}>Mon Abonnement</div>
                  <div style={styles.statChange}>Actif jusqu'au {user.dateExpiration}</div>
                </div>
                <CircularProgress percentage={85} color="#00d4aa" />
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>📅</div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{reservations.length}</div>
                  <div style={styles.statLabel}>Mes Réservations</div>
                  <div style={styles.statChange}>Cours cette semaine</div>
                </div>
                <CircularProgress percentage={75} color="#5b9bd5" />
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>✅</div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{history.filter(h => h.statut === 'Complété').length}</div>
                  <div style={styles.statLabel}>Séances Complétées</div>
                  <div style={styles.statChange}>Ce mois-ci</div>
                </div>
                <CircularProgress percentage={92} color="#ffa726" />
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>⏱️</div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>15h</div>
                  <div style={styles.statLabel}>Temps d'Entraînement</div>
                  <div style={styles.statChange}>Cette semaine</div>
                </div>
                <CircularProgress percentage={68} color="#ef5350" />
              </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.quickActionsSection}>
              <h2 style={styles.sectionTitle}>Actions Rapides</h2>
              <div style={styles.quickActionsGrid}>
                <button 
                  style={styles.quickActionBtn}
                  onClick={() => handleQuickAction('reserve')}
                >
                  📅 Réserver un cours
                </button>
                <button 
                  style={styles.quickActionBtn}
                  onClick={() => handleQuickAction('planning')}
                >
                  📋 Voir le planning
                </button>
                <button 
                  style={styles.quickActionBtn}
                  onClick={() => handleQuickAction('contact')}
                >
                  💬 Contacter un coach
                </button>
                <button 
                  style={styles.quickActionBtn}
                  onClick={() => handleQuickAction('abonnement')}
                >
                  ⚙️ Mon abonnement
                </button>
              </div>
            </div>

            {/* Recent Reservations */}
            <div style={styles.recentSection}>
              <h2 style={styles.sectionTitle}>Mes Prochains Cours</h2>
              <div style={styles.recentGrid}>
                {reservations.slice(0, 3).map(reservation => (
                  <div key={reservation.id} style={styles.recentCard}>
                    <div style={styles.recentHeader}>
                      <h3>{reservation.type}</h3>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: reservation.statut === 'Confirmé' ? '#00d4aa' : '#ffa726'
                      }}>
                        {reservation.statut}
                      </span>
                    </div>
                    <div style={styles.recentContent}>
                      <p>📅 {reservation.date} à {reservation.time}</p>
                      <p>👨‍🏫 {reservation.coach}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Abonnement Tab */}
        {activeTab === 'abonnement' && (
          <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Mon Abonnement</h2>
            
            <div style={styles.cardGrid}>
              <div style={styles.infoCard}>
                <h3 style={styles.cardTitle}>Détails de l'abonnement actuel</h3>
                <div style={styles.cardContent}>
                  <p><strong>Type:</strong> {user.abonnement}</p>
                  <p><strong>Accès aux cours collectifs:</strong> ✅</p>
                  <p><strong>Yoga:</strong> ✅</p>
                  <p><strong>Expire le:</strong> {user.dateExpiration}</p>
                </div>
              </div>
              
              <div style={styles.infoCard}>
                <h3 style={styles.cardTitle}>Historique des paiements</h3>
                <div style={styles.cardContent}>
                  <p>15/03/2025 - 59.99€ - Premium</p>
                  <p>15/02/2025 - 59.99€ - Premium</p>
                  <p>15/01/2025 - 59.99€ - Premium</p>
                </div>
              </div>
              
              <div style={styles.infoCard}>
                <h3 style={styles.cardTitle}>Les plans disponibles</h3>
                <div style={styles.cardContent}>
                  <p><strong>Basic:</strong> 29.99€/mois</p>
                  <p><strong>Premium:</strong> 59.99€/mois</p>
                  <p><strong>VIP:</strong> 89.99€/mois</p>
                </div>
              </div>
            </div>

            <div style={styles.actionSection}>
              <button 
                style={styles.modifyBtn}
                onClick={() => handleSubscriptionAction('modify')}
              >
                Modifier l'abonnement
              </button>
              <button 
                style={styles.cancelBtn}
                onClick={() => handleSubscriptionAction('cancel')}
              >
                Annuler l'abonnement
              </button>
            </div>
          </div>
        )}

        {/* Reservation Tab */}
        {activeTab === 'reservation' && (
          <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Réservation de cours</h2>
            
            <div style={styles.courseGrid}>
              {availableCourses.map(course => (
                <div key={course.id} style={styles.courseCard}>
                  <div style={styles.courseHeader}>
                    <h3 style={styles.courseType}>{course.type}</h3>
                    <div style={styles.coursePlaces}>
                      {course.places}/{course.capacity} places
                    </div>
                  </div>
                  <div style={styles.courseDetails}>
                    <p><strong>📅 Date:</strong> {course.date}</p>
                    <p><strong>⏰ Heure:</strong> {course.time}</p>
                    <p><strong>👨‍🏫 Coach:</strong> {course.coach}</p>
                  </div>
                  <button 
                    style={{
                      ...styles.bookBtn,
                      ...(course.places === 0 ? styles.bookBtnDisabled : {})
                    }}
                    onClick={() => handleBookCourse(course)}
                    disabled={course.places === 0}
                  >
                    {course.places === 0 ? 'Complet' : 'Réserver'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mes Réservations Tab */}
        {activeTab === 'mes-reservations' && (
          <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Mes Réservations</h2>
            
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Type de cours</th>
                    <th style={styles.th}>Date & heure</th>
                    <th style={styles.th}>Coach</th>
                    <th style={styles.th}>Statut</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation, index) => (
                    <tr key={reservation.id} style={{...styles.tableRow, backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#1a1a1a'}}>
                      <td style={styles.td}>{reservation.type}</td>
                      <td style={styles.td}>{reservation.date} à {reservation.time}</td>
                      <td style={styles.td}>{reservation.coach}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: reservation.statut === 'Confirmé' ? '#00d4aa' : '#ffa726'
                        }}>
                          {reservation.statut}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button 
                            style={styles.actionBtn}
                            onClick={() => handleReservationAction('modify', reservation.id)}
                          >
                            Modifier
                          </button>
                          <button 
                            style={{...styles.actionBtn, backgroundColor: '#ef5350'}}
                            onClick={() => handleReservationAction('cancel', reservation.id)}
                          >
                            Annuler
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

        {/* Planning Tab */}
        {activeTab === 'planning' && (
          <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Planning Personnel</h2>
            
            <div style={styles.planningGrid}>
              {personalPlanning.map(day => (
                <div key={day.id} style={styles.dayCard}>
                  <h3 style={styles.dayTitle}>{day.day}</h3>
                  <div style={styles.dayContent}>
                    {day.courses.length > 0 ? (
                      day.courses.map((course, index) => (
                        <div key={index} style={styles.plannedCourse}>
                          <div style={styles.courseTime}>{course.time}</div>
                          <div style={styles.courseInfo}>
                            <div>{course.type}</div>
                            <div style={styles.coachInfo}>Coach {course.coach}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={styles.noCourse}>Aucun cours prévu</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historique Tab */}
        {activeTab === 'historique' && (
          <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Historique</h2>
            
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Type de cours</th>
                    <th style={styles.th}>Date & heure</th>
                    <th style={styles.th}>Coach</th>
                    <th style={styles.th}>Statut</th>
                    <th style={styles.th}>Note</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={item.id} style={{...styles.tableRow, backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#1a1a1a'}}>
                      <td style={styles.td}>{item.type}</td>
                      <td style={styles.td}>{item.date} à {item.time}</td>
                      <td style={styles.td}>{item.coach}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: item.statut === 'Complété' ? '#00d4aa' : '#ef5350'
                        }}>
                          {item.statut}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {item.statut === 'Complété' && (
                          <div style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <span
                                key={star}
                                style={{
                                  ...styles.star,
                                  color: star <= (item.note || 0) ? '#ffa726' : '#444',
                                  cursor: 'pointer'
                                }}
                                onClick={() => handleRating(item.id, star)}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={styles.td}>
                        {item.statut === 'Complété' && (
                          <button 
                            style={styles.actionBtn}
                            onClick={() => alert('Fonctionnalité de re-réservation bientôt disponible!')}
                          >
                            Re-réserver
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <div style={modalStyles.overlay} onClick={() => setShowModal(false)}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            
            {/* Book Course Modal */}
            {modalType === 'book-course' && selectedCourse && (
              <>
                <div style={modalStyles.header}>
                  <h2>Confirmer la réservation</h2>
                  <button onClick={() => setShowModal(false)} style={modalStyles.closeBtn}>×</button>
                </div>
                <div style={modalStyles.body}>
                  <p><strong>Cours:</strong> {selectedCourse.type}</p>
                  <p><strong>Date:</strong> {selectedCourse.date}</p>
                  <p><strong>Heure:</strong> {selectedCourse.time}</p>
                  <p><strong>Coach:</strong> {selectedCourse.coach}</p>
                  <p><strong>Places restantes:</strong> {selectedCourse.places}</p>
                </div>
                <div style={modalStyles.footer}>
                  <button onClick={confirmBooking} style={modalStyles.confirmBtn}>
                    Confirmer
                  </button>
                  <button onClick={() => setShowModal(false)} style={modalStyles.cancelBtn}>
                    Annuler
                  </button>
                </div>
              </>
            )}

            {/* Contact Coach Modal */}
            {modalType === 'contact' && (
              <>
                <div style={modalStyles.header}>
                  <h2>Contacter un coach</h2>
                  <button onClick={() => setShowModal(false)} style={modalStyles.closeBtn}>×</button>
                </div>
                <div style={modalStyles.body}>
                  <div style={modalStyles.field}>
                    <label style={modalStyles.label}>Coach:</label>
                    <select
                      value={contactForm.coach}
                      onChange={(e) => setContactForm({...contactForm, coach: e.target.value})}
                      style={modalStyles.input}
                    >
                      <option value="">Sélectionner un coach</option>
                      <option value="Claire Martin">Claire Martin</option>
                      <option value="Marc Dubois">Marc Dubois</option>
                      <option value="Sophie Laurent">Sophie Laurent</option>
                      <option value="Thomas Bernard">Thomas Bernard</option>
                    </select>
                  </div>
                  <div style={modalStyles.field}>
                    <label style={modalStyles.label}>Sujet:</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      style={modalStyles.input}
                      placeholder="Sujet de votre message"
                    />
                  </div>
                  <div style={modalStyles.field}>
                    <label style={modalStyles.label}>Message:</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      style={{...modalStyles.input, height: '100px'}}
                      placeholder="Votre message..."
                    />
                  </div>
                </div>
                <div style={modalStyles.footer}>
                  <button onClick={handleContactSubmit} style={modalStyles.confirmBtn}>
                    Envoyer
                  </button>
                  <button onClick={() => setShowModal(false)} style={modalStyles.cancelBtn}>
                    Annuler
                  </button>
                </div>
              </>
            )}

            {/* Modify Subscription Modal */}
            {modalType === 'modify-subscription' && (
              <>
                <div style={modalStyles.header}>
                  <h2>Modifier l'abonnement</h2>
                  <button onClick={() => setShowModal(false)} style={modalStyles.closeBtn}>×</button>
                </div>
                <div style={modalStyles.body}>
                  <div style={modalStyles.subscriptionOptions}>
                    <div style={modalStyles.subscriptionOption}>
                      <h4>Basic - 29.99€/mois</h4>
                      <p>Accès aux cours de base</p>
                      <button style={modalStyles.selectBtn}>Sélectionner</button>
                    </div>
                    <div style={modalStyles.subscriptionOption}>
                      <h4>Premium - 59.99€/mois (Actuel)</h4>
                      <p>Accès à tous les cours + piscine</p>
                      <button style={modalStyles.currentBtn}>Actuel</button>
                    </div>
                    <div style={modalStyles.subscriptionOption}>
                      <h4>VIP - 89.99€/mois</h4>
                      <p>Accès illimité + coach personnel</p>
                      <button style={modalStyles.selectBtn}>Sélectionner</button>
                    </div>
                  </div>
                </div>
                <div style={modalStyles.footer}>
                  <button onClick={() => setShowModal(false)} style={modalStyles.cancelBtn}>
                    Fermer
                  </button>
                </div>
              </>
            )}

            {/* Modify Reservation Modal */}
            {modalType === 'modify-reservation' && selectedCourse && (
              <>
                <div style={modalStyles.header}>
                  <h2>Modifier la réservation</h2>
                  <button onClick={() => setShowModal(false)} style={modalStyles.closeBtn}>×</button>
                </div>
                <div style={modalStyles.body}>
                  <div style={modalStyles.field}>
                    <label style={modalStyles.label}>Cours actuel:</label>
                    <div style={modalStyles.currentReservation}>
                      <p><strong>{selectedCourse.type}</strong></p>
                      <p>{selectedCourse.date} à {selectedCourse.time}</p>
                      <p>Coach: {selectedCourse.coach}</p>
                    </div>
                  </div>
                  
                  <div style={modalStyles.field}>
                    <label style={modalStyles.label}>Nouveau créneau disponible:</label>
                    <select style={modalStyles.input}>
                      <option value="">Sélectionner un nouveau créneau</option>
                      <option value="yoga-23-04">Yoga - 23/04 à 18h30 - Claire Martin</option>
                      <option value="cardio-24-04">Cardio - 24/04 à 10h00 - Marc Dubois</option>
                      <option value="pilates-25-04">Pilates - 25/04 à 19h00 - Sophie Laurent</option>
                    </select>
                  </div>
                  
                  <div style={modalStyles.field}>
                    <label style={modalStyles.label}>Raison du changement (optionnel):</label>
                    <textarea
                      style={{...modalStyles.input, height: '80px'}}
                      placeholder="Pourquoi souhaitez-vous modifier cette réservation ?"
                    />
                  </div>
                </div>
                <div style={modalStyles.footer}>
                  <button 
                    onClick={() => {
                      alert('Réservation modifiée avec succès!');
                      setShowModal(false);
                    }} 
                    style={modalStyles.confirmBtn}
                  >
                    Confirmer la modification
                  </button>
                  <button onClick={() => setShowModal(false)} style={modalStyles.cancelBtn}>
                    Annuler
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
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
  userStatus: {
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
  sectionTitle: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
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
  quickActionsSection: {
    marginBottom: '3rem',
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
  recentSection: {
    marginTop: '2rem',
  },
  recentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  recentCard: {
    backgroundColor: '#2a2a2a',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #444',
  },
  recentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  recentContent: {
    color: '#ccc',
    lineHeight: '1.6',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  },
  infoCard: {
    backgroundColor: '#2a2a2a',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid #444',
  },
  cardTitle: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContent: {
    lineHeight: '1.6',
    color: '#ccc',
  },
  actionSection: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  modifyBtn: {
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #00d4aa 0%, #00b895 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 212, 170, 0.3)',
  },
  cancelBtn: {
    padding: '1rem 2rem',
    backgroundColor: '#ef5350',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  courseCard: {
    backgroundColor: '#2a2a2a',
    padding: '1.5rem',
    borderRadius: '16px',
    border: '1px solid #444',
  },
  courseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  courseType: {
    margin: 0,
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  coursePlaces: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#00d4aa',
  },
  courseDetails: {
    marginBottom: '1.5rem',
    color: '#ccc',
    lineHeight: '1.6',
  },
  bookBtn: {
    width: '100%',
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #00d4aa 0%, #00b895 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 212, 170, 0.3)',
  },
  bookBtnDisabled: {
    background: '#444',
    cursor: 'not-allowed',
    boxShadow: 'none',
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
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
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
  planningGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  dayCard: {
    backgroundColor: '#2a2a2a',
    padding: '1.5rem',
    borderRadius: '16px',
    border: '1px solid #444',
  },
  dayTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  dayContent: {
    minHeight: '120px',
  },
  plannedCourse: {
    backgroundColor: '#1a1a1a',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid #444',
  },
  courseTime: {
    fontWeight: 'bold',
    color: '#00d4aa',
    minWidth: '60px',
  },
  courseInfo: {
    flex: 1,
  },
  coachInfo: {
    fontSize: '0.8rem',
    color: '#ccc',
  },
  noCourse: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: '2rem',
  },
  ratingContainer: {
    display: 'flex',
    gap: '2px',
  },
  star: {
    fontSize: '1.2rem',
    transition: 'color 0.2s ease',
  },
};

// Modal styles
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
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem',
    borderBottom: '1px solid #444',
    color: '#fff',
  },
  body: {
    padding: '2rem',
    color: '#ccc',
  },
  footer: {
    padding: '1.5rem 2rem',
    borderTop: '1px solid #444',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#ccc',
  },
  confirmBtn: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #00d4aa 0%, #00b895 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
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
  subscriptionOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  subscriptionOption: {
    padding: '1rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #444',
    borderRadius: '8px',
    textAlign: 'center',
  },
  selectBtn: {
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #00d4aa 0%, #00b895 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  currentBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'not-allowed',
    fontWeight: '600',
  },
  currentReservation: {
    backgroundColor: '#1a1a1a',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #444',
    marginBottom: '1rem',
  },
};

export default AdherentDashboard;