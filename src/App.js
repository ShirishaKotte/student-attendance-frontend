import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import StudentPortal from './components/StudentPortal';
import MarkAttendance from './components/MarkAttendance';
import AttendanceDashboard from './components/AttendanceDashboard';
import StudentList from './components/StudentList';
import { getBaseUrl, setCustomApiUrl } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('attendance_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState('mark'); // Default faculty view: mark attendance
  const [showConfig, setShowConfig] = useState(false);
  const [inputUrl, setInputUrl] = useState(getBaseUrl());
  const [currentBaseUrl, setCurrentBaseUrl] = useState(getBaseUrl());

  useEffect(() => {
    if (user) {
      localStorage.setItem('attendance_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('attendance_user');
    }
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'STUDENT') {
      setActiveTab('student_portal');
    } else {
      setActiveTab('mark');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAuthView('login');
  };

  const handleSaveApiUrl = (e) => {
    e.preventDefault();
    setCustomApiUrl(inputUrl);
    setCurrentBaseUrl(getBaseUrl());
    setShowConfig(false);
    window.location.reload();
  };

  const handleResetApiUrl = () => {
    setCustomApiUrl('');
    setCurrentBaseUrl(getBaseUrl());
    setInputUrl(getBaseUrl());
    setShowConfig(false);
    window.location.reload();
  };

  const serverBar = (
    <div style={{
      backgroundColor: '#0f172a',
      color: '#cbd5e1',
      padding: '8px 16px',
      fontSize: '12px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      borderBottom: '1px solid #1e293b'
    }}>
      <span>
        🔌 Backend API: <strong style={{ color: '#38bdf8' }}>{currentBaseUrl}</strong>
      </span>
      <button
        onClick={() => setShowConfig(!showConfig)}
        style={{
          background: '#334155',
          color: '#fff',
          border: 'none',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          cursor: 'pointer'
        }}
      >
        {showConfig ? 'Close' : '⚙️ Configure Backend URL'}
      </button>

      {showConfig && (
        <form onSubmit={handleSaveApiUrl} style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%', justifyContent: 'center', marginTop: '6px' }}>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="e.g. https://student-attendance-backend-xxxx.onrender.com"
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              border: '1px solid #475569',
              background: '#1e293b',
              color: '#fff',
              fontSize: '12px',
              width: '380px',
              maxWidth: '90%'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Connect
          </button>
          <button
            type="button"
            onClick={handleResetApiUrl}
            style={{
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </form>
      )}
    </div>
  );

  // If user is not logged in, display Login or Register screens
  if (!user) {
    return (
      <div className="app-container">
        {serverBar}
        <header style={{
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: '16px 24px',
          textAlign: 'center',
          borderBottom: '1px solid #334155'
        }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
            Student Attendance Management System
          </h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Role-Based Authentication: Faculty & Student Portals
          </p>
        </header>

        <main className="main-content">
          {authView === 'login' ? (
            <Login
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setAuthView('register')}
              onOpenConfig={() => setShowConfig(true)}
            />
          ) : (
            <Register
              onRegisterSuccess={() => setAuthView('login')}
              onSwitchToLogin={() => setAuthView('login')}
              onOpenConfig={() => setShowConfig(true)}
            />
          )}
        </main>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Attendance Management System &bull; Spring Boot + React + MySQL</p>
        </footer>
      </div>
    );
  }

  // If user is logged in
  return (
    <div className="app-container">
      {serverBar}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {/* STUDENT VIEW: ONLY their attendance is displayed */}
        {user.role === 'STUDENT' && (
          <StudentPortal user={user} />
        )}

        {/* FACULTY VIEW: Complete control to mark (tick 1-40), view records, update, and manage */}
        {user.role === 'FACULTY' && (
          <>
            {activeTab === 'mark' && <MarkAttendance />}
            {activeTab === 'dashboard' && <AttendanceDashboard />}
            {activeTab === 'students' && <StudentList />}
          </>
        )}
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Student Attendance Management System &bull; Logged in as {user.fullName} ({user.role})</p>
      </footer>
    </div>
  );
}

export default App;
