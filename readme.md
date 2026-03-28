# 🚀 Cogniguard

<div align="center">

<!-- ![Cogniguard Logo](https://raw.githubusercontent.com/OmSinha07/Cogniguard_react/main/assets/cogniguard-logo.png) TODO: Add actual project logo to repo and update path -->

[![GitHub stars](https://img.shields.io/github/stars/OmSinha07/Cogniguard_react?style=for-the-badge)](https://github.com/OmSinha07/Cogniguard_react/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/OmSinha07/Cogniguard_react?style=for-the-badge)](https://github.com/OmSinha07/Cogniguard_react/network)
[![GitHub issues](https://img.shields.io/github/issues/OmSinha07/Cogniguard_react?style=for-the-badge)](https://github.com/OmSinha07/Cogniguard_react/issues)
[![GitHub license](https://img.shields.io/github/license/OmSinha07/Cogniguard_react?style=for-the-badge)](LICENSE) <!-- TODO: Add LICENSE file -->

**A secure, AI-powered web application for intelligent data classification and protected storage.**

<!-- [Live Demo](https://demo-link.com) <!-- TODO: Add live demo link if available --> 
<!-- [Documentation](https://docs-link.com) TODO: Add detailed documentation link if available --> 

</div> 

## 📖 Overview

Cogniguard is a full-stack web application designed to provide a robust and secure platform for managing and classifying data. It integrates a responsive React frontend with a powerful Python backend that handles secure authentication, adaptive cryptographic operations, file storage, and machine learning-driven data classification. This project aims to offer a comprehensive solution for users seeking both intelligent data insights and strong data protection.

## ✨ Features

- 🔐 **Secure User Authentication & Authorization**: Robust Flask-based authentication system with password hashing and JWT (JSON Web Token) for secure session management.
- 🛡️ **Adaptive Cryptographic Utilities**: Implements advanced and adaptive cryptographic techniques for data encryption and decryption, ensuring data confidentiality.
- 📂 **Secure File Storage Management**: Dedicated modules for securely storing and managing user files, integrated with key management.
- 🧠 **ML-Powered Data Classification**: Utilizes machine learning models (e.g., Scikit-learn) to classify uploaded data, providing intelligent insights and categorization.
- 🔑 **Key Management System**: Manages cryptographic keys securely, essential for the encryption/decryption processes.
- 🌐 **Responsive User Interface**: Built with React and TypeScript, offering an intuitive and dynamic user experience across various devices.
- 📡 **RESTful API**: A well-defined API layer in Python facilitates seamless communication between the frontend and backend services.

## 🖥️ Screenshots

<!-- TODO: Add actual screenshots of the application -->
<!-- Example:
![Login Page](assets/screenshots/login.png)
_Login Page_

![Dashboard with Classified Data](assets/screenshots/dashboard.png)
_Dashboard displaying classified data_

![File Upload Interface](assets/screenshots/upload.png)
_Interface for uploading and managing files_
-->

## 🛠️ Tech Stack

### Frontend

| Technology    | Badge                                                                                               |
| :------------ | :-------------------------------------------------------------------------------------------------- |
| React         | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) |
| TypeScript    | ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) |
| npm/Yarn      | ![NPM](https://img.shields.io/badge/npm-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) |
| Styling       | ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) |

### Backend

| Technology      | Badge                                                                                               |
| :-------------- | :-------------------------------------------------------------------------------------------------- |
| Python          | ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) |
| Flask           | ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white) |
| SQL Database    | ![SQL](https://img.shields.io/badge/SQL-025E8C?style=for-the-badge&logo=postgresql&logoColor=white) | <!-- Assumed relational DB with `models.py` -->
| PyJWT           | ![JWT](https://img.shields.io/badge/json%20web%20tokens-323741?style=for-the-badge&logo=json-web-tokens&logoColor=white) |
| scikit-learn    | ![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white) |
| Cryptography    | ![Cryptography](https://img.shields.io/badge/cryptography-61DAFB?style=for-the-badge&logo=python&logoColor=white) | <!-- Representation for `cryptography` library -->

## 🚀 Quick Start

Follow these steps to set up and run Cogniguard locally on your machine.

### Prerequisites

Ensure you have the following installed:

-   **Python** (version 3.8 or higher recommended)
-   **Node.js** (version 18 or higher recommended) & **npm** (comes with Node.js) or **Yarn**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/OmSinha07/Cogniguard_react.git
    cd Cogniguard_react
    ```

2.  **Set up the Backend**
    Navigate to the project root directory (Cogniguard_react).
    ```bash
    # Create a virtual environment
    python -m venv venv
    source venv/bin/activate # On Windows: .\venv\Scripts\activate

    # Install Python dependencies
    pip install -r requirements.txt
    ```

3.  **Set up the Frontend**
    Navigate into the `Cogniguard_frontend` directory.
    ```bash
    cd Cogniguard_frontend

    # Install Node.js dependencies
    npm install # or yarn install
    ```

### Environment Setup

Create `.env` files for both the backend and frontend to configure essential variables.

1.  **Backend Environment (`.env` in `Cogniguard_react` root)**
    Create a file named `.env` in the root of the `Cogniguard_react` directory:
    ```ini
    SECRET_KEY='your_super_secret_key_for_flask' # Change this to a strong, random key
    JWT_SECRET_KEY='your_jwt_secret_key' # Change this to a strong, random key for JWT
    DATABASE_URL='sqlite:///cogniguard.db' # Or your PostgreSQL/MySQL connection string
    FILE_STORAGE_PATH='./uploads' # Path to store uploaded files
    ML_MODEL_PATH='./ml_models/model.pkl' # Path to your ML model file
    FLASK_ENV='development'
    CORS_ORIGIN='http://localhost:3000' # Or your frontend's actual origin
    ```
    *Ensure `FILE_STORAGE_PATH` and `ML_MODEL_PATH` directories exist or are created by the application.*

2.  **Frontend Environment (`.env` in `Cogniguard_frontend` directory)**
    Create a file named `.env` in the `Cogniguard_frontend` directory:
    ```ini
    VITE_API_BASE_URL='http://localhost:5000' # Or your backend's actual URL
    VITE_APP_NAME='Cogniguard'
    ```
    *Note: For Create React App, variables are `REACT_APP_...` instead of `VITE_...`.*

### Database Setup (for Backend)

If using a relational database, you might need to initialize it and run migrations.

```bash
# From the Cogniguard_react root directory
# For SQLAlchemy/Flask-SQLAlchemy, run your migration commands if applicable.
# Example with Flask-Migrate (if installed):
# flask db init
# flask db migrate -m "Initial migration"
# flask db upgrade
```
*If using SQLite (default in the example `.env`), the database file `cogniguard.db` will be created automatically on first run.*

### Start Development Servers

1.  **Start the Backend API**
    Navigate to the `Cogniguard_react` root directory and activate your virtual environment if not already active.
    ```bash
    # Ensure virtual environment is active
    source venv/bin/activate
    python app_with_auth.py
    ```
    The backend API will typically run on `http://localhost:5000`.

2.  **Start the Frontend Application**
    Navigate to the `Cogniguard_frontend` directory.
    ```bash
    cd Cogniguard_frontend
    npm run dev # or yarn dev, or npm start
    ```
    The frontend application will typically open in your browser at `http://localhost:5173`.

## 📁 Project Structure

```
Cogniguard_react/
├── .gitignore
├── app_with_auth.py        # Main Flask application with routes and authentication
├── auth.py                 # Authentication and authorization logic
├── crypto_utils.py         # Cryptographic utility functions
├── crypto_utils_adaptive.py # Adaptive cryptographic algorithms
├── file_storage.py         # Functions for secure file storage
├── key_storage.py          # Functions for managing cryptographic keys
├── ml_classifier.py        # Machine learning model for data classification
├── models.py               # Database models (e.g., User, File, MLResult)
├── requirements.txt        # Python backend dependencies
├── .env                    # Backend environment variables (local)
├── Cogniguard_frontend/    # React frontend application
│   ├── public/             # Static assets
│   ├── src/                # Frontend source code
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Application pages (e.g., Login, Dashboard, Upload)
│   │   ├── hooks/          # Custom React hooks (if used)
│   │   ├── utils/          # Frontend utility functions
│   │   ├── services/       # API integration services
│   │   ├── styles/         # Styling files (CSS/SCSS/Tailwind)
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Entry point for the React application
│   ├── .env                # Frontend environment variables (local)
│   ├── package.json        # Node.js dependencies and scripts for frontend
│   └── tsconfig.json       # TypeScript configuration for frontend
└── readme.md
```

## ⚙️ Configuration

### Environment Variables

Both the backend and frontend use `.env` files for configuration. Make sure to set them up as described in the [Environment Setup](#environment-setup) section.

| Variable (Backend)  | Description                                     | Default         | Required |
| :------------------ | :---------------------------------------------- | :-------------- | :------- |
| `SECRET_KEY`        | Flask application's secret key                  | (random string) | Yes      |
| `JWT_SECRET_KEY`    | Secret key for signing JWTs                     | (random string) | Yes      |
| `DATABASE_URL`      | Database connection string                      | `sqlite:///cogniguard.db` | Yes |
| `FILE_STORAGE_PATH` | Directory where files will be stored            | `./uploads`     | Yes      |
| `ML_MODEL_PATH`     | Path to the serialized ML model file            | `./ml_models/model.pkl` | Yes |
| `FLASK_ENV`         | Flask environment (`development`/`production`)  | `development`   | No       |
| `CORS_ORIGIN`       | URL of the allowed frontend origin for CORS     | `http://localhost:5173` | Yes |

| Variable (Frontend) | Description                                     | Default         | Required |
| :------------------ | :---------------------------------------------- | :-------------- | :------- |
| `VITE_API_BASE_URL` | Base URL of the backend API                     | `http://localhost:5000` | Yes |
| `VITE_APP_NAME`     | Name of the application                         | `Cogniguard`    | No       |

## 🔧 Development

### Available Scripts (Frontend - `Cogniguard_frontend/package.json`)

| Command       | Description                                  |
| :------------ | :------------------------------------------- |
| `npm run dev` | Starts the development server                |
| `npm run build` | Builds the app for production                |
| `npm run lint` | Lints code for errors and style issues       |
| `npm run preview` | Serves the production build locally        |

### Development Workflow

-   Make changes in the `Cogniguard_frontend/src` for the frontend.
-   Make changes in the Python files in the `Cogniguard_react` root for the backend.
-   The frontend development server typically provides hot-reloading.
-   Changes to the backend Python files require restarting the `python app_with_auth.py` process to take effect.

## 🧪 Testing

### Backend Testing (Python)

To run tests for the Python backend (if test files are implemented using `pytest` or `unittest`):

```bash
# From Cogniguard_react root directory
# Ensure virtual environment is active: source venv/bin/activate
pytest # If pytest is installed and tests are in a 'tests' directory
```
<!-- TODO: Add specific test commands if a testing framework is detected in requirements.txt or test files exist -->

### Frontend Testing (React)

To run tests for the React frontend (if test files are implemented using `@testing-library/react` and `vitest` or `jest`):

```bash
# From Cogniguard_frontend directory
npm test # or yarn test
```
<!-- TODO: Add specific test commands if a testing framework is detected in package.json or test files exist -->

## 🚀 Deployment

### Production Build (Frontend)

To create a production-ready build of the React application:

```bash
cd Cogniguard_frontend
npm run build
```
This will generate optimized static assets in the `Cogniguard_frontend/dist` (or `build`) directory.

### Deployment Options

-   **Backend (Python Flask API)**:
    -   Can be deployed using `gunicorn` or `uwsgi` for production, behind a reverse proxy like Nginx or Apache.
    -   Containerization with Docker is a common approach for deployment to cloud platforms (AWS, GCP, Azure).
    -   Platform-as-a-Service (PaaS) providers like Heroku, Render, or Google App Engine.
-   **Frontend (React)**:
    -   The `build` output can be served by any static file host (Nginx, Apache, Netlify, Vercel, AWS S3 + CloudFront).
    -   Can be served from the same server as the backend, or completely separate.

<!-- TODO: If Dockerfile is present, add Docker deployment instructions. -->

## 📚 API Reference

The Python backend provides a RESTful API to interact with the application's core functionalities.

### Authentication

API authentication is handled via **JSON Web Tokens (JWT)**.
-   Users register (`/api/register`) and log in (`/api/login`) to receive a JWT.
-   This token must be included in the `Authorization` header as a `Bearer` token for protected routes.

### Endpoints

(Below are inferred endpoints based on file analysis; actual endpoints depend on `app_with_auth.py` implementation)

| HTTP Method | Endpoint                       | Description                               | Authentication |
| :---------- | :----------------------------- | :---------------------------------------- | :------------- |
| `POST`      | `/api/register`                | Register a new user                       | None           |
| `POST`      | `/api/login`                   | Authenticate user and get JWT             | None           |
| `GET`       | `/api/user/profile`            | Retrieve current user's profile           | Required       |
| `POST`      | `/api/files/upload`            | Upload a file for processing/storage      | Required       |
| `GET`       | `/api/files/<file_id>`         | Retrieve a specific file (encrypted)      | Required       |
| `GET`       | `/api/files/classified`        | Get classified data or files              | Required       |
| `POST`      | `/api/data/classify`           | Send data for ML classification           | Required       |
| `POST`      | `/api/keys/generate`           | Generate new encryption keys              | Required       |
| `GET`       | `/api/keys/revoke/<key_id>`    | Revoke an existing encryption key         | Required       |
| `GET`       | `/api/logout`                  | Invalidate user session (backend)         | Required       |

## 🤝 Contributing

We welcome contributions to Cogniguard! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`.
3.  Make your changes.
4.  Commit your changes: `git commit -m 'feat: Add new feature'`.
5.  Push to your forked repository: `git push origin feature/your-feature-name`.
6.  Open a Pull Request to the `main` branch of this repository.

Please ensure your code adheres to the project's coding style and includes appropriate tests.

### Development Setup for Contributors

Follow the [Quick Start](#quick-start) guide to get the development environment running.

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details. <!-- TODO: Create a LICENSE file with MIT license content -->

## 🙏 Acknowledgments

-   **Python Community**: For a versatile language and extensive libraries.
-   **React Community**: For an excellent UI library.
-   **Flask Framework**: For providing a lightweight and powerful backend.
-   **Scikit-learn**: For machine learning functionalities.
-   **`cryptography` library**: For secure cryptographic primitives.
-   [OmSinha07](https://github.com/OmSinha07) for initiating this project.

## 📞 Support & Contact

-   📧 Email: [omsinha.dev@example.com] <!-- TODO: Add actual contact email -->
-   🐛 Issues: [GitHub Issues](https://github.com/OmSinha07/Cogniguard_react/issues)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [OmSinha07](https://github.com/OmSinha07)

</div>