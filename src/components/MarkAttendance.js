import React, { useState, useEffect, useCallback } from 'react';
import { getStudents, getAttendanceByDate, markBatchAttendance } from '../services/api';

function MarkAttendance() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [remarks, setRemarks] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentsRes, attendanceRes] = await Promise.all([
        getStudents(),
        getAttendanceByDate(selectedDate)
      ]);

      setStudents(studentsRes.data);

      const statusMap = {};
      const remarksMap = {};

      // If existing records exist for selected date, prefill them
      attendanceRes.data.forEach(item => {
        statusMap[item.student.id] = item.status;
        remarksMap[item.student.id] = item.remarks || '';
      });

      // Default remaining students to PRESENT if not yet marked
      studentsRes.data.forEach(s => {
        if (!statusMap[s.id]) {
          statusMap[s.id] = 'PRESENT';
        }
      });

      setAttendanceRecords(statusMap);
      setRemarks(remarksMap);
    } catch (err) {
      setAlert({ message: 'Error loading attendance data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toggle present / absent with single tick/click
  const handleTogglePresent = (studentId) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
    }));
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleRemarkChange = (studentId, text) => {
    setRemarks(prev => ({
      ...prev,
      [studentId]: text
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach(s => {
      updated[s.id] = status;
    });
    setAttendanceRecords(updated);
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    setAlert({ message: '', type: '' });

    try {
      const records = students.map(s => ({
        studentId: s.id,
        status: attendanceRecords[s.id] || 'PRESENT',
        remarks: remarks[s.id] || ''
      }));

      await markBatchAttendance({
        date: selectedDate,
        records: records
      });

      setAlert({
        message: `Attendance for ${selectedDate} saved successfully! ${records.length} student records updated.`,
        type: 'success'
      });
    } catch (err) {
      setAlert({
        message: 'Failed to submit attendance. Ensure server is active.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Real-time counter metrics for current class
  const totalCount = students.length;
  const presentCount = students.filter(s => attendanceRecords[s.id] === 'PRESENT' || attendanceRecords[s.id] === 'LATE').length;
  const absentCount = totalCount - presentCount;
  const todayRate = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(0) : 0;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Faculty Attendance Register</h2>
          <p className="page-subtitle">
            Tick Present ☑ or Absent ☐ for each student (1 to {students.length} students) and save
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
            Select Date:
          </label>
          <input
            type="date"
            className="form-control"
            style={{ width: 'auto' }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      {/* Real-time Attendance Stats Bar */}
      <div className="stats-grid" style={{ marginBottom: '16px' }}>
        <div className="stat-card" style={{ padding: '14px 20px' }}>
          <div className="stat-label">Total Strength</div>
          <div className="stat-value" style={{ fontSize: '22px' }}>{totalCount} Students</div>
        </div>
        <div className="stat-card" style={{ padding: '14px 20px' }}>
          <div className="stat-label">Ticked Present ☑</div>
          <div className="stat-value" style={{ fontSize: '22px', color: '#16a34a' }}>{presentCount}</div>
        </div>
        <div className="stat-card" style={{ padding: '14px 20px' }}>
          <div className="stat-label">Absent ☐</div>
          <div className="stat-value" style={{ fontSize: '22px', color: '#dc2626' }}>{absentCount}</div>
        </div>
        <div className="stat-card" style={{ padding: '14px 20px' }}>
          <div className="stat-label">Today's Turnout</div>
          <div className="stat-value" style={{ fontSize: '22px', color: '#2563eb' }}>{todayRate}%</div>
        </div>
      </div>

      <div className="card">
        {/* Action Controls & Fast Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleMarkAll('PRESENT')}
            >
              Tick All Present (☑ All)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleMarkAll('ABSENT')}
            >
              Uncheck All (☐ All Absent)
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Filter by roll number or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ width: '260px' }}
            />
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSaveAttendance}
              disabled={saving || students.length === 0}
            >
              {saving ? 'Saving...' : '💾 Save Attendance'}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Loading student roster for {selectedDate}...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No students found matching your criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>S.No</th>
                  <th style={{ width: '130px' }}>Tick Status</th>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>Status Toggle</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => {
                  const currentStatus = attendanceRecords[student.id] || 'PRESENT';
                  const isPresent = currentStatus === 'PRESENT' || currentStatus === 'LATE';

                  return (
                    <tr
                      key={student.id}
                      style={{
                        backgroundColor: currentStatus === 'PRESENT' ? '#f0fdf4' : currentStatus === 'ABSENT' ? '#fef2f2' : '#fffbeb'
                      }}
                    >
                      <td><strong>#{index + 1}</strong></td>
                      <td>
                        {/* Quick Tick Checkbox */}
                        <label style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          color: isPresent ? '#15803d' : '#b91c1c'
                        }}>
                          <input
                            type="checkbox"
                            checked={isPresent}
                            onChange={() => handleTogglePresent(student.id)}
                            style={{
                              width: '18px',
                              height: '18px',
                              accentColor: '#16a34a',
                              cursor: 'pointer'
                            }}
                          />
                          {isPresent ? 'Present' : 'Absent'}
                        </label>
                      </td>
                      <td><strong>{student.rollNumber}</strong></td>
                      <td>{student.name}</td>
                      <td>{student.department}</td>
                      <td>
                        {/* Buttons to specifically switch status */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              backgroundColor: currentStatus === 'PRESENT' ? '#16a34a' : '#e2e8f0',
                              color: currentStatus === 'PRESENT' ? '#fff' : '#475569',
                              padding: '4px 8px',
                              fontSize: '11px'
                            }}
                            onClick={() => handleStatusChange(student.id, 'PRESENT')}
                          >
                            P
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              backgroundColor: currentStatus === 'ABSENT' ? '#dc2626' : '#e2e8f0',
                              color: currentStatus === 'ABSENT' ? '#fff' : '#475569',
                              padding: '4px 8px',
                              fontSize: '11px'
                            }}
                            onClick={() => handleStatusChange(student.id, 'ABSENT')}
                          >
                            A
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              backgroundColor: currentStatus === 'LATE' ? '#d97706' : '#e2e8f0',
                              color: currentStatus === 'LATE' ? '#fff' : '#475569',
                              padding: '4px 8px',
                              fontSize: '11px'
                            }}
                            onClick={() => handleStatusChange(student.id, 'LATE')}
                          >
                            L
                          </button>
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Excused, On leave"
                          value={remarks[student.id] || ''}
                          onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                          style={{ padding: '6px 10px', fontSize: '13px' }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarkAttendance;
