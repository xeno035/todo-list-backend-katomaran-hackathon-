import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: String,
  email: String,
  avatar: String,
  provider: String
});

export default mongoose.model("User", userSchema);
