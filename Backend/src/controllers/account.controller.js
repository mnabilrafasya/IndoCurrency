// Backend/src/controllers/account.controller.js

const pool = require("../config/database");

// Get All Accounts
const getAccounts = async (req, res) => {
  try {
    const userId = req.userId;

    const [accounts] = await pool.execute("SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at DESC", [userId]);

    // Format response
    const formattedAccounts = accounts.map((account) => ({
      id: account.id,
      name: account.account_name,
      type: account.account_type,
      icon: getAccountIcon(account.account_type),
      balance: parseFloat(account.balance.toString()),
      createdAt: account.created_at,
    }));

    res.json({ accounts: formattedAccounts });
  } catch (error) {
    console.error("Get accounts error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Get Account by ID
const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const [accounts] = await pool.execute("SELECT * FROM accounts WHERE id = ? AND user_id = ?", [id, userId]);

    if (accounts.length === 0) {
      return res.status(404).json({ error: "Akun tidak ditemukan" });
    }

    const account = accounts[0];
    const formattedAccount = {
      id: account.id,
      name: account.account_name,
      type: account.account_type,
      icon: getAccountIcon(account.account_type),
      balance: parseFloat(account.balance.toString()),
      createdAt: account.created_at,
    };

    res.json({ account: formattedAccount });
  } catch (error) {
    console.error("Get account error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Create Account
const createAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, type, balance = 0 } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: "Nama dan tipe akun harus diisi" });
    }

    const [result] = await pool.execute("INSERT INTO accounts (user_id, account_name, account_type, balance) VALUES (?, ?, ?, ?)", [userId, name, type, balance]);

    const accountId = result.insertId;

    res.status(201).json({
      message: "Akun berhasil dibuat",
      account: {
        id: accountId,
        name,
        type,
        icon: getAccountIcon(type),
        balance: parseFloat(balance),
      },
    });
  } catch (error) {
    console.error("Create account error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Update Account
const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { name, type, balance } = req.body;

    // Check if account exists and belongs to user
    const [accounts] = await pool.execute("SELECT * FROM accounts WHERE id = ? AND user_id = ?", [id, userId]);

    if (accounts.length === 0) {
      return res.status(404).json({ error: "Akun tidak ditemukan" });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name) {
      updates.push("account_name = ?");
      values.push(name);
    }
    if (type) {
      updates.push("account_type = ?");
      values.push(type);
    }
    if (balance !== undefined) {
      updates.push("balance = ?");
      values.push(balance);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "Tidak ada data yang diupdate" });
    }

    values.push(id, userId);

    await pool.execute(`UPDATE accounts SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`, values);

    // Get updated account
    const [updatedAccounts] = await pool.execute("SELECT * FROM accounts WHERE id = ?", [id]);

    const account = updatedAccounts[0];
    const formattedAccount = {
      id: account.id,
      name: account.account_name,
      type: account.account_type,
      icon: getAccountIcon(account.account_type),
      balance: parseFloat(account.balance.toString()),
    };

    res.json({
      message: "Akun berhasil diupdate",
      account: formattedAccount,
    });
  } catch (error) {
    console.error("Update account error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Delete Account
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Check if account exists
    const [accounts] = await pool.execute("SELECT * FROM accounts WHERE id = ? AND user_id = ?", [id, userId]);

    if (accounts.length === 0) {
      return res.status(404).json({ error: "Akun tidak ditemukan" });
    }

    // Delete account
    await pool.execute("DELETE FROM accounts WHERE id = ? AND user_id = ?", [id, userId]);

    res.json({ message: "Akun berhasil dihapus" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Helper function to get icon based on account type
function getAccountIcon(type) {
  const icons = {
    cash: "💵",
    bank: "🏦",
    ewallet: "📱",
    "e-wallet": "📱",
    credit: "💳",
    saving: "💰",
    investment: "📈",
  };
  return icons[type.toLowerCase()] || "💳";
}

module.exports = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
};
