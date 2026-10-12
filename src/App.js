import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import StudentPortal from './components/StudentPortal';
import MarkAttendance from './components/MarkAttendance';
import AttendanceDashboard from './components/AttendanceDashboard';
import StudentList from './components/StudentList';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('attendance_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState('mark'); // Default faculty view: mark attendance

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

  // If user is not logged in, display Login or Register screens
  if (!user) {
    return (
      <div className="app-container">
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
            />
          ) : (
            <Register
              onRegisterSuccess={() => setAuthView('login')}
              onSwitchToLogin={() => setAuthView('login')}
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
