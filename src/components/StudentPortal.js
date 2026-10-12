import React, { useState, useEffect, useCallback } from 'react';
import { getStudentSummary, getAttendanceByStudent } from '../services/api';

function StudentPortal({ user }) {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const studentId = user.studentId;

  const fetchStudentData = useCallback(async () => {
    if (!studentId) {
      setError('Student profile not linked to this account.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [sumRes, histRes] = await Promise.all([
        getStudentSummary(studentId),
        getAttendanceByStudent(studentId)
      ]);
      setSummary(sumRes.data);
      setHistory(histRes.data);
    } catch (err) {
      setError('Could not load attendance details. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
        <h3>Loading your attendance records...</h3>
      </div>
    );
  }

  const pct = summary ? summary.attendancePercentage : 0;
  const isShortage = summary && summary.totalClasses > 0 && pct < 75;

  return (
    <div className="container">
      {/* Student Profile Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: '#ffffff',
        border: 'none',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: '8px' }}>
              Student Portal
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '700', margin: '4px 0' }}>
              {user.fullName}
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>
              Roll Number: <strong>{user.rollNumber || user.username}</strong> &bull; {summary ? `${summary.department} - Sem ${summary.semester}` : ''}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Overall Attendance</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: pct >= 75 ? '#4ade80' : '#f87171' }}>
              {pct}%
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Shortage or Good Standing Alert */}
      {summary && summary.totalClasses > 0 && (
        <div className={`alert ${isShortage ? 'alert-error' : 'alert-success'}`}>
          {isShortage ? (
            <div>
              <strong>⚠️ Attendance Shortage Warning:</strong> Your current attendance is <strong>{pct}%</strong>, which is below the mandatory <strong>75%</strong> requirement. Please meet your department coordinator.
            </div>
          ) : (
            <div>
              <strong>✅ Good Standing:</strong> Your attendance is <strong>{pct}%</strong>. You meet the eligible attendance requirement for end-semester examinations.
            </div>
          )}
        </div>
      )}

      {/* Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Classes Held</div>
          <div className="stat-value">{summary ? summary.totalClasses : 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Classes Attended</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>
            {summary ? summary.attendedClasses : 0}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Classes Absent</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>
            {summary ? summary.absentClasses : 0}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Eligibility Status</div>
          <div className="stat-value" style={{ fontSize: '20px', marginTop: '10px' }}>
            {summary && summary.totalClasses === 0 ? (
              <span className="badge badge-late">No Classes Yet</span>
            ) : isShortage ? (
              <span className="badge badge-absent">Not Eligible (&lt; 75%)</span>
            ) : (
              <span className="badge badge-present">Eligible (&ge; 75%)</span>
            )}
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
              My Attendance Logs
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Date-wise attendance status recorded by faculty
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchStudentData}>
            Refresh
          </button>
        </div>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No attendance records found yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Faculty Remarks</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id}>
                    <td><strong>{record.date}</strong></td>
                    <td>
                      <span className={`badge ${
                        record.status === 'PRESENT'
                          ? 'badge-present'
                          : record.status === 'ABSENT'
                          ? 'badge-absent'
                          : 'badge-late'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentPortal;
