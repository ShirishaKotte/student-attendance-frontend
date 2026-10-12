import React, { useState } from 'react';
import { loginUser } from '../services/api';

  function Login({ onLoginSuccess, onSwitchToRegister, onOpenConfig }) {
    const [formData, setFormData] = useState({
      username: '',
      password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const res = await loginUser(formData);
        onLoginSuccess(res.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else if (!err.response) {
          setError(
            <span>
              Cannot connect to backend server. If using cloud deployment, please{' '}
              <button
                type="button"
                onClick={onOpenConfig}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  padding: 0
                }}
              >
                configure your Render backend URL
              </button>
              .
            </span>
          );
        } else {
          setError('Login failed. Please check your credentials or backend server.');
        }
      } finally {
        setLoading(false);
      }
    };

  const handleFillDemo = (role) => {
    if (role === 'FACULTY') {
      setFormData({ username: 'faculty101', password: 'password123' });
    } else {
      setFormData({ username: '23CS001', password: 'password123' });
    }
    setError('');
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '20px',
            marginBottom: '12px'
          }}>
            AMS Portal
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>
            Sign In to Your Account
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Enter your Roll Number (Student) or ID (Faculty)
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">User ID / Roll Number</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. 23CS001 or faculty101"
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
              placeholder="Enter your password"
              required
              className="form-control"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials for Viva / Evaluation */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', fontWeight: '600' }}>
            Quick Demo Login Buttons:
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleFillDemo('FACULTY')}
            >
              Faculty Login (faculty101)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleFillDemo('STUDENT')}
            >
              Student Login (23CS001)
            </button>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontWeight: '600',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
