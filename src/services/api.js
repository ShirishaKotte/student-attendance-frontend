import axios from 'axios';

// Automatically uses environment variable on deployment (e.g. Render/Vercel) or defaults to local backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication APIs (Login & Register)
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
export const registerUser = (userData) => apiClient.post('/auth/register', userData);

// Student APIs (CRUD)
export const getStudents = () => apiClient.get('/students');
export const getStudent = (id) => apiClient.get(`/students/${id}`);
export const createStudent = (studentData) => apiClient.post('/students', studentData);
export const updateStudent = (id, studentData) => apiClient.put(`/students/${id}`, studentData);
export const deleteStudent = (id) => apiClient.delete(`/students/${id}`);

// Attendance APIs (CRUD + Calculations)
export const markBatchAttendance = (batchData) => apiClient.post('/attendance/batch', batchData);
export const markSingleAttendance = (date, recordData) => apiClient.post(`/attendance/single?date=${date}`, recordData);
export const getAttendanceByDate = (date) => apiClient.get(`/attendance/date/${date}`);
export const getAttendanceByStudent = (studentId) => apiClient.get(`/attendance/student/${studentId}`);
export const updateAttendance = (id, data) => apiClient.put(`/attendance/${id}`, data);
export const deleteAttendance = (id) => apiClient.delete(`/attendance/${id}`);

// Attendance Summary & Percentage APIs
export const getAttendanceSummary = () => apiClient.get('/attendance/summary');
export const getStudentSummary = (studentId) => apiClient.get(`/attendance/summary/${studentId}`);

export default apiClient;
