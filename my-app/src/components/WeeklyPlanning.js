import React, { useState, useEffect } from 'react';
import './WeeklyPlanning.css';

const WeeklyPlanning = () => {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [weeklyPlanning, setWeeklyPlanning] = useState({});
    const [loading, setLoading] = useState(false);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showWeeklyTemplateModal, setShowWeeklyTemplateModal] = useState(false);    const [newSession, setNewSession] = useState({
        date_heure: '',
        duree: 60,
        capacite: 20
    });
    const [weeklyTemplate, setWeeklyTemplate] = useState({
        start_date: '',
        sessions: []
    });
    const [templateSession, setTemplateSession] = useState({
        day_of_week: 1,
        time: '09:00',
        duree: 60,
        capacite: 20
    });

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = [
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00'
    ];    useEffect(() => {
        fetchWeeklyPlanning();
        fetchAvailableCourses();
    }, [currentWeek]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setShowCreateModal(false);
                setShowWeeklyTemplateModal(false);
            }
        };

        if (showCreateModal || showWeeklyTemplateModal) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [showCreateModal, showWeeklyTemplateModal]);

    const fetchWeeklyPlanning = async () => {
        setLoading(true);
        try {
            const startDate = getWeekStart(currentWeek).toISOString().split('T')[0];
            const response = await fetch(`http://localhost:8000/api/planning/weekly?start_date=${startDate}`);
            const data = await response.json();
            
            if (data.success) {
                setWeeklyPlanning(data.data.planning);
            }
        } catch (error) {
            console.error('Error fetching weekly planning:', error);
        }
        setLoading(false);
    };

    const fetchAvailableCourses = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/courses');
            const data = await response.json();
            
            if (data.success) {
                setAvailableCourses(data.data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const getWeekStart = (date) => {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
        startOfWeek.setDate(diff);
        return startOfWeek;
    };

    const getWeekEnd = (date) => {
        const endOfWeek = new Date(getWeekStart(date));
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        return endOfWeek;
    };

    const navigateWeek = (direction) => {
        const newWeek = new Date(currentWeek);
        newWeek.setDate(newWeek.getDate() + (direction * 7));
        setCurrentWeek(newWeek);
    };

    const createPlanningSession = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/planning', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSession)
            });

            const data = await response.json();
            
            if (data.success) {
                setShowCreateModal(false);
                setNewSession({ date_heure: '', duree: 60, capacite: 20 });
                fetchWeeklyPlanning();
                alert('Planning session created successfully!');
            } else {
                alert(data.message || 'Error creating session');
            }
        } catch (error) {
            console.error('Error creating planning session:', error);
            alert('Error creating session');
        }
    };

    const deletePlanningSession = async (sessionId) => {
        if (!window.confirm('Are you sure you want to delete this session?')) return;

        try {
            const response = await fetch(`http://localhost:8000/api/planning/${sessionId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (data.success) {
                fetchWeeklyPlanning();
                alert('Session deleted successfully!');
            } else {
                alert(data.message || 'Error deleting session');
            }
        } catch (error) {
            console.error('Error deleting session:', error);
            alert('Error deleting session');
        }
    };

    const assignCourseToSession = async (planningId, coursId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/planning/${planningId}/assign-course`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cours_id: coursId })
            });

            const data = await response.json();
            
            if (data.success) {
                fetchWeeklyPlanning();
                fetchAvailableCourses();
                alert('Course assigned successfully!');
            } else {
                alert(data.message || 'Error assigning course');
            }
        } catch (error) {
            console.error('Error assigning course:', error);
            alert('Error assigning course');
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDateForDay = (dayIndex) => {
        const date = new Date(getWeekStart(currentWeek));
        date.setDate(date.getDate() + dayIndex);
        return date;
    };

    const renderTimeSlot = (day, time, dayIndex) => {
        const sessions = weeklyPlanning[day] || [];
        const session = sessions.find(s => s.time === time);
        const date = getDateForDay(dayIndex);
        const dateTimeString = `${date.toISOString().split('T')[0]} ${time}:00`;

        return (
            <div key={`${day}-${time}`} className="time-slot">
                {session ? (
                    <div className="session-card">
                        <div className="session-header">
                            <strong>{session.cours_name || 'No Course'}</strong>
                            <button 
                                className="delete-btn"
                                onClick={() => deletePlanningSession(session.id)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="session-details">
                            <p>Type: {session.cours_type || 'N/A'}</p>
                            <p>Coach: {session.coach_name || 'No coach'}</p>
                            <p>Duration: {session.duree} min</p>
                            <p>Capacity: {session.capacite}</p>
                            <p>Reservations: {session.reservations_count}</p>
                        </div>
                        {!session.cours_name && (
                            <div className="assign-course">
                                <select 
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            assignCourseToSession(session.id, e.target.value);
                                        }
                                    }}
                                    defaultValue=""
                                >
                                    <option value="">Assign Course</option>
                                    {availableCourses.filter(course => !course.has_planning).map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.nom} - {course.coach_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="empty-slot">
                        <button 
                            className="add-session-btn"
                            onClick={() => {
                                setNewSession({
                                    ...newSession,
                                    date_heure: dateTimeString
                                });
                                setShowCreateModal(true);
                            }}
                        >
                            + Add Session
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const createWeeklyTemplate = async () => {
        if (!weeklyTemplate.start_date) {
            alert('Please select a start date');
            return;
        }

        if (weeklyTemplate.sessions.length === 0) {
            alert('Please add at least one session to the template');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/planning/weekly-template', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(weeklyTemplate)
            });

            const data = await response.json();
            
            if (data.success) {
                setShowWeeklyTemplateModal(false);
                setWeeklyTemplate({ start_date: '', sessions: [] });
                fetchWeeklyPlanning();
                alert('Weekly template created successfully!');
            } else {
                alert(data.message || 'Error creating weekly template');
            }
        } catch (error) {
            console.error('Error creating weekly template:', error);
            alert('Error creating weekly template');
        }
    };

    const addSessionToTemplate = () => {
        setWeeklyTemplate({
            ...weeklyTemplate,
            sessions: [...weeklyTemplate.sessions, { ...templateSession }]
        });
        setTemplateSession({
            day_of_week: 1,
            time: '09:00',
            duree: 60,
            capacite: 20
        });
    };

    const removeSessionFromTemplate = (index) => {
        const newSessions = weeklyTemplate.sessions.filter((_, i) => i !== index);
        setWeeklyTemplate({
            ...weeklyTemplate,
            sessions: newSessions
        });
    };

    const getDayName = (dayNumber) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days[dayNumber - 1];
    };

    return (
        <div className="weekly-planning">
            <div className="planning-header">
                <h2>Weekly Planning Management</h2>
                <div className="week-navigation">
                    <button onClick={() => navigateWeek(-1)}>← Previous Week</button>
                    <span className="week-display">
                        {formatDate(getWeekStart(currentWeek))} - {formatDate(getWeekEnd(currentWeek))}
                    </span>
                    <button onClick={() => navigateWeek(1)}>Next Week →</button>
                </div>
                <div className="planning-actions">
                    <button 
                        className="template-btn"
                        onClick={() => setShowWeeklyTemplateModal(true)}
                    >
                        Create Weekly Template
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="planning-grid">
                    <div className="time-column">
                        <div className="time-header">Time</div>
                        {timeSlots.map(time => (
                            <div key={time} className="time-cell">{time}</div>
                        ))}
                    </div>
                    
                    {daysOfWeek.map((day, dayIndex) => (
                        <div key={day} className="day-column">
                            <div className="day-header">
                                <div>{day}</div>
                                <div className="date-small">
                                    {getDateForDay(dayIndex).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                            {timeSlots.map(time => renderTimeSlot(day, time, dayIndex))}
                        </div>
                    ))}
                </div>
            )}            {/* Create Session Modal */}
            {showCreateModal && (
                <div className="modal" onClick={(e) => {
                    if (e.target.className === 'modal') {
                        setShowCreateModal(false);
                    }
                }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Create New Planning Session</h3>
                            <button 
                                className="modal-close-btn"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="form-group">
                            <label>Date & Time:</label>
                            <input
                                type="datetime-local"
                                value={newSession.date_heure.slice(0, 16)}
                                onChange={(e) => setNewSession({
                                    ...newSession,
                                    date_heure: e.target.value + ':00'
                                })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Duration (minutes):</label>
                            <input
                                type="number"
                                min="15"
                                max="240"
                                value={newSession.duree}
                                onChange={(e) => setNewSession({
                                    ...newSession,
                                    duree: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Capacity:</label>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={newSession.capacite}
                                onChange={(e) => setNewSession({
                                    ...newSession,
                                    capacite: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={createPlanningSession}>Create Session</button>
                            <button onClick={() => setShowCreateModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}            {/* Weekly Template Modal */}
            {showWeeklyTemplateModal && (
                <div className="modal" onClick={(e) => {
                    if (e.target.className === 'modal') {
                        setShowWeeklyTemplateModal(false);
                    }
                }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Create Weekly Template</h3>
                            <button 
                                className="modal-close-btn"
                                onClick={() => setShowWeeklyTemplateModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="form-group">
                            <label>Start Date:</label>
                            <input
                                type="date"
                                value={weeklyTemplate.start_date}
                                onChange={(e) => setWeeklyTemplate({
                                    ...weeklyTemplate,
                                    start_date: e.target.value
                                })}
                            />
                        </div>
                        <div className="template-sessions">
                            <h4>Sessions:</h4>
                            {weeklyTemplate.sessions.map((session, index) => (
                                <div key={index} className="template-session">
                                    <div className="session-info">
                                        <span>{getDayName(session.day_of_week)} {session.time}</span>
                                        <span>{session.duree} min</span>
                                        <span>Capacité: {session.capacite}</span>
                                    </div>
                                    <button 
                                        className="remove-session-btn"
                                        onClick={() => removeSessionFromTemplate(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <div className="add-session-template">
                                <h5>Add Session to Template</h5>
                                <div className="form-group">
                                    <label>Day of Week:</label>
                                    <select 
                                        value={templateSession.day_of_week}
                                        onChange={(e) => setTemplateSession({
                                            ...templateSession,
                                            day_of_week: parseInt(e.target.value)
                                        })}
                                    >
                                        {daysOfWeek.map((day, index) => (
                                            <option key={index} value={index + 1}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Time:</label>
                                    <select 
                                        value={templateSession.time}
                                        onChange={(e) => setTemplateSession({
                                            ...templateSession,
                                            time: e.target.value
                                        })}
                                    >
                                        {timeSlots.map(time => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Duration (minutes):</label>
                                    <input
                                        type="number"
                                        min="15"
                                        max="240"
                                        value={templateSession.duree}
                                        onChange={(e) => setTemplateSession({
                                            ...templateSession,
                                            duree: parseInt(e.target.value)
                                        })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Capacity:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={templateSession.capacite}
                                        onChange={(e) => setTemplateSession({
                                            ...templateSession,
                                            capacite: parseInt(e.target.value)
                                        })}
                                    />
                                </div>
                                <button onClick={addSessionToTemplate}>Add Session</button>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button onClick={createWeeklyTemplate}>Create Template</button>
                            <button onClick={() => setShowWeeklyTemplateModal(false)}>Cancel</button>
                        </div>                    </div>
                </div>
            )}            {/* Weekly Template Modal */}
            {showWeeklyTemplateModal && (
                <div className="modal" onClick={(e) => {
                    if (e.target.className === 'modal') {
                        setShowWeeklyTemplateModal(false);
                    }
                }}>
                    <div className="modal-content weekly-template-modal">
                        <div className="modal-header">
                            <h3>Create Weekly Template</h3>
                            <button 
                                className="modal-close-btn"
                                onClick={() => setShowWeeklyTemplateModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="form-group">
                            <label>Start Date:</label>
                            <input
                                type="date"
                                value={weeklyTemplate.start_date}
                                onChange={(e) => setWeeklyTemplate({
                                    ...weeklyTemplate,
                                    start_date: e.target.value
                                })}
                            />
                        </div>

                        <div className="template-sessions">
                            <h4>Template Sessions</h4>
                            {weeklyTemplate.sessions.length > 0 && (
                                <div className="sessions-list">
                                    {weeklyTemplate.sessions.map((session, index) => (
                                        <div key={index} className="session-item">
                                            <span>{getDayName(session.day_of_week)} at {session.time} - {session.duree}min (Cap: {session.capacite})</span>
                                            <button 
                                                className="remove-session-btn"
                                                onClick={() => removeSessionFromTemplate(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="add-session-form">
                                <h5>Add Session</h5>
                                <div className="session-form-row">
                                    <div className="form-group">
                                        <label>Day:</label>
                                        <select
                                            value={templateSession.day_of_week}
                                            onChange={(e) => setTemplateSession({
                                                ...templateSession,
                                                day_of_week: parseInt(e.target.value)
                                            })}
                                        >
                                            <option value={1}>Monday</option>
                                            <option value={2}>Tuesday</option>
                                            <option value={3}>Wednesday</option>
                                            <option value={4}>Thursday</option>
                                            <option value={5}>Friday</option>
                                            <option value={6}>Saturday</option>
                                            <option value={7}>Sunday</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Time:</label>
                                        <input
                                            type="time"
                                            value={templateSession.time}
                                            onChange={(e) => setTemplateSession({
                                                ...templateSession,
                                                time: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration:</label>
                                        <input
                                            type="number"
                                            min="15"
                                            max="240"
                                            value={templateSession.duree}
                                            onChange={(e) => setTemplateSession({
                                                ...templateSession,
                                                duree: parseInt(e.target.value)
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Capacity:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={templateSession.capacite}
                                            onChange={(e) => setTemplateSession({
                                                ...templateSession,
                                                capacite: parseInt(e.target.value)
                                            })}
                                        />
                                    </div>
                                </div>
                                <button 
                                    className="add-session-to-template-btn"
                                    onClick={addSessionToTemplate}
                                >
                                    Add Session
                                </button>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button onClick={createWeeklyTemplate}>Create Template</button>
                            <button onClick={() => setShowWeeklyTemplateModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeeklyPlanning;
