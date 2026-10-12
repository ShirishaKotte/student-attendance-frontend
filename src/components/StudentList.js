import React, { useState, useEffect } from 'react';
import { getStudents, deleteStudent } from '../services/api';
import StudentForm from './StudentForm';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await getStudents();
      setStudents(res.data);
    } catch (err) {
      setAlert({ message: 'Error fetching students from server.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete student "${name}"? All associated attendance logs will also be removed.`)) {
      try {
        await deleteStudent(id);
        setAlert({ message: `Student "${name}" deleted successfully.`, type: 'success' });
        fetchStudents();
      } catch (err) {
        setAlert({ message: 'Failed to delete student.', type: 'error' });
      }
    }
  };

  const handleEdit = (student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setStudentToEdit(null);
    setIsModalOpen(true);
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Student Directory</h2>
          <p className="page-subtitle">Manage enrolled students (Create, Read, Update, Delete)</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Student
        </button>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="card">
        <div style={{ marginBottom: '20px', display: 'flex', gap: '16px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, roll number, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No students found. Click "Add New Student" to get started.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td><strong>{student.rollNumber}</strong></td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.department}</td>
                    <td>Sem {student.semester}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '8px' }}
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(student.id, student.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StudentForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentToEdit={studentToEdit}
        onSuccess={() => {
          setAlert({
            message: studentToEdit ? 'Student updated successfully!' : 'Student added successfully!',
            type: 'success'
          });
          fetchStudents();
        }}
      />
    </div>
  );
}

export default StudentList;
