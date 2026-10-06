# 🎓 StudentHub --- Student Management REST API

A full-stack **Student Management System** built with **FastAPI, SQLite,
HTML, CSS, and JavaScript**. It provides a web interface for complete
CRUD operations on student records through a REST API.

## 🌐 Live Demo

**Frontend:** https://studenthub-frontend-clb5.onrender.com

**Backend API:** https://studenthub-fastapi-crud.onrender.com

**API Documentation:** https://studenthub-fastapi-crud.onrender.com/docs

## ✨ Features

-   Add, view, update, and delete student records
-   Email uniqueness validation
-   Frontend form validation
-   RESTful FastAPI backend
-   Interactive Swagger/OpenAPI documentation
-   SQLite database
-   Clean web interface
-   Separate frontend and backend deployment on Render

## 🛠️ Tech Stack

**Frontend:** HTML5, CSS3, JavaScript

**Backend:** Python, FastAPI, Uvicorn, Pydantic

**Database:** SQLite

**Tools & Deployment:** Git, GitHub, Render

## 📁 Project Structure

``` text
StudentHub/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── students.db
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
└── .gitignore
```

`students.db` is ignored by Git using `*.db` in `.gitignore`.

## 🔌 REST API Endpoints

  Method   Endpoint                   Description
  -------- -------------------------- ----------------------
  GET      `/`                        API welcome message
  GET      `/students`                Get all students
  GET      `/students/{student_id}`   Get a student by ID
  POST     `/students`                Create a new student
  PUT      `/students/{student_id}`   Update a student
  DELETE   `/students/{student_id}`   Delete a student

### Student Data

``` json
{
  "name": "Sudarshan",
  "email": "sudarshan@example.com",
  "course": "AIML",
  "year": 4
}
```

## 🚀 Run Locally

### 1. Clone the repository

``` bash
git clone https://github.com/Sudarshan-47/StudentHub-FastAPI-CRUD.git
cd StudentHub-FastAPI-CRUD
```

### 2. Create a virtual environment

``` bash
python -m venv venv
```

On Windows PowerShell:

``` powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install backend dependencies

``` bash
cd backend
pip install -r requirements.txt
```

### 4. Start FastAPI

``` bash
python -m uvicorn main:app --reload
```

API:

``` text
http://127.0.0.1:8000
```

Swagger docs:

``` text
http://127.0.0.1:8000/docs
```

### 5. Run the frontend

Open `frontend/index.html` with a local static server such as VS Code
Live Server.

For local backend development, set this in `frontend/app.js`:

``` javascript
const API_URL = "http://127.0.0.1:8000";
```

For deployment, use the Render backend URL.

## ☁️ Deployment

### Backend --- Render Web Service

-   Root directory: `backend`
-   Build command: `pip install -r requirements.txt`
-   Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend --- Render Static Site

-   Root directory: `frontend`
-   Build command: none
-   Publish directory: `.`

## 🧠 What This Project Demonstrates

-   REST API design
-   FastAPI development
-   GET, POST, PUT, and DELETE methods
-   CRUD operations
-   Pydantic request validation
-   SQLite database operations
-   CORS configuration
-   Frontend-to-backend API communication
-   Git/GitHub version control
-   Cloud deployment with Render
-   Swagger/OpenAPI documentation

## 🔄 Application Flow

``` text
User
  ↓
HTML / CSS / JavaScript Frontend
  ↓
HTTP Request
  ↓
FastAPI REST API
  ↓
SQLite Database
  ↓
HTTP Response
  ↓
Frontend UI
```

## ⚠️ Current Limitation

The current version uses SQLite. The Render deployment is intended as a
learning/demo deployment, so SQLite should not be treated as a durable
production database for important data.

A future production version can migrate to PostgreSQL.

## 🔮 Future Improvements

-   PostgreSQL database
-   Authentication and authorization
-   Search and filtering
-   Pagination
-   Student profiles
-   Admin dashboard
-   Automated tests
-   Docker support
-   CI/CD pipeline
-   Custom domain

## 👨‍💻 Author

**Sudarshan Pesingi**

GitHub: https://github.com/Sudarshan-47

## 📄 License

This project is available for educational and portfolio purposes.
