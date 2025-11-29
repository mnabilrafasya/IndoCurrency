// Backend/src/routes/transaction.routes.ts

import { Router } from "express";
import { getTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction, getTransactionStats } from "../controllers/transaction.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Apply auth middleware ke semua routes
router.use(authMiddleware);

router.get("/", getTransactions);
router.get("/stats", getTransactionStats);
router.get("/:id", getTransactionById);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
