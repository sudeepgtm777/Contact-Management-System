#  Contact Management App

A full-stack Contact Management Application built with React (frontend) and Express + MongoDB (backend).
It allows users to register, logIn, and manage their personal contacts securely.

---

##  Tech Stack

###  Frontend

- React
- Tailwind CSS
- Axios
- React Router
- Environment Variables via .env

###  Backend

- Node.js + Express
- MongoDB (via Mongoose)
- JWT Authentication
- CORS for secure cross-origin requests

---

##  Project Structure


```contact-managment-system
contact-management-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── config.env
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── app.js
│   └── package.json
└── README.md

---

##  Backend Setup

1️⃣ Clone the Repository
git clone https://github.com/sudeepgtm777/Contact-Management-System.git

2️⃣ Install Dependencies
Open termial

cd backend
npm install

3️⃣ Environment Variables
Create a .env file in /backend/config/config.env file with:

PORT=3000
DATABASE=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d

4️⃣ Run the Server

In backend terminal
npm run dev

Server will start on:
http://localhost:3000

---

## 🔗 API Endpoints

### 🔐 Authentication

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | /api/auth/register   | Register a new user        |
| POST   | /api/auth/login      | Login existing user        |
| GET    | /api/auth/logout     | Logout user                |
| GET    | /api/auth/isLoggedIn | Check if user is logged in |

### 👤 Users

| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| GET    | /api/users/    | Get all users   |
| GET    | /api/users/:id | Get single user |
| PUT    | /api/users/:id | Update user     |

### 📞 Contacts

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| POST   | /api/contacts/     | Create new contact             |
| GET    | /api/contacts/     | Get all contacts               |
| GET    | /api/contacts/user | Get contacts of logged-in user |
| GET    | /api/contacts/:id  | Get single contact             |
| PUT    | /api/contacts/:id  | Update contact                 |
| DELETE | /api/contacts/:id  | Delete contact                 |
| DELETE | /api/contacts/bulk | Delete multiple contacts       |

---

##  Frontend Setup
Open new terminal

1️⃣ Navigate to the Frontend
cd frontend

2️⃣ Install Dependencies
npm install

4️⃣ Run the Frontend
npm run dev

App runs at:
http://localhost:5173

---

## 🔐 Authentication Flow

1. User registers → stored in MongoDB with encrypted password
2. User logs in → receives JWT token
3. JWT is stored in localStorage/cookies
4. Protected routes (contacts CRUD) require valid JWT
5. User logs out → JWT invalidated/removed

---

## 🌍 Deployment

Both frontend and backend are deployed on Render.

### Backend

- Add environment variables in Render Dashboard.
- Deploy from GitHub or manual build.

### Frontend

- Set environment variable:

---

## 🧪 Scripts

### Frontend

| Command         | Description              |
| --------------- | ------------------------ |
| npm run dev     | Run dev server           |
| npm run build   | Build production app     |
| npm run preview | Preview production build |

### Backend

| Command     | Description              |
| ----------- | ------------------------ |
| npm run dev | Start development server |
| npm start   | Run production server    |

---

##  Middleware Used

- cors – Enable cross-origin requests
- express.json() – Parse incoming JSON
- morgan (optional) – Request logging
- JWT verification middleware – Protect routes

---

##  Features

 User registration & login
 JWT-based authentication
 Add, edit, delete, and list contacts
 Get all contacts for a logged-in user
 Responsive UI with Tailwind CSS
 RESTful API architecture
 Deployed backend & frontend on Render

---

## 🧑 Author

Sudeep Gautam


