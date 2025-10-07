# E-Government Citizen Services Portal

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

An advanced Full-Stack web application designed to digitize and streamline government services for citizens. This project allows users to apply for various government services online, track their application status, and receive notifications, eliminating the need for physical visits to government offices.

This is a capstone project built with a modern technology stack, featuring a complete backend API and a dynamic, responsive frontend.

---

## Table of Contents

- [ Features](#-features)
- [ Technology Stack](#️-technology-stack)
- [ Live Demo](#-live-demo)
- [ Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [ Usage](#-usage)

---

## Features

This portal is designed with three distinct user roles, each with its own dedicated dashboard and functionalities:

### Citizen Features

- **Authentication:** Secure user registration and login.
- **Dashboard:** A central hub to view and track all submitted applications.
- **New Service Request:** An intuitive form to apply for new services, with support for document uploads.
- **Request Tracking:** Real-time status updates for all applications (Submitted, Under Review, Approved, Rejected).
- **Notifications:** In-app notifications for status changes on requests.

### Officer Features

- **Secure Login:** Role-based access for government employees.
- **Department-Specific Dashboard:** View and manage a queue of requests belonging only to their department.
- **Request Processing:** Review application details, download submitted documents, and approve or reject requests.
- **Search & Filter:** Powerful tools to search and filter requests by citizen name or status.

### Admin Features

- **Admin Dashboard:** A high-level overview and central management panel.
- **User Management:** Full CRUD (Create, Read, Update, Delete) capabilities for all system users.
- **Department Management:** Full CRUD for government departments.
- **Service Management:** Full CRUD for available government services.
- **System Reports:** View detailed statistics on requests, approval/rejection rates, and total revenue.

### General Features

- **Dark/Light Mode:** User-friendly theme toggling for better accessibility, with settings saved locally.
- **Multilingual Support:** Seamlessly switch between English and Persian (فارسی).
- **Responsive Design:** A clean and modern UI that works on all devices (desktops, tablets, and mobile).

---

## Technology Stack

This project is a full-stack application built with the following technologies:

- **Frontend:**

  - **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
  - **[Vite](https://vitejs.dev/)**: A blazing-fast frontend build tool.
  - **[React Router](https://reactrouter.com/)**: For client-side routing and navigation.
  - **[Axios](https://axios-http.com/)**: For making HTTP requests to the backend API.
  - **[Bootstrap](https://getbootstrap.com/)**: For responsive design and pre-built UI components.

- **Backend:**
  - **[Node.js](https://nodejs.org/)**: A JavaScript runtime for the server-side.
  - **[Express.js](https://expressjs.com/)**: A minimal and flexible Node.js web application framework.
  - **[PostgreSQL](https://www.postgresql.org/)**: A powerful, open-source object-relational database system.
  - **[JWT (JSON Web Tokens)](https://jwt.io/)**: For secure, cookie-based authentication.
  - **[Bcrypt.js](https://www.npmjs.com/package/bcryptjs)**: For hashing user passwords.
  - **[Multer](https://www.npmjs.com/package/multer)**: For handling file uploads in memory.
- **File Storage & Deployment:**
  - **[Uploadcare](https://uploadcare.com/)**: Cloud-based file storage and delivery for handling document uploads.
  - **[Render](https://render.com/)**: Cloud platform for deploying the full-stack application and PostgreSQL database.

---

## 🌐 Live Demo

You can access the live version of the portal here:

**Frontend URL:** [https://egov-portal-frontend-33b6.onrender.com](https://egov-portal-frontend-33b6.onrender.com)
**Backend API URL:** [https://egov-portal-backend-y3tx.onrender.com](https://egov-portal-backend-y3tx.onrender.com)

**Sample Login Credentials:**
(Please use the registration form to create your own `citizen` account for the best experience. The accounts below are for demonstration.)

- **Admin:** `admin@gmail.com` / `123`
- **Officer:** `officer@gmail.com` / `123`
- **Citizen:** `citizen@gmail.com` / `123`

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (v18 or newer)
- [npm](https://www.npmjs.com/get-npm)
- [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Somaiyanoori/egov_portal.git
    cd egov_portal
    ```

2.  **Setup the Backend:**

    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create a .env file and fill in your database and Uploadcare API keys
    # You can copy the structure from the provided .env.example file.

    # Setup the database
    # Connect to your local PostgreSQL instance and run the script located at /schema.sql

    # Start the server
    npm start
    ```

    The backend server will be running at `http://localhost:3012`.

3.  **Setup the Frontend:**

    ```bash
    # Navigate to the frontend directory from the root
    cd frontend

    # Install dependencies
    npm install

    # Start the development server
    npm run dev
    ```

    The frontend will be available at `http://localhost:5173`.

---

## 🚀 Usage

Once both servers are running, open your browser and navigate to `http://localhost:5173`. You can register a new citizen account or use the sample credentials provided above to log in and explore the different roles.

**Enjoy the portal!**
