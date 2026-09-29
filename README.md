# 🎓 EduTrack Pro - Student Management System

A production-grade, full-stack Student Management System built with **React (Vite)**, **Node.js/Express**, and **MongoDB (Mongoose)**. Designed with clean modular architecture, debounced server-side search, comprehensive input validation, JWT authentication, and a responsive SaaS dashboard interface.

---

## 🌟 Key Features

### 🔐 1. Authentication & Security
- **JWT Authentication**: Secure Bearer tokens with 24h expiration stored in `localStorage`.
- **Password Hashing**: Salted bcrypt hashing with 12 rounds.
- **Security Headers & Protection**: Express rate limiting (`express-rate-limit`), Helmet HTTP headers, CORS allowed origins configuration, and HTML sanitization.
- **Auto-Logout Interceptor**: Global Axios interceptor automatically clears expired sessions and redirects unauthenticated users to `/login`.

### 📊 2. Dashboard & Analytics
- **Enrollment Overview**: Key metrics cards for total students, active courses, popular fields, and academic year distribution.
- **Course Distribution**: Percentage breakdown per academic course field.
- **Recent Activity**: Quick view of recent student registrations with one-click actions.

### 🎓 3. Student CRUD Management
- **Full Lifecycle Operations**: Create, view details, edit, and delete student records.
- **Confirmation Modals**: Destructive delete operations protected with custom confirmation dialogs (`ConfirmDialog`).
- **Student Data Model**: Name, Email (unique), Phone (10 digits), Course, Academic Year (1-4), Creator reference (`createdBy`), and timestamps.

### 🔍 4. Search, Filter & Pagination
- **Debounced Server-Side Search**: Live search across Name, Email, Phone, and Course with 400ms debounce to minimize backend load.
- **Filter Controls**: Multi-select dropdown filtering by Course and Academic Year.
- **Sorting Options**: Sort by Name (A-Z, Z-A), Academic Year, and Date Created (Newest/Oldest).
- **Server-Side Pagination**: Configurable items-per-page (10, 20, 50, 100) with full pagination metadata.

### 🎨 5. Responsive SaaS UI/UX Design
- **Mobile-First Responsive Layout**: Smooth desktop table view (`StudentTable`) and adaptive mobile card layout (`StudentCard`).
- **Accessibility & Contrast**: WCAG AA compliant color palette, focus indicators, keyboard navigation (Escape modal closing), and ARIA attributes (`aria-modal`, `aria-invalid`, `aria-describedby`).
- **UX Delights**: Inline blur field validation, disabled loading button states, toast notifications (`ToastProvider`), skeleton loading placeholders (`TableSkeleton`), and React Error Boundaries.

---

## 🛠️ Tech Stack

| Layer | Technology | Key Libraries / Frameworks |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | React Router DOM v6, Axios, Lucide React, Custom CSS Design System |
| **Backend** | Node.js (ES Modules) | Express.js, Mongoose, JSON Web Token (JWT), bcryptjs |
| **Validation** | Express-Validator | Matching Client-side Real-time Validation Helpers |
| **Database** | MongoDB | Local or MongoDB Atlas with Mongoose Schemas & Indexes |
| **Security** | Security Middleware | Helmet, CORS, Express-Rate-Limit, Compression, Morgan |

---

## 📂 Project Structure

```text
Task-4/
├── client/                     # Vite React Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                # Axios instance & API endpoint modules
│   │   │   ├── axiosClient.js
│   │   │   ├── authApi.js
│   │   │   └── studentApi.js
│   │   ├── components/         # Modular React components
│   │   │   ├── common/         # Button, InputField, SelectField, Modal, ConfirmDialog, Toast, Pagination, Skeleton, ErrorBoundary, Layout, Navbar, Sidebar, ProtectedRoute
│   │   │   └── students/       # StatsCard, StudentTable, StudentCard, StudentFormModal, StudentDetailModal
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── hooks/              # useAuth, useToast, useDebounce
│   │   ├── pages/              # Login, Register, Dashboard, Students, StudentDetail, NotFound
│   │   ├── styles/             # main.css (CSS variables, reset, design system)
│   │   ├── utils/              # constants, formatters, validators
│   │   ├── App.jsx             # Routes setup
│   │   └── main.jsx            # React root entry
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
└── server/                     # Express REST API Backend
    ├── src/
    │   ├── config/             # Mongoose database connection (db.js)
    │   ├── controllers/        # authController.js, studentController.js
    │   ├── middleware/         # authMiddleware.js, errorMiddleware.js, rateLimiter.js, validateMiddleware.js
    │   ├── models/             # User.js, Student.js
    │   ├── routes/             # authRoutes.js, studentRoutes.js
    │   ├── seed/               # seed.js (populates demo admin + 20 students)
    │   ├── utils/              # appError.js, asyncHandler.js, jwtUtils.js, responseFormatter.js
    │   ├── validators/         # authValidators.js, studentValidators.js
    │   └── server.js           # Express app bootstrap
    ├── package.json
    └── .env.example
```

---

