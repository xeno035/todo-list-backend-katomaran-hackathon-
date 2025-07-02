# Todo List Backend

This is the backend API for the Todo List application, built with Node.js, Express, MongoDB, and Firebase Admin SDK for authentication.

## Features
- User authentication (JWT, Firebase)
- Task CRUD operations
- Task sharing and collaboration
- Real-time updates with Socket.IO

## Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)
- Firebase project (for service account credentials)

## Setup

1. **Clone the repository:**
   ```sh
   git clone <your-backend-repo-url>
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file (if needed) for MongoDB URI and other secrets.

4. **Firebase Service Account:**
   - Download your `firebase-service-account.json` from the Firebase Console (Project Settings > Service Accounts > Generate new private key).
   - Place it in the `backend` directory.
   - **Add `firebase-service-account.json` to `.gitignore`!**

5. **Start the server:**
   ```sh
   npm start
   ```

## Deployment (Render or Other Cloud Hosts)

- **Do NOT upload your service account file.**
- Instead, add your service account JSON as an environment variable named `FIREBASE_SERVICE_ACCOUNT` in your Render dashboard.
- Update your code to use:
  ```js
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  ```

## API Endpoints
- `/api/auth/*` - Authentication routes
- `/api/tasks/*` - Task CRUD and sharing
- `/api/tasks/shared` - Get tasks shared with the user

## License
MIT 