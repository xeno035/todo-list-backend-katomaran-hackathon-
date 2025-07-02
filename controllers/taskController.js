import Task from "../models/Task.js";
import User from "../models/user.js";
import { getIO } from "../socket/index.js";
import mongoose from "mongoose";

// GET all tasks (with filters, pagination, sorting)
export const getTasks = async (req, res) => {
  console.log(`[GET] /api/tasks by user: ${req.user?.email || 'unknown'}`);
  const userId = req.user.mongoId;
  const {
    filter,
    priority,
    status,
    page = 1,
    limit = 10,
    sortBy = "dueDate",
    order = "asc"
  } = req.query;

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);

  const query = {
    $or: [{ createdBy: userId }, { sharedWith: userId }]
  };

  if (filter === "due-today") {
    query.dueDate = { $gte: today, $lt: tomorrow };
  } else if (filter === "overdue") {
    query.dueDate = { $lt: today };
    query.status = { $ne: "completed" };
  }

  if (priority) query.priority = priority;
  if (status) query.status = status;

  const sortOrder = order === "asc" ? 1 : -1;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const tasks = await Task.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
      tasks
    });
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// CREATE task
export const createTask = async (req, res) => {
  try {
    console.log(`[POST] /api/tasks by user: ${req.user?.email || 'unknown'}`);
    const task = await Task.create({
      ...req.body,
      createdBy: req.user.mongoId
    });
    // Emit real-time event
    getIO().emit("task-created", task);
    console.log('Task created:', task);
    res.status(201).json(task);
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// UPDATE task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!task.createdBy || String(task.createdBy) !== String(req.user.mongoId)) {
      return res.status(403).json({ message: "Only creator can modify" });
    }
    Object.assign(task, req.body);
    await task.save();
    getIO().emit("task-updated", task);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
};

// DELETE task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!task.createdBy || String(task.createdBy) !== String(req.user.mongoId)) {
      return res.status(403).json({ message: "Only creator can delete" });
    }
    await task.deleteOne();
    getIO().emit("task-deleted", { taskId: task._id });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};

// SHARE task
export const shareTask = async (req, res) => {
  const { id } = req.params;
  let { email } = req.body;
  try {
    email = email.toLowerCase(); // Always store in lowercase
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!task.collaborators.includes(email)) {
      task.collaborators.push(email);
      await task.save();
      console.log(`Added collaborator: ${email} to task: ${id}`);
      // Emit real-time event to the invited user
      getIO().to(email).emit("task-shared", task);
    } else {
      console.log(`Collaborator: ${email} already exists in task: ${id}`);
    }
    res.status(200).json({ message: "Task shared successfully" });
  } catch (err) {
    console.error("Error sharing task:", err);
    res.status(500).json({ message: err.message });
  }
};

// Mark as complete by collaborator
export const markTaskComplete = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const email = req.user.email;
    if (!task.collaborators.includes(email)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (!task.completedBy.includes(email)) {
      task.completedBy.push(email);
      await task.save();
    }
    res.json({ message: "Marked as completed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTaskStats = async (req, res) => {
  const userId = req.user.mongoId;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    console.log(`[GET] /api/tasks/stats by user: ${req.user?.email || 'unknown'}`);
    const [total, completed, pending, overdue] = await Promise.all([
      Task.countDocuments({ $or: [{ createdBy: userId }, { sharedWith: userId }] }),
      Task.countDocuments({ $or: [{ createdBy: userId }, { sharedWith: userId }], status: 'completed' }),
      Task.countDocuments({ $or: [{ createdBy: userId }, { sharedWith: userId }], status: { $in: ['pending', 'in-progress'] } }),
      Task.countDocuments({ $or: [{ createdBy: userId }, { sharedWith: userId }], dueDate: { $lt: today }, status: { $ne: 'completed' } })
    ]);
    res.json({ total, completed, pending, overdue });
  } catch (err) {
    console.error('Get Task Stats Error:', err);
    res.status(500).json({ message: 'Failed to fetch task statistics' });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.mongoId });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getSharedTasks = async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase();
    const userId = req.user.mongoId;
    const tasks = await Task.find({
      $or: [
        { collaborators: userEmail },
        { createdBy: userId }
      ]
    });
    console.log("Shared tasks for:", userEmail, "Count:", tasks.length);
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching shared tasks:", err);
    res.status(500).json({ message: "Error retrieving shared tasks" });
  }
};