## ⚡ Quick Start & Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### 2. Backend Setup
1. Open a terminal in `/server`:
   ```bash
   cd server
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Install backend dependencies:
   ```bash
   npm install
   ```
4. Seed the database with demo admin and 20 sample students:
   ```bash
   npm run seed:fresh
   ```
   > **Default Admin Credentials**:
   > - **Email**: `admin@studentms.com`
   > - **Password**: `Admin@123456`

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   Server will run at `http://localhost:5000`.

### 3. Frontend Setup
1. Open a terminal in `/client`:
   ```bash
   cd client
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Install frontend dependencies:
   ```bash
   npm install
   ```
4. Start the Vite React app:
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:5173`.

---

## 📡 REST API Documentation

Base API URL: `/api`

Consistent Response Envelope:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "errors": [ { "field": "email", "message": "Email is required" } ]
}
```

### Auth Endpoints (`/api/auth`)

| Method | Endpoint | Auth | Description | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Register new admin account | `201`, `400`, `409` |
| `POST` | `/api/auth/login` | No | Authenticate user & return JWT token | `200`, `400`, `401` |
| `GET` | `/api/auth/me` | Yes | Fetch currently authenticated user profile | `200`, `401` |

### Student Endpoints (`/api/students`)

| Method | Endpoint | Auth | Description / Parameters | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | Yes | List students with search, filters, pagination<br>`?search=&course=&year=&sort=&page=&limit=` | `200`, `401` |
| `GET` | `/api/students/stats` | Yes | Get aggregate student statistics for dashboard | `200`, `401` |
| `GET` | `/api/students/:id` | Yes | Get detailed student profile by MongoDB ID | `200`, `401`, `404` |
| `POST` | `/api/students` | Yes | Create a new student record | `201`, `400`, `409` |
| `PUT` | `/api/students/:id` | Yes | Update existing student record | `200`, `400`, `404`, `409` |
| `DELETE`| `/api/students/:id` | Yes | Delete student record | `200`, `401`, `404` |

---

## 📐 Data Models

### User Schema (`models/User.js`)
```javascript
{
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true, minlength: 6, select: false },
  createdAt: { type: Date, default: Date.now }
}
```

### Student Schema (`models/Student.js`)
```javascript
{
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  course: { type: String, required: true, trim: true, index: true },
  year: { type: Number, required: true, min: 1, max: 4, index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📸 Interface Previews

```text
+-------------------------------------------------------------------------------+
|  EduTrack Pro           [Dashboard]  [Students List]         (A) Admin Logout |
+-------------------------------------------------------------------------------+
|  Welcome back, System Admin 👋                                                |
|                                                                               |
|  +--------------------+ +--------------------+ +----------------------------+ |
|  | 20 Enrolled        | | 8 Courses          | | Top Course: Computer Sci   | |
|  +--------------------+ +--------------------+ +----------------------------+ |
|                                                                               |
|  [ Search bar...                  ]  [ All Courses v ] [ All Years v ]        |
|  +--------------------------------------------------------------------------+ |
|  | Student Name     | Email              | Phone         | Course  | Year  | |
|  +--------------------------------------------------------------------------+ |
|  | Alex Johnson     | alex.j@ex.com      | (987) 654-3210| CS      | 3rd   | |
|  | Sophia Chen      | sophia.c@ex.com    | (987) 654-3211| CS      | 2nd   | |
|  +--------------------------------------------------------------------------+ |
|  Showing 1 to 10 of 20 students                       < 1 2 3 >               |
+-------------------------------------------------------------------------------+
```

---

## 💡 Design Decisions & Architectural Highlights

1. **Modular Architecture & Centralized Error Handling**:
   - Controller logic is kept clean using an `asyncHandler` wrapper that catches rejected promises and routes them to Express central `globalErrorHandler`.
   - Custom `AppError` class enforces consistent status codes (400, 401, 404, 409, 500) and standardized error responses.

2. **Client-Side Real-Time UX**:
   - `useDebounce` hook guarantees server queries occur only after the user pauses typing (400ms delay), avoiding query spam on every keypress.
   - Input forms validate fields both in real-time on blur and on submit, providing immediate inline visual feedback to users.

3. **Duplication Guard (HTTP 409)**:
   - When attempting to register a user or student with an email that already exists, the server returns a 409 Conflict status code with a structured field error, which the frontend automatically binds directly underneath the Email input field.

4. **Clean Design System (No Heavy UI Framework Overhead)**:
   - Built with a custom, highly maintainable CSS system using CSS variables, flex/grid modern layouts, accessible contrast, smooth transitions, and skeleton loaders for maximum performance and full visual control.

---

## 🚀 Possible Future Enhancements

- **Export & Import**: CSV/Excel export for student lists and bulk student CSV import.
- **Attendance & Grades Module**: Track student attendance records and semester grade points (GPA).
- **Role-Based Access Control (RBAC)**: Super Admin vs. Staff/Teacher vs. Student view permissions.
- **Refresh Tokens**: Implement short-lived access tokens with HTTP-only cookie refresh tokens.
