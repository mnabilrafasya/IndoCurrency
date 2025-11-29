// Backend/src/routes/auth.routes.ts

import { Router } from "express";
import { register, login, getProfile } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public routes (TIDAK BUTUH TOKEN)
router.post("/register", register);
router.post("/login", login);

// Protected route (BUTUH TOKEN)
router.get("/profile", authMiddleware, getProfile);

export default router;
