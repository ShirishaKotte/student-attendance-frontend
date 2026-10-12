import React, { useState, useEffect } from 'react';
import { getAttendanceSummary, getAttendanceByStudent } from '../services/api';

function AttendanceDashboard() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const res = await getAttendanceSummary();
      setSummaries(res.data);
    } catch (err) {
      setError('Failed to fetch attendance summary reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  const handleViewHistory = async (student) => {
    setSelectedStudent(student);
    setHistoryLoading(true);
    try {
      const res = await getAttendanceByStudent(student.studentId);
      setStudentHistory(res.data);
    } catch (err) {
      alert('Error fetching attendance history.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Metrics calculation
  const totalStudents = summaries.length;
  const avgPercentage = totalStudents > 0
    ? (summaries.reduce((acc, curr) => acc + curr.attendancePercentage, 0) / totalStudents).toFixed(1)
    : 0;
  const eligibleCount = summaries.filter(s => s.attendancePercentage >= 75).length;
  const shortageCount = summaries.filter(s => s.totalClasses > 0 && s.attendancePercentage < 75).length;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Attendance Analytics & Percentage</h2>
          <p className="page-subtitle">Track individual student attendance percentages and eligibility</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchSummaries}>
          Refresh Reports
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Summary KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Enrolled</div>
          <div className="stat-value">{totalStudents}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Class Average</div>
          <div className="stat-value" style={{ color: '#2563eb' }}>{avgPercentage}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Eligible (&ge; 75%)</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>{eligibleCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Attendance Shortage (&lt; 75%)</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>{shortageCount}</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Calculating statistics...
          </div>
        ) : summaries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No attendance logs found yet. Mark attendance first!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>Total Classes</th>
                  <th>Attended</th>
                  <th>Absent</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>History</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((item) => {
                  const pct = item.attendancePercentage;
                  let badgeClass = 'badge-present';
                  let statusText = 'Eligible';
                  let barColorClass = 'progress-green';

                  if (item.totalClasses === 0) {
                    badgeClass = 'badge-late';
                    statusText = 'No Data';
                  } else if (pct < 75) {
                    badgeClass = 'badge-absent';
                    statusText = 'Shortage';
                    barColorClass = 'progress-red';
                  } else if (pct < 85) {
                    badgeClass = 'badge-late';
                    statusText = 'Average';
                    barColorClass = 'progress-yellow';
                  }

                  return (
                    <tr key={item.studentId}>
                      <td><strong>{item.rollNumber}</strong></td>
                      <td>{item.name}</td>
                      <td>{item.department}</td>
                      <td>{item.totalClasses}</td>
                      <td style={{ color: '#16a34a', fontWeight: '600' }}>{item.attendedClasses}</td>
                      <td style={{ color: '#dc2626', fontWeight: '600' }}>{item.absentClasses}</td>
                      <td style={{ width: '160px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600' }}>
                          <span>{pct}%</span>
                        </div>
                        <div className="progress-container">
                          <div
                            className={`progress-bar ${barColorClass}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${badgeClass}`}>
                          {statusText}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleViewHistory(item)}
                        >
                          View Logs
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student History Modal */}
      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Attendance Logs</h3>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  {selectedStudent.name} ({selectedStudent.rollNumber}) &bull; {selectedStudent.attendancePercentage}% Attendance
                </p>
              </div>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>&times;</button>
            </div>

            {historyLoading ? (
              <div style={{ textAlign: 'center', padding: '30px' }}>Loading history...</div>
            ) : studentHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                No attendance logs found for this student.
              </div>
            ) : (
              <div className="table-responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentHistory.map((rec) => (
                      <tr key={rec.id}>
                        <td>{rec.date}</td>
                        <td>
                          <span className={`badge ${rec.status === 'PRESENT' ? 'badge-present' : rec.status === 'ABSENT' ? 'badge-absent' : 'badge-late'}`}>
                            {rec.status}
                          </span>
                        </td>
                        <td>{rec.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceDashboard;
