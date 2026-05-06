# 🎓 School Management System - Full Stack Dashboard

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-0170FE?style=for-the-badge&logo=ant-design&logoColor=white)](https://ant.design/)

## 📝 Project Overview

The **School Management System** is a sophisticated, role-based educational platform designed to streamline administrative tasks and enhance the student experience. This project has evolved from a simple admin dashboard into a comprehensive **Multi-Role Ecosystem** (Admin & Student), providing dedicated interfaces and functionalities tailored to each user type.

Built with a modern stack including **React 18**, **Vite**, and **TypeScript**, the application ensures high performance, type safety, and a seamless responsive UI across all devices.

---

## 🚀 Key Features

### 🔐 Multi-Role Architecture (RBAC)
The system implements a strict **Role-Based Access Control (RBAC)** system with dedicated layouts and permission-gated routes.

#### 👨‍💼 Admin & SuperAdmin Portal
The central hub for institution management, allowing administrators to:
- **User Management:** Create and manage Student, Faculty, and Admin accounts.
- **Academic Setup:** Configure Classes, Sections, Subjects, Departments, and Faculties.
- **Academic Operations:** Manage Class Routines, Exam Schedules, and Student Results.
- **Financials:** Track Fee records and payment statuses.
- **Communication:** Publish notices and distribute Study Guides.
- **Governance:** Approve or reject Leave Applications from students and staff.

#### 🎓 Student Portal
A personalized dashboard for students to stay connected with their academic progress:
- **Dashboard Overview:** Real-time stats and upcoming events.
- **Academic Tracking:** Access Class Routines and Exam Schedules.
- **Progress Reports:** View and download exam Results.
- **Resource Center:** Access Daily Study Guides and educational materials.
- **Financial Portal:** View payment history and pending Fees.
- **Self-Service:** Submit and track Leave Requests and update personal Profiles.

---

## 🛠️ Technology Stack

- **Core:** [React](https://reactjs.org/) (Functional Components, Hooks)
- **Build Tool:** [Vite](https://vitejs.dev/) (Lightning fast development)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict type safety)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [React Query](https://tanstack.com/query/latest) (Server state synchronization)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS) & [Ant Design](https://ant.design/) (UI Components)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router Dom v6](https://reactrouter.com/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)

---

## 📂 Project Structure

```bash
src/
├── components/      # Reusable UI components & Protected Routes
├── layout/          # Dedicated layouts for Admin and Student
├── pages/           # Feature-based page modules
│   ├── Academic/    # Class, Section, Subject management
│   ├── Admin/       # Admin specific operations
│   ├── Dashboard/   # Role-specific dashboard homes
│   ├── Students/    # Student management (CRUD)
│   └── ...          # Fees, Leaves, Results, Notices, etc.
├── redux/           # Global state slices
├── services/        # API service layers (Axios configuration)
├── types/           # Global TypeScript interfaces
└── App.tsx          # Main routing & Provider setup
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/ashikuzzamanmoon/school-management-system-dashboard.git
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your backend API link:
```env
VITE_API_URL=https://school-management-system-backend-gold.vercel.app/api/v1
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🌐 Deployment
The backend is currently hosted on **Vercel** and the frontend is ready for production build:
```bash
npm run build
```

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
