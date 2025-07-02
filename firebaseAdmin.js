import admin from "firebase-admin";

const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
  throw new Error("Missing Firebase Admin credentials in environment variables");
}

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: FIREBASE_PROJECT_ID,
    private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: FIREBASE_CLIENT_EMAIL,
  }),
});

export default admin;
