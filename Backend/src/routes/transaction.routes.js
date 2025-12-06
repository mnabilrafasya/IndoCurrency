// Backend/src/routes/transaction.routes.js

const { Router } = require("express");
const { getTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction, getTransactionStats } = require("../controllers/transaction.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = Router();

// Apply auth middleware ke semua routes
router.use(authMiddleware);

router.get("/", getTransactions);
router.get("/stats", getTransactionStats);
router.get("/:id", getTransactionById);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
