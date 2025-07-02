🚀 Todo List Backend

> **“This project is a part of a hackathon run by [katomaran.com](https://www.katomaran.com)"**

## 🧾 Overview

This is the **backend API** for the Todo List Management App built using **Node.js**, **Express**, **MongoDB**, and **Firebase Admin SDK**. It provides RESTful APIs for authentication, task management, task sharing, and real-time collaboration using **Socket.IO**.

---

## ✅ Features

- 🔐 User Authentication with Firebase (Google OAuth + JWT)
- ✅ Full CRUD APIs for managing tasks
- 🔄 Real-time task updates via WebSockets
- 👥 Share tasks with collaborators via email
- 🧠 Pagination, sorting, and filtering supported

---

## 🛠️ Tech Stack

| Purpose        | Technology               |
|----------------|---------------------------|
| Backend        | Node.js, Express.js        |
| Database       | MongoDB Atlas              |
| Auth           | Firebase Admin SDK + JWT   |
| Real-Time Comm | Socket.IO                  |
| Deployment     | Render                     |

---

## 📦 Prerequisites

- Node.js v16+
- MongoDB Atlas account
- Firebase project (for service account JSON)

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/todo-list-backend.git
cd todo-list-backend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Environment Variables
Create a .env file in the root directory with the following content:

env
Copy
Edit
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key_with_escaped_newlines
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=your_client_cert_url
🔐 Make sure to escape newlines in your private key (\n) and never commit the .env file.

4. Start the Server
bash
Copy
Edit
npm start
The API will be available at:
http://localhost:5000

🌐 Deployment on Render
DO NOT upload the Firebase service account JSON file directly.

Instead, convert the JSON to a single-line string and set it as environment variables in your Render dashboard.

Example usage in firebaseAdmin.js:

js
Copy
Edit
const admin = require('firebase-admin');
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
🔌 API Endpoints
Method	Endpoint	Description
POST	/api/auth/google	Authenticate user via Google OAuth
GET	/api/tasks	Fetch all tasks for logged-in user
POST	/api/tasks	Create a new task
PUT	/api/tasks/:id	Update a task
DELETE	/api/tasks/:id	Delete a task
POST	/api/tasks/:id/share	Share task with another user
GET	/api/tasks/shared	Fetch tasks shared with the user
GET	/api/tasks/stats	Get task summary stats (optional)

📁 Project Structure
bash
Copy
Edit
backend/
├── controllers/        # Route controllers
├── middleware/         # Auth and error handling
├── models/             # Mongoose schemas
├── routes/             # API endpoints
├── socket/             # Socket.IO real-time logic
├── utils/              # Helper functions
├── firebaseAdmin.js    # Firebase Admin setup
├── .env                # Environment variables (ignored)
├── server.js           # App entry point
└── README.md           # You're reading it :)
🧠 Architecture Diagram
Insert your app's architecture diagram here. You can create one using:

draw.io

excalidraw.com

Example:

pgsql
Copy
Edit
[Client (React)] --> [Express API] --> [MongoDB Atlas]
       |                   |
    Socket.IO           Firebase Admin
       |
   Real-Time Events


💡 Assumptions
Only Google OAuth was implemented for authentication.

User's email is used to identify and share tasks.

Creator has exclusive rights to update/delete a task, even when shared.

No admin roles or user registration flows—login is fully managed by Firebase.

All shared task updates reflect in real-time via Socket.IO.

🧪 Testing the API
You can test the API using:

Postman

Insomnia

Optional: You may include a Postman collection in your repo.

📄 License
MIT License

“This project is a part of a hackathon run by katomaran.com”
