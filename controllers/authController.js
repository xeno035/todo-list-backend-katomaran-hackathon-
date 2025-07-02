import { getAuth } from "firebase-admin/auth";
import User from "../models/user.js";

export const googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    console.log(`[POST] /api/auth/google`);
    const decodedToken = await getAuth().verifyIdToken(token);
    const { email, name, picture, uid } = decodedToken;

    // Upsert user in MongoDB
    let user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        firebaseUid: uid,
        name,
        email,
        avatar: picture,
        provider: "google.com"
      },
      { new: true, upsert: true }
    );
    console.log('User upserted:', user);

    res.json({ 
      message: "Authentication successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (err) {
    console.error("[ERROR] /api/auth/google:", err);
    res.status(401).json({ message: "Invalid Firebase token" });
  }
};