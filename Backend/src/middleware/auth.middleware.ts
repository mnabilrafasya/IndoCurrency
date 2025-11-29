// Backend/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../config/database";
import { RowDataPacket } from "mysql2";

// Extend Request interface untuk menambahkan userId
export interface AuthRequest extends Request {
  userId?: number;
}

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
}

interface JwtPayload {
  userId: number;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as JwtPayload;

    // Cek apakah user masih ada di database
    const [users] = await pool.execute<User[]>("SELECT id, name, email FROM users WHERE id = ?", [decoded.userId]);

    if (users.length === 0) {
      return res.status(401).json({ error: "User tidak ditemukan" });
    }

    // Tambahkan userId ke request object
    req.userId = decoded.userId;

    // Lanjutkan ke route handler
    next();
  } catch (error: any) {
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
