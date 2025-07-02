import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(cors());
app.use(express.json());

app.use("/api/", apiLimiter);

app.get("/ping", (req, res) => {
  res.send("pong");
});


export default app;
