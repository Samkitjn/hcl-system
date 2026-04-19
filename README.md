# Hostel Management System

A full-stack web application to manage hostel operations efficiently for both students and management.

---

## Project Overview

The Hostel Management System is designed to simplify and automate hostel-related activities such as:

- Student registration and approval
- Room allocation
- Mess management
- Leave requests
- Maintenance requests
- Community interaction
- Roommate matching

The system provides separate dashboards for **students** and **management**, ensuring role-based access and control.

---

## Features

### Student Features
- Student registration with approval system
- First-year activation system
- Login authentication
- Dashboard overview
- View room details
- View mess menu and charges
- Apply for leave
- Submit maintenance requests
- Community posts
- Roommate matching

---

### Management Features
- Secure login
- Dashboard with real-time statistics
- Approve or reject student registrations
- Allocate rooms to students
- Approve/reject leave requests
- Manage maintenance requests
- View all rooms (availability & occupancy)
- Community moderation (delete posts)
- Post announcements
- Manage mess charges and view menu

---

## Tech Stack

### Frontend
- React.js
- CSS
- React Router

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### Authentication
- JWT (JSON Web Token)

---

## 📂 Project Structure

- `frontend/` → React application  
- `backend/` → Node + Express API  

---

## How to Run the Project

### 1. Clone the Repository

```bash
git clone <your-repo-link>
cd hostel-management-system


2. Setup Backend
cd backend
npm install

Create a .env file:
PORT=5000
JWT_SECRET=your_secret_key

Start backend:
npm run dev

3. Setup Database
Install PostgreSQL
Create a database
Run SQL queries from database_schema.sql


4. Setup Frontend
cd frontend
npm install
npm start


Frontend runs on:
http://localhost:3000


🔐 Authentication Flow
Students register → status = pending
Management approves students
Only approved students can log in
First-year students can activate preloaded accounts


📊 Core Modules
Module	Description
Student Approval	Approve/reject registrations
Room Allocation	Assign rooms to students
Mess Management	Manage charges and menu
Leave System	Apply and approve leave
Maintenance	Track issues and updates
Community	Posts + announcements
Roommate Matching	Find compatible roommates
🔮 Future Enhancements
Email notifications
Payment integration for mess fees
Real-time chat system
Advanced analytics dashboard
Improved role-based permissions
👨‍💻 Developed By
Your Name
Team Members (if any)
📌 Notes
This project is built for academic purposes.
Designed based on real-world hostel workflows.


