// Backend/src/middleware/auth.middleware.js

const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const authMiddleware = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token tidak ditemukan" });
    }

    // Format: "Bearer TOKEN"
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Token tidak valid" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    // Cek apakah user masih ada di database
    const [users] = await pool.execute("SELECT id, name, email FROM users WHERE id = ?", [decoded.userId]);

    if (users.length === 0) {
      return res.status(401).json({ error: "User tidak ditemukan" });
    }

    // Tambahkan userId ke request object
    req.userId = decoded.userId;

    // Lanjutkan ke route handler
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token tidak valid" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token sudah expired" });
    }

    return res.status(401).json({ error: "Autentikasi gagal" });
  }
};

module.exports = { authMiddleware };
