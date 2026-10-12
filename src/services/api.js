import axios from 'axios';

// Dynamically check localStorage first, then environment variable, then live Cloudflare HTTPS backend
export const getBaseUrl = () => {
  const saved = localStorage.getItem('CUSTOM_API_URL');
  if (saved && saved.trim()) {
    let clean = saved.trim().replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }
  return process.env.REACT_APP_API_URL || 'https://time-fails-sea-keeps.trycloudflare.com/api';
};

export const setCustomApiUrl = (url) => {
  if (!url || !url.trim()) {
    localStorage.removeItem('CUSTOM_API_URL');
  } else {
    let clean = url.trim().replace(/\/+$/, '');
    if (!clean.endsWith('/api')) {
      clean = `${clean}/api`;
    }
    localStorage.setItem('CUSTOM_API_URL', clean);
  }
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ensure every request uses the most up-to-date base URL
apiClient.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  return config;
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
