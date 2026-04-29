# InternSpace - Internship Management Platform

InternSpace is a full-stack web application designed to manage internal internships. It provides a real-time dashboard for administrators, mentors, and interns.

## ✨ System Features & Architecture

Built natively on the **MERN** stack, leveraging a dynamic role-based-access (RBAC) backbone:

### The Technology Backbone
- **Frontend**: Built with React and Vite.
- **Styling & UI**: Uses custom CSS and `react-toastify` for notifications.
- **Backend API**: Node.js and Express.js REST API.
- **Database**: Uses `mongodb-memory-server` for easy local development without needing a running MongoDB instance.
- **Authentication**: Standard JWT (JSON Web Tokens) stored in local storage and passed via Axios interceptors.

### Role Permissions
1. **Administrators (`admin`)**: Can view overall KPIs including total users, mentors, tasks, and internships.
2. **Mentors (`mentor`)**: Can view and assign tasks to interns.
3. **Interns (`intern`)**: Can view their tasks and log their progress and hours worked.

---

## 🚀 Quick Start Guide

This repository is configured to run easily using the **Bun** runtime.

### 1. Launch the Backend Server
Navigate to the `/backend` directory. Your memory server handles the rest seamlessly.
```bash
cd backend
bun install
bun run dev
```
*Wait exactly 3 seconds for the Mongoose connection flag to print successfully on Port 5000.*

### 2. Launch the Frontend
In a separate terminal, navigate to `/frontend`:
```bash
cd frontend
bun install
bun run dev
```

### 3. Verification Testing
- Open up `http://localhost:5173`.
- Create a test **Intern** user. 
- Log out. 
- Create a **Mentor** user, navigate to `+ Assign New Task`, and assign the task to the Intern.

## 💾 Schema Specifications

The application uses normalized MongoDB collections linked via ObjectIds:
`Task.js` references `internship`, `assignedTo`, and `assignedBy` to connect Interns and Mentors. `Progress.js` is linked to a specific `task` to track the state.
