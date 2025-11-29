// Backend/src/controllers/auth.controller.ts

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validasi input
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password tidak cocok" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password minimal 6 karakter" });
    }

    // Cek apakah email sudah terdaftar
    const [existingUsers] = await pool.execute<User[]>("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru
    const [result] = await pool.execute<ResultSetHeader>("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    const userId = result.insertId;

    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "30d" });

    res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: userId,
        name,
        email,
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password harus diisi" });
    }

    // Cari user berdasarkan email
    const [users] = await pool.execute<User[]>("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const user = users[0];

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "30d" });

    res.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Get Profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const [users] = await pool.execute<User[]>("SELECT id, name, email, created_at FROM users WHERE id = ?", [userId]);

    if (users.length === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
