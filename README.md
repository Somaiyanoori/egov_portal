# E-Government Citizen Services Portal

![Project Banner](https://via.placeholder.com/1200x300.png?text=E-Government+Services+Portal)

An advanced Full-Stack web application designed to digitize and streamline government services for citizens. This project allows users to apply for various government services online, track their application status, and receive notifications, eliminating the need for physical visits to government offices.

This is a capstone project built with a modern technology stack, featuring a complete backend API and a dynamic, responsive frontend.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Live Demo](#-live-demo)
- [🏁 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [⚙️ Usage](#️-usage)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

This portal is designed with three distinct user roles, each with its own dedicated dashboard and functionalities:

### 👤 Citizen Features

- **Authentication:** Secure user registration and login.
- **Dashboard:** A central hub to view and track all submitted applications.
- **New Service Request:** An intuitive form to apply for new services, including document uploads.
- **Request Tracking:** Real-time status updates for all applications (Submitted, Under Review, Approved, Rejected).
- **Notifications:** In-app notifications for status changes on requests.
- **Profile Management:** (Future Scope) Ability to view and update personal information.

### 👮 Officer Features

- **Secure Login:** Role-based access for government employees.
- **Dashboard:** View and manage a queue of pending requests specific to their department.
- **Request Processing:** Review application details, download submitted documents, and approve or reject requests.
- **Search & Filter:** Powerful tools to search and filter requests by citizen name, status, or date.

### 👑 Admin Features

- **Admin Dashboard:** A high-level overview and central management panel.
- **User Management:** Full CRUD (Create, Read, Update, Delete) capabilities for all system users (citizens, officers, admins).
- **Department Management:** Manage government departments.
- **Service Management:** Add, edit, or disable available government services.
- **System Reports:** View detailed statistics, including the number of requests per department, approval/rejection rates, and total revenue from service fees.

### 🌐 General Features

- **Dark/Light Mode:** User-friendly theme toggling for better accessibility.
- **Multilingual Support:** Switch between English and Persian (فارسی) on the fly.
- **Responsive Design:** A clean and modern UI that works seamlessly on all devices (desktops, tablets, and mobile).

---

## 🛠️ Technology Stack

This project is a full-stack application built with the following technologies:

- **Frontend:**

  - **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
  - **[Vite](https://vitejs.dev/)**: A blazing-fast frontend build tool.
  - **[React Router](https://reactrouter.com/)**: For client-side routing and navigation.
  - **[Axios](https://axios-http.com/)**: For making HTTP requests to the backend API.
  - **[Bootstrap](https://getbootstrap.com/)**: For responsive design and pre-built UI components.
  - **CSS3**: For custom styling and modern themes.

- **Backend:**

  - **[Node.js](https://nodejs.org/)**: A JavaScript runtime for the server-side.
  - **[Express.js](https://expressjs.com/)**: A minimal and flexible Node.js web application framework.
  - **[PostgreSQL](https://www.postgresql.org/)**: A powerful, open-source object-relational database system.
  - **[JWT (JSON Web Tokens)](https://jwt.io/)**: For secure authentication and session management.
  - **[Bcrypt.js](https://www.npmjs.com/package/bcryptjs)**: For hashing passwords.
  - **[Multer](https://www.npmjs.com/package/multer)**: For handling file uploads.

- **Database:**
  - **PostgreSQL**

---

## 🚀 Live Demo

You can access the live version of the portal here:

**Frontend URL:** `[Your Live Frontend URL, e.g., https://egov-frontend-app.onrender.com]`
**Backend API URL:** `[Your Live Backend URL, e.g., https://egov-backend-service.onrender.com]`

**Sample Login Credentials:**

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

1.  **Clone the repositories:**

    ```bash
    # Clone the backend
    git clone [Your Backend Repo URL]
    cd egov-backend

    # Clone the frontend
    git clone [Your Frontend Repo URL]
    cd egov-frontend
    ```

2.  **Setup the Backend:**

    ```bash
    # Navigate to the backend directory
    cd egov-backend

    # Install dependencies
    npm install

    # Create a .env file based on .env.example and fill in your database details
    cp .env.example .env

    # Setup the database
    # Connect to your PostgreSQL instance and run the script located at /database/schema.sql

    # Start the server
    npm start
    ```

    The backend server will be running at `http://localhost:3012`.

3.  **Setup the Frontend:**

    ```bash
    # Navigate to the frontend directory
    cd frontend

    # Install dependencies
    npm install

    # Start the development server
    npm run dev
    ```

    The frontend will be available at `http://localhost:5173`.

---

## Usage

Once both servers are running, open your browser and navigate to `http://localhost:5173`. You can register a new citizen account or use the sample credentials provided in the [Live Demo](#-live-demo) section to log in and explore the different roles.

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page]([Your Repo Issues URL]).

---

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
