import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticateToken, JWT_SECRET } from "../middleware/auth.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Please enter all required fields" });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "30d" },
    );

    const userObj = newUser.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    userWithoutPassword.id = userObj._id; // Ensure client uses 'id' instead of '_id'
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message || "Registration failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Please enter email and password" });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "30d",
    });

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    userWithoutPassword.id = userObj._id;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message || "Login failed" });
  }
});

// GET PROFILE
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    userWithoutPassword.id = userObj._id;

    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// UPDATE PROFILE & HANDLES & GOALS
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, codeforcesHandle, leetcodeUsername, dailyGoal, weeklyGoal } =
      req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (codeforcesHandle !== undefined)
      updates.codeforcesHandle = codeforcesHandle.trim();
    if (leetcodeUsername !== undefined)
      updates.leetcodeUsername = leetcodeUsername.trim();
    if (dailyGoal !== undefined) updates.dailyGoal = Number(dailyGoal) || 5;
    if (weeklyGoal !== undefined) updates.weeklyGoal = Number(weeklyGoal) || 30;

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    userWithoutPassword.id = userObj._id;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
