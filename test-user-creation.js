// Test script to verify user creation logic
import { connectDB } from "./config/db.js";
import User from "./models/user.js";

const testUserCreation = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Test user data (simulating Firebase token data)
    const testUserData = {
      firebaseUid: "test_firebase_uid_123",
      name: "Test User",
      email: "test@example.com",
      avatar: "https://example.com/avatar.jpg"
    };

    // Test the upsert logic
    const user = await User.findOneAndUpdate(
      { firebaseUid: testUserData.firebaseUid },
      {
        firebaseUid: testUserData.firebaseUid,
        name: testUserData.name,
        email: testUserData.email,
        avatar: testUserData.avatar,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("✅ User created/updated successfully:", {
      id: user._id,
      firebaseUid: user.firebaseUid,
      name: user.name,
      email: user.email
    });

    // Test finding the user
    const foundUser = await User.findOne({ firebaseUid: testUserData.firebaseUid });
    console.log("✅ User found in database:", foundUser ? "Yes" : "No");

    // Clean up - remove test user
    await User.deleteOne({ firebaseUid: testUserData.firebaseUid });
    console.log("✅ Test user cleaned up");

    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
};

testUserCreation(); 