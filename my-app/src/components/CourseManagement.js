import React, { useState, useEffect } from 'react';
import './CourseManagement.css';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [newCourse, setNewCourse] = useState({
        nom: '',
        description: '',
        type: '',
        coach_id: ''
    });

    useEffect(() => {
        fetchCourses();
        fetchCoaches();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/courses');
            const data = await response.json();
            
            if (data.success) {
                setCourses(data.data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
        setLoading(false);
    };

    const fetchCoaches = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/courses/coaches/available');
            const data = await response.json();
            
            if (data.success) {
                setCoaches(data.data);
            }
        } catch (error) {
            console.error('Error fetching coaches:', error);
        }
    };

    const createCourse = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCourse)
            });

            const data = await response.json();
            
            if (data.success) {
                setShowCreateModal(false);
                setNewCourse({ nom: '', description: '', type: '', coach_id: '' });
                fetchCourses();
                alert('Course created successfully!');
            } else {
                alert(data.message || 'Error creating course');
            }
        } catch (error) {
            console.error('Error creating course:', error);
            alert('Error creating course');
        }
    };

    const updateCourse = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/courses/${editingCourse.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCourse)
            });

            const data = await response.json();
            
            if (data.success) {
                setEditingCourse(null);
                setNewCourse({ nom: '', description: '', type: '', coach_id: '' });
                fetchCourses();
                alert('Course updated successfully!');
            } else {
                alert(data.message || 'Error updating course');
            }
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Error updating course');
        }
    };

    const deleteCourse = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;

        try {
            const response = await fetch(`http://localhost:8000/api/courses/${courseId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (data.success) {
                fetchCourses();
                alert('Course deleted successfully!');
            } else {
                alert(data.message || 'Error deleting course');
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Error deleting course');
        }
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setNewCourse({
            nom: course.nom,
            description: course.description || '',
            type: course.type,
            coach_id: course.coach_id
        });
        setShowCreateModal(true);
    };

    const closeModal = () => {
        setShowCreateModal(false);
        setEditingCourse(null);
        setNewCourse({ nom: '', description: '', type: '', coach_id: '' });
    };

    const handleSubmit = () => {
        if (editingCourse) {
            updateCourse();
        } else {
            createCourse();
        }
    };

    return (
        <div className="course-management">
            <div className="course-header">
                <h2>Course Management</h2>
                <button 
                    className="create-btn"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create New Course
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="courses-grid">
                    {courses.map(course => (
                        <div key={course.id} className="course-card">
                            <div className="course-header-card">
                                <h3>{course.nom}</h3>
                                <div className="course-actions">
                                    <button 
                                        className="edit-btn"
                                        onClick={() => openEditModal(course)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => deleteCourse(course.id)}
                                        disabled={course.has_planning}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            
                            <div className="course-details">
                                <p><strong>Type:</strong> {course.type}</p>
                                <p><strong>Coach:</strong> {course.coach_name}</p>
                                {course.coach_specialite && (
                                    <p><strong>Speciality:</strong> {course.coach_specialite}</p>
                                )}
                                {course.description && (
                                    <p><strong>Description:</strong> {course.description}</p>
                                )}
                                <div className="course-status">
                                    {course.has_planning ? (
                                        <span className="status-assigned">Assigned to Planning</span>
                                    ) : (
                                        <span className="status-available">Available for Planning</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Course Modal */}
            {showCreateModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{editingCourse ? 'Edit Course' : 'Create New Course'}</h3>
                        
                        <div className="form-group">
                            <label>Course Name:</label>
                            <input
                                type="text"
                                value={newCourse.nom}
                                onChange={(e) => setNewCourse({
                                    ...newCourse,
                                    nom: e.target.value
                                })}
                                placeholder="Enter course name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Course Type:</label>
                            <select
                                value={newCourse.type}
                                onChange={(e) => setNewCourse({
                                    ...newCourse,
                                    type: e.target.value
                                })}
                            >
                                <option value="">Select course type</option>
                                <option value="Cardio">Cardio</option>
                                <option value="Strength Training">Strength Training</option>
                                <option value="Yoga">Yoga</option>
                                <option value="Pilates">Pilates</option>
                                <option value="CrossFit">CrossFit</option>
                                <option value="Zumba">Zumba</option>
                                <option value="Spinning">Spinning</option>
                                <option value="Boxing">Boxing</option>
                                <option value="Swimming">Swimming</option>
                                <option value="Martial Arts">Martial Arts</option>
                                <option value="Group Fitness">Group Fitness</option>
                                <option value="Personal Training">Personal Training</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Coach:</label>
                            <select
                                value={newCourse.coach_id}
                                onChange={(e) => setNewCourse({
                                    ...newCourse,
                                    coach_id: e.target.value
                                })}
                            >
                                <option value="">Select a coach</option>
                                {coaches.map(coach => (
                                    <option key={coach.id} value={coach.id}>
                                        {coach.name} - {coach.specialite}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Description:</label>
                            <textarea
                                value={newCourse.description}
                                onChange={(e) => setNewCourse({
                                    ...newCourse,
                                    description: e.target.value
                                })}
                                placeholder="Enter course description"
                                rows="4"
                            />
                        </div>

                        <div className="modal-actions">
                            <button onClick={handleSubmit}>
                                {editingCourse ? 'Update Course' : 'Create Course'}
                            </button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagement;
