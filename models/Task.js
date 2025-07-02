import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  dueDate: Date,
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  collaborators: [{ type: String }], // array of collaborator emails
  completedBy: [{ type: String }]    // emails of collaborators who completed the task
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
