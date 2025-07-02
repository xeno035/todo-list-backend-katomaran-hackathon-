import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./socket/index.js";
import taskRoutes from "./routes/taskRoutes.js";

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

app.use("/api/tasks", taskRoutes); 

// Create HTTP server (required for socket.io)
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  initSocket(server); // 🔌 Initialize Socket.IO
});
