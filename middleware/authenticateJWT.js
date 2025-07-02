// middleware/authenticateJWT.js
import admin from 'firebase-admin';
import serviceAccount from '../firebase-service-account.json' assert { type: "json" };
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.js";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    
    // 🔁 Sync user to MongoDB
    const { uid, name, email, picture } = decodedToken;
    
    console.log("Saving user to DB:", { uid, name, email, picture });
    
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        firebaseUid: uid,
        name,
        email,
        avatar: picture,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    console.log("User saved/updated in MongoDB:", user._id);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      mongoId: user._id
    };
    next();
  } catch (err) {
    console.error("Firebase token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
