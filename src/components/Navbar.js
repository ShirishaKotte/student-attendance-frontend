import React from 'react';

function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  const isFaculty = user && user.role === 'FACULTY';

  return (
    <header style={{
      backgroundColor: '#1e293b',
      color: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            backgroundColor: '#2563eb',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            AMS
          </span>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>
              Attendance Management System
            </h1>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              {isFaculty ? 'Faculty Control Center' : 'Student Attendance Portal'}
            </span>
          </div>
        </div>

        {/* Faculty Navigation Tabs (Only for Faculty) */}
        {isFaculty && (
          <nav style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('mark')}
              style={{
                background: activeTab === 'mark' ? '#2563eb' : 'transparent',
                color: activeTab === 'mark' ? '#ffffff' : '#cbd5e1',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Mark Attendance (Tick)
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                background: activeTab === 'dashboard' ? '#2563eb' : 'transparent',
                color: activeTab === 'dashboard' ? '#ffffff' : '#cbd5e1',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Percentage & Reports
            </button>
            <button
              onClick={() => setActiveTab('students')}
              style={{
                background: activeTab === 'students' ? '#2563eb' : 'transparent',
                color: activeTab === 'students' ? '#ffffff' : '#cbd5e1',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Manage Students
            </button>
          </nav>
        )}

        {/* User Info & Logout Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user && (
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>
                  {user.fullName}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: '700',
                    backgroundColor: isFaculty ? '#3b82f6' : '#10b981',
                    color: '#ffffff'
                  }}>
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="btn btn-secondary btn-sm"
                style={{
                  backgroundColor: '#334155',
                  color: '#f8fafc',
                  border: '1px solid #475569'
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
