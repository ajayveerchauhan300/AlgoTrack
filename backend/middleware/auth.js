import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "algotrack-jwt-secret-key-13579";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Invalid or expired token" });
      return;
    }
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  });
};
