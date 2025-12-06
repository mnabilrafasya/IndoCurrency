// Backend/src/routes/account.routes.js

const { Router } = require("express");
const { getAccounts, getAccountById, createAccount, updateAccount, deleteAccount } = require("../controllers/account.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = Router();

// Semua route di bawah ini BUTUH TOKEN
router.use(authMiddleware);

router.get("/", getAccounts);
router.get("/:id", getAccountById);
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);

module.exports = router;
