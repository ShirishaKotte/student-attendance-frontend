import React, { useState, useEffect } from 'react';
import { createStudent, updateStudent } from '../services/api';

function StudentForm({ isOpen, onClose, studentToEdit, onSuccess }) {
  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    email: '',
    department: 'Computer Science',
    semester: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        rollNumber: studentToEdit.rollNumber || '',
        name: studentToEdit.name || '',
        email: studentToEdit.email || '',
        department: studentToEdit.department || 'Computer Science',
        semester: studentToEdit.semester || 1
      });
    } else {
      setFormData({
        rollNumber: '',
        name: '',
        email: '',
        department: 'Computer Science',
        semester: 1
      });
    }
    setError('');
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (studentToEdit && studentToEdit.id) {
        await updateStudent(studentToEdit.id, formData);
      } else {
        await createStudent(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          const firstErr = Object.values(err.response.data.errors)[0];
          setError(firstErr);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to save student details. Please try again.');
        }
      } else {
        setError('Network error. Ensure backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {studentToEdit ? 'Edit Student Details' : 'Add New Student'}
          </h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="e.g. 23CS101"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. john@example.com"
              required
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-control"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Tech">Information Tech</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
                <option value="Mechanical Eng">Mechanical Eng</option>
                <option value="Civil Eng">Civil Eng</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="form-control"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (studentToEdit ? 'Update Student' : 'Add Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
