# School Management System - Client / Admin Dashboard

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant%20Design-0170FE?style=for-the-badge&logo=ant-design&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📝 Project Overview

The **School Management System - Client** is a robust single-page application (SPA) designed to provide a comprehensive administrative dashboard for educational institutions. Built with **React** and **Vite**, it offers a seamless and responsive user experience for managing students, faculty, and administrative tasks.

The application integrates with the backend via RESTful APIs and utilizes **Role-Based Access Control (RBAC)** to ensure secure and appropriate access to features based on user roles (Admin, Student, Faculty).

## ✨ Key Features

*   **🔐 Authentication**
    *   Secure Login interface.
    *   JWT Integration with Access and Refresh Token rotation.
    *   Auto-redirects based on auth state.

*   **📊 Dashboard & Layout**
    *   **Responsive Sidebar:** Collapsible drawer that adapts to mobile and desktop screens.
    *   **Dynamic Header:** Displays current user role and provides quick logout access.
    *   **Interactive UI:** Powered by Ant Design components for a professional look and feel.

*   **👥 Admin Management**
    *   **Create Admin:** Complex forms with validation using Ant Design Form.
    *   **Admin List:** Data-rich tables with server-side pagination, filtering, and delete actions.

*   **👤 Profile System**
    *   **Real-time Data:** View and update profile information with immediate feedback.
    *   **Dynamic Loading:** Optimized data fetching using RTK Query.

*   **⚡ State Management**
    *   **Redux Toolkit & RTK Query:** Intelligent caching, automated re-fetching, and tag invalidation to keep the UI in sync with the backend.

## 🛠️ Tech Stack

*   **Core:** React.js, TypeScript, Vite
*   **State Management:** Redux Toolkit, RTK Query
*   **UI Library:** Ant Design (Layout, Tables, Forms, Modals)
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM (Protected Routes)
*   **Forms:** React Hook Form / Ant Design Form
*   **Icons:** Lucide React / Ant Design Icons

## 🚀 Installation & Run Steps

Follow these steps to set up the frontend locally.

### Prerequisites
*   Node.js (v18+ recommended)
*   npm or yarn

### 1. Navigate to Project Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will launch at `http://localhost:5173` (or the next available port).

## 🔑 Environment Variables

Create a `.env` file in the `frontend` root directory to configure the application.

> **Note:** Vite requires environment variables to be prefixed with `VITE_`.

```env
# Base URL for the Backend API
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## 📂 Folder Structure

A brief overview of the project structure within `src`:

```
src/
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable UI components
├── layout/         # Main layout wrappers (Sidebar, Header)
├── pages/          # Page components (Dashboard, Login, Admin Management)
├── redux/          # Redux setup (Slices, API definitions)
├── schemas/        # Zod validation schemas
├── services/       # API integration services (if separate from RTK Query)
├── types/          # TypeScript type definitions
├── App.tsx         # Main application component & Routing
└── main.tsx        # Entry point
```

---

