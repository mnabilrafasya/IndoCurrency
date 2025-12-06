// Backend/src/routes/auth.routes.js

const { Router } = require("express");
const { register, login, getProfile } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = Router();

// Public routes (TIDAK BUTUH TOKEN)
router.post("/register", register);
router.post("/login", login);

// Protected route (BUTUH TOKEN)
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
