// middleware/authenticateJWT.js
import "../firebaseAdmin.js";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.js";

export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("Firebase token verification failed:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
