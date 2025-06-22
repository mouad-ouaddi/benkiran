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

  if (!user) {
    return <div style={styles.loading}>Loading...</div>;
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
          <div style={styles.adherentName}>{user.prenom} {user.nom}</div>
        </div>

        <nav style={styles.nav}>
          <div 
            style={{...styles.navItem, ...(activeTab === 'dashboard' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('dashboard')}
          >
            DASHBOARD
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'abonnement' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('abonnement')}
          >
            Page Abonnement
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'reservation' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('reservation')}
          >
            Réservation de cours
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'mes-reservations' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('mes-reservations')}
          >
            Mes réservations
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'planning' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('planning')}
          >
            Planning Personnel
          </div>
          <div 
            style={{...styles.navItem, ...(activeTab === 'historique' ? styles.navItemActive : {})}}
            onClick={() => setActiveTab('historique')}
          >
            Historique
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
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={styles.content}>
            <h1 style={styles.pageTitle}>Dashboard Adhérent</h1>
            
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <h3 style={styles.statTitle}>Mon Abonnement</h3>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{user.abonnement}</div>
                  <div style={styles.statLabel}>Actif jusqu'au {user.dateExpiration}</div>
                </div>
              </div>
              
              <div style={styles.statCard}>
                <h3 style={styles.statTitle}>Mes Réservations</h3>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{reservations.length}</div>
                  <div style={styles.statLabel}>Cours cette semaine</div>
                </div>
              </div>
              
              <div style={styles.statCard}>
                <h3 style={styles.statTitle}>Séances Complétées</h3>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{history.filter(h => h.statut === 'Complété').length}</div>
                  <div style={styles.statLabel}>Ce mois-ci</div>
                </div>
              </div>
              
              <div style={styles.statCard}>
                <h3 style={styles.statTitle}>Temps d'Entraînement</h3>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>15h</div>
                  <div style={styles.statLabel}>Cette semaine</div>
                </div>
              </div>
            </div>

            <div style={styles.quickActions}>
              <h2 style={styles.sectionTitle}>Actions Rapides</h2>
              <div style={styles.actionGrid}>
                <button 
                  style={styles.actionBtnPrimary}
                  onClick={() => handleQuickAction('reserve')}
                >
                  📅 Réserver un cours
                </button>
                <button 
                  style={styles.actionBtnSecondary}
                  onClick={() => handleQuickAction('planning')}
                >
                  📋 Voir le planning
                </button>
                <button 
                  style={styles.actionBtnSecondary}
                  onClick={() => handleQuickAction('contact')}
                >
                  💬 Contacter un coach
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Abonnement Tab */}
        {activeTab === 'abonnement' && (
          <div style={styles.content}>
            <h1 style={styles.pageTitle}>Page Abonnement</h1>
            
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
                Modifier
              </button>
              <button 
                style={styles.cancelBtn}
                onClick={() => handleSubscriptionAction('cancel')}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Reservation Tab */}
        {activeTab === 'reservation' && (
          <div style={styles.content}>
            <h1 style={styles.pageTitle}>Réservation de cours</h1>
            
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
                    <p><strong>Date:</strong> {course.date}</p>
                    <p><strong>Heure:</strong> {course.time}</p>
                    <p><strong>Coach:</strong> {course.coach}</p>
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
            <h1 style={styles.pageTitle}>Mes Réservations</h1>
            
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
                    <tr key={reservation.id} style={{...styles.tableRow, backgroundColor: index % 2 === 0 ? '#c4f000' : '#b8e000'}}>
                      <td style={styles.td}>{reservation.type}</td>
                      <td style={styles.td}>{reservation.date} à {reservation.time}</td>
                      <td style={styles.td}>{reservation.coach}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: reservation.statut === 'Confirmé' ? '#28a745' : '#ffc107',
                          color: reservation.statut === 'Confirmé' ? 'white' : '#212529'
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
                            style={{...styles.actionBtn, ...styles.deleteBtn}}
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
            <h1 style={styles.pageTitle}>Planning Personnel</h1>
            
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
            <h1 style={styles.pageTitle}>Historique</h1>
            
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
                    <tr key={item.id} style={{...styles.tableRow, backgroundColor: index % 2 === 0 ? '#c4f000' : '#b8e000'}}>
                      <td style={styles.td}>{item.type}</td>
                      <td style={styles.td}>{item.date} à {item.time}</td>
                      <td style={styles.td}>{item.coach}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: item.statut === 'Complété' ? '#28a745' : '#dc3545',
                          color: 'white'
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
                                  color: star <= (item.note || 0) ? '#ffc107' : '#e9ecef',
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
                    <label>Coach:</label>
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
                    <label>Sujet:</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      style={modalStyles.input}
                      placeholder="Sujet de votre message"
                    />
                  </div>
                  <div style={modalStyles.field}>
                    <label>Message:</label>
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

          </div>
        </div>
      )}
    </div>
  );
};

// Styles (keeping the existing ones and adding new ones)
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
  adherentName: {
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
    backgroundColor: '#4a5d23',
    padding: '2rem',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  pageTitle: {
    color: 'white',
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: '#c4f000',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: '#2c2c2c',
  },
  statTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2c2c2c',
  },
  statContent: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#555',
  },
  quickActions: {
    marginTop: '3rem',
  },
  sectionTitle: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  actionBtnPrimary: {
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
  actionBtnSecondary: {
    padding: '1rem 1.5rem',
    backgroundColor: 'white',
    color: '#2c2c2c',
    border: '2px solid #c4f000',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  },
  infoCard: {
    backgroundColor: '#c4f000',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: '#2c2c2c',
  },
  cardTitle: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#2c2c2c',
  },
  cardContent: {
    lineHeight: '1.6',
  },
  actionSection: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  modifyBtn: {
    padding: '1rem 2rem',
    backgroundColor: '#2c2c2c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  cancelBtn: {
    padding: '1rem 2rem',
    backgroundColor: '#2c2c2c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
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
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textAlign: 'center',
    display: 'inline-block',
    minWidth: '80px',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
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
  // New styles for course booking
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  courseCard: {
    backgroundColor: '#c4f000',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
    color: '#2c2c2c',
  },
  coursePlaces: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#555',
  },
  courseDetails: {
    marginBottom: '1.5rem',
    color: '#2c2c2c',
  },
  bookBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#2c2c2c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  bookBtnDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  },
  // Planning styles
  planningGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  dayCard: {
    backgroundColor: '#c4f000',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  dayTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#2c2c2c',
  },
  dayContent: {
    minHeight: '120px',
  },
  plannedCourse: {
    backgroundColor: 'white',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  courseTime: {
    fontWeight: 'bold',
    color: '#2c2c2c',
    minWidth: '60px',
  },
  courseInfo: {
    flex: 1,
  },
  coachInfo: {
    fontSize: '0.8rem',
    color: '#6c757d',
  },
  noCourse: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    padding: '2rem',
  },
  // Rating styles
  ratingContainer: {
    display: 'flex',
    gap: '2px',
  },
  star: {
    fontSize: '1.2rem',
    transition: 'color 0.2s ease',
  },
  placeholder: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: '#2c2c2c',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
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
  footer: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #e9ecef',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6c757d',
  },
  confirmBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#c4f000',
    color: '#2c2c2c',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  field: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.9rem',
    boxSizing: 'border-box',
  },
  subscriptionOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  subscriptionOption: {
    padding: '1rem',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    textAlign: 'center',
  },
  selectBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#c4f000',
    color: '#2c2c2c',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  currentBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    fontWeight: '600',
  },
};

export default AdherentDashboard;