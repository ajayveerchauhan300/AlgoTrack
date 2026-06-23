/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Config & Database
import { connectDB } from "./config/db.js";

// Routes
import authRouter from "./routes/auth.js";
import statsRouter from "./routes/stats.js";
import compareRouter from "./routes/compare.js";
import contestsRouter from "./routes/contests.js";
import mentorRouter from "./routes/mentor.js";
import codeReviewRouter from "./routes/codeReview.js";

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", authRouter);
app.use("/api/user", statsRouter);
app.use("/api/compare", compareRouter);
app.use("/api/contests", contestsRouter);
app.use("/api/ai", mentorRouter);
app.use("/api/ai", codeReviewRouter);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AlgoTrack Server Running",
  });
});

// Start Server
async function bootServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: path.join(process.cwd(), "frontend"),
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "frontend", "dist");

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 AlgoTrack running on http://localhost:${PORT}`);
  });
}

bootServer();