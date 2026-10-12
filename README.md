# Student Attendance Management System - Frontend

Modern, responsive React.js web client for the Student Attendance Management System, built with Axios, role-based interfaces (Faculty Control Center & Student Private Portal), and real-time attendance calculations.

---

## 🛠️ Tech Stack
* **React 18**
* **Axios** (REST client for Spring Boot)
* **CSS3** (Responsive modern styling)
* **Deployment Configs Included:** Vercel (`vercel.json`), Netlify (`_redirects`), Render

---

## 🚀 Key Features
* **Role-Based Authentication:**
  * Login screen with quick one-click demo credentials.
  * Registration portal for students and faculty.
* **Faculty Interface:**
  * **1-to-40 Tick Register:** Quick checkbox per student (Ticked = Present ☑, Unticked = Absent ☐).
  * Bulk actions (*Tick All Present*, *Uncheck All*).
  * Live class turnout tracker.
  * Attendance records view and update.
  * Class-wide percentage reports and shortage warnings (< 75%).
  * Student directory management (Add, Edit, Delete).
* **Student Interface:**
  * **Private, view-only dashboard:** Students only see their own attendance logs.
  * Live calculated attendance percentage (%) with progress bar.
  * Automatic exam eligibility / shortage alert indicator.

---

## 💻 Local Setup
1. Clone repository:
   ```bash
   git clone https://github.com/ShirishaKotte/student-attendance-frontend.git
   cd student-attendance-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start local development server:
   ```bash
   npm start
   ```
4. Application opens on: `http://localhost:3000`

---

## ☁️ Deployment (Vercel / Netlify / Render)
1. **Vercel:**
   * Import repository `ShirishaKotte/student-attendance-frontend`.
   * Add Environment Variable: `REACT_APP_API_URL` pointing to your deployed Spring Boot backend.
   * Click **Deploy**.
2. **Netlify:**
   * Connect repository, set build command: `npm run build`, publish directory: `build`.
   * Add `REACT_APP_API_URL` in Site settings.
