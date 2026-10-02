# 🏥 Hospital Appointment Management Platform

A complete and modern web application for managing hospital appointments and improving communication between **patients, doctors, managers, and administrators**.

The platform provides dedicated interfaces for each user role, allowing patients to book appointments, doctors to manage their availability and appointments, and managers and administrators to manage the hospital's activities.

---

## ✨ Features

### 👤 Patient

* 🔐 User registration and authentication
* 🩺 Browse medical specialties
* 👨‍⚕️ Browse doctors
* 🕐 View doctor availability
* 📅 Book appointments
* 📋 View and track appointments
* ❌ Cancel appointments
* 🔔 Receive notifications

### 👨‍⚕️ Doctor

* 📊 Personalized dashboard
* 👤 Manage personal profile
* 🖼️ Manage profile picture
* 🕐 Manage availability
* ➕ Add availability
* ✏️ Edit availability
* 🗑️ Delete availability
* 📅 View appointments
* ✅ Confirm appointments
* ❌ Cancel appointments

### 👨‍💼 Manager

* 📊 Dashboard with real-time statistics
* 👨‍⚕️ Manage doctors
* ➕ Add doctors
* ✏️ Edit doctors
* 🗑️ Delete doctors
* 👥 Manage patients
* 📅 Manage appointments
* 📈 Track appointment statistics
* 🔎 Monitor appointment statuses

### 🔐 Administrator

* 📊 Administration dashboard
* 👨‍⚕️ Manage doctor registration requests
* ✅ Accept doctor requests
* ❌ Reject doctor requests
* 🔄 Reactivate doctors
* 🩺 Manage medical specialties
* 👥 Manage users
* 🔑 Manage user roles
* 🔔 Manage notifications

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React.js
* 🟨 JavaScript
* 🎨 HTML5 / CSS3
* 🔗 Axios
* 🧭 React Router
* ⚡ Vite

### Backend

* 🐘 PHP
* 🔥 Laravel
* 🔗 REST API
* 🔐 Laravel Sanctum

### Database

* 🗄️ MySQL

### Tools

* 🐙 Git
* 🐙 GitHub
* 💻 VS Code
* 🖥️ WAMP

---

## 🏗️ Architecture

The application follows a **Frontend / Backend architecture**:

```text
hospital-appointment/
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
└── README.md
```

### Frontend

React.js application responsible for the user interface and interaction with the REST API.

### Backend

Laravel REST API responsible for:

* Authentication
* Business logic
* User roles and permissions
* Appointment management
* Doctor management
* Patient management
* Availability management

### Database

MySQL database used to store users, doctors, patients, specialties, appointments and availability data.

---

## 🔐 Authentication & Roles

The application uses **Laravel Sanctum** for API authentication.

Different access levels are available:

```text
Patient
   ↓
Doctor
   ↓
Responsable
   ↓
Administrator
```

Each role has access only to the functionalities corresponding to its responsibilities.

---

## 📅 Appointment Management

The platform allows users to manage the complete appointment workflow:

```text
Patient
   │
   ├── Select Specialty
   │
   ├── Select Doctor
   │
   ├── Select Availability
   │
   └── Book Appointment
              │
              ↓
          Doctor
              │
       ┌──────┴──────┐
       ↓             ↓
   Confirm        Cancel
       │
       ↓
    Patient
```

---

## 📊 Dashboard & Statistics

The management dashboard provides information such as:

* 📅 Appointments today
* 👥 Registered patients
* 👨‍⚕️ Active doctors
* ⏳ Pending appointments
* ❌ Cancelled appointments
* 📈 Appointment statistics
* 🕐 Recent appointments
* 👨‍⚕️ Most active doctors

---

## 📸 Screenshots

### 🏠 Home Page

*Add your screenshot here.*

### 👤 Patient Area

*Add your screenshot here.*

### 📅 Appointment Booking

*Add your screenshot here.*

### 👨‍⚕️ Doctor Dashboard

*Add your screenshot here.*

### 🕐 Doctor Availability

*Add your screenshot here.*

### 👨‍💼 Manager Dashboard

*Add your screenshot here.*

### 🔐 Administrator Dashboard

*Add your screenshot here.*

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Ayoub-Ait-Sayed/hospital-appointment.git
cd hospital-appointment
```

### 2. Backend

```bash
cd backend
composer install
```

Create your `.env` file:

```bash
copy .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

Configure your MySQL database in `.env`, then run:

```bash
php artisan migrate
```

Start the Laravel server:

```bash
php artisan serve
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API

The backend exposes REST API endpoints for:

* Authentication
* Patients
* Doctors
* Specialties
* Appointments
* Availability
* Users
* Notifications


## 🎯 Project Objectives

This project was developed to practice and apply:

* Full-stack web development
* REST API development
* Authentication and authorization
* Role-based access control
* CRUD operations
* Database relationships
* Frontend / Backend integration
* Responsive user interfaces
* Real-world application architecture


