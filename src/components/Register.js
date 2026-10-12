import React, { useState } from 'react';
import { registerUser } from '../services/api';

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    role: 'STUDENT',
    email: '',
    department: 'Computer Science',
    semester: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await registerUser(formData);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Username or Roll Number may already exist.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>
            Create an Account
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Register as a Student or Faculty member
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Account Role</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="role"
                  value="STUDENT"
                  checked={formData.role === 'STUDENT'}
                  onChange={handleChange}
                />
                Student
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="role"
                  value="FACULTY"
                  checked={formData.role === 'FACULTY'}
                  onChange={handleChange}
                />
                Faculty
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {formData.role === 'STUDENT' ? 'Roll Number / Student ID' : 'Faculty ID / Username'}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={formData.role === 'STUDENT' ? 'e.g. 23CS010' : 'e.g. faculty105'}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Rajesh Kumar"
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
              placeholder="e.g. rajesh@example.com"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="form-control"
            />
          </div>

          {formData.role === 'STUDENT' && (
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
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontWeight: '600',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
