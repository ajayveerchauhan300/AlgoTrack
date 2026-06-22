import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    codeforcesHandle: { type: String, default: "" },
    leetcodeUsername: { type: String, default: "" },
    dailyGoal: { type: Number, default: 5 },
    weeklyGoal: { type: Number, default: 30 },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
