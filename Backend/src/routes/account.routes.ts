// Backend/src/routes/account.routes.ts

import { Router } from "express";
import { getAccounts, getAccountById, createAccount, updateAccount, deleteAccount } from "../controllers/account.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Semua route di bawah ini BUTUH TOKEN
router.use(authMiddleware);

router.get("/", getAccounts);
router.get("/:id", getAccountById);
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);

export default router;
