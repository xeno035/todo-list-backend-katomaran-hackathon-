import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  shareTask,
  getTaskStats,
  getTaskById,
  getMyTasks,
  getSharedTasks,
  markTaskComplete
} from "../controllers/taskController.js";

import { authenticateJWT } from "../middleware/authenticateJWT.js";

import { body } from "express-validator";
import { validateTask } from "../middleware/validate.js";

const router = express.Router();

// ✅ Apply authentication middleware only once
router.use(authenticateJWT);

// ✅ Route definitions
router.get("/", getTasks);

router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("dueDate").optional().isISO8601().toDate(),
    validateTask
  ],
  createTask
);

router.put(
  "/:id",
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("dueDate").optional().isISO8601().toDate(),
    validateTask
  ],
  updateTask
);

router.delete("/:id", deleteTask);

router.post("/share/:id", shareTask);

router.get("/stats", getTaskStats);

router.get("/:id", getTaskById);

router.get("/my", getMyTasks);
router.get("/shared", getSharedTasks);

router.post("/:id/complete", markTaskComplete);

export default router;
