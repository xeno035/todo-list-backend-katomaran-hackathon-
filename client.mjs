// client.js
import { io } from "socket.io-client";

// Replace with your server URL
const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected to socket.io server:", socket.id);
});

socket.on("task-created", (task) => {
  console.log("📌 Task Created:", task);
});

socket.on("task-updated", (task) => {
  console.log("✏️ Task Updated:", task);
});

socket.on("task-deleted", (data) => {
  console.log("❌ Task Deleted:", data.taskId);
});

socket.on("task-shared", (info) => {
  console.log("🤝 Task Shared:", info);
});

socket.on("disconnect", () => {
  console.log("❎ Disconnected from server");
});
