// Backend/src/controllers/transaction.controller.ts

import { Response } from "express";
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface Transaction extends RowDataPacket {
  id: number;
  user_id: number;
  account_id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  note: string;
  created_at: Date;
  account_name?: string;
  account_type?: string;
}

// Get All Transactions
export const getTransactions = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { startDate, endDate, type, category, accountId } = req.query;

    let query = `
      SELECT t.*, a.account_name, a.account_type 
      FROM transactions t
      LEFT JOIN accounts a ON t.account_id = a.id
      WHERE t.user_id = ?
    `;
    const params: any[] = [userId];

    if (startDate && endDate) {
      query += " AND t.created_at BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    if (type) {
      query += " AND t.type = ?";
      params.push(type);
    }

    if (category) {
      query += " AND t.category = ?";
      params.push(category);
    }

    if (accountId) {
      query += " AND t.account_id = ?";
      params.push(accountId);
    }

    query += " ORDER BY t.created_at DESC";

    const [transactions] = await pool.execute<Transaction[]>(query, params);

    const formattedTransactions = transactions.map((t) => ({
      id: t.id,
      type: t.type.toUpperCase(),
      amount: parseFloat(t.amount.toString()),
      description: t.note || "",
      category: {
        name: t.category,
        icon: getCategoryIcon(t.category),
      },
      account: {
        id: t.account_id,
        name: t.account_name,
        icon: getAccountIcon(t.account_type || ""),
      },
      date: t.created_at,
    }));

    res.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Get Transaction by ID
export const getTransactionById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const [transactions] = await pool.execute<Transaction[]>(
      `SELECT t.*, a.account_name, a.account_type 
       FROM transactions t
       LEFT JOIN accounts a ON t.account_id = a.id
       WHERE t.id = ? AND t.user_id = ?`,
      [id, userId]
    );

    if (transactions.length === 0) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    }

    const t = transactions[0];
    const formattedTransaction = {
      id: t.id,
      type: t.type.toUpperCase(),
      amount: parseFloat(t.amount.toString()),
      description: t.note || "",
      category: {
        name: t.category,
        icon: getCategoryIcon(t.category),
      },
      account: {
        id: t.account_id,
        name: t.account_name,
        icon: getAccountIcon(t.account_type || ""),
      },
      date: t.created_at,
    };

    res.json({ transaction: formattedTransaction });
  } catch (error) {
    console.error("Get transaction error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Create Transaction
export const createTransaction = async (req: any, res: Response) => {
  const connection = await pool.getConnection();

  try {
    const userId = req.userId;
    const { type, amount, description, accountId, category, date } = req.body;

    if (!type || !amount || !accountId || !category) {
      return res.status(400).json({ error: "Field wajib harus diisi" });
    }

    if (type !== "income" && type !== "expense") {
      return res.status(400).json({ error: "Tipe transaksi tidak valid" });
    }

    // Check if account exists and belongs to user
    const [accounts] = await connection.execute<RowDataPacket[]>("SELECT * FROM accounts WHERE id = ? AND user_id = ?", [accountId, userId]);

    if (accounts.length === 0) {
      return res.status(404).json({ error: "Akun tidak ditemukan" });
    }

    await connection.beginTransaction();

    // Insert transaction
    const [result] = await connection.execute<ResultSetHeader>("INSERT INTO transactions (user_id, account_id, type, amount, category, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      userId,
      accountId,
      type,
      amount,
      category,
      description || "",
      date || new Date(),
    ]);

    const transactionId = result.insertId;

    // Update account balance
    const balanceChange = type === "income" ? amount : -amount;
    await connection.execute("UPDATE accounts SET balance = balance + ? WHERE id = ?", [balanceChange, accountId]);

    await connection.commit();

    // Get created transaction
    const [transactions] = await connection.execute<Transaction[]>(
      `SELECT t.*, a.account_name, a.account_type 
       FROM transactions t
       LEFT JOIN accounts a ON t.account_id = a.id
       WHERE t.id = ?`,
      [transactionId]
    );

    const t = transactions[0];
    const formattedTransaction = {
      id: t.id,
      type: t.type.toUpperCase(),
      amount: parseFloat(t.amount.toString()),
      description: t.note || "",
      category: {
        name: t.category,
        icon: getCategoryIcon(t.category),
      },
      account: {
        id: t.account_id,
        name: t.account_name,
        icon: getAccountIcon(t.account_type || ""),
      },
      date: t.created_at,
    };

    res.status(201).json({
      message: "Transaksi berhasil dibuat",
      transaction: formattedTransaction,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Create transaction error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  } finally {
    connection.release();
  }
};

// Update Transaction
export const updateTransaction = async (req: any, res: Response) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const userId = req.userId;
    const { type, amount, description, accountId, category, date } = req.body;

    // Get existing transaction
    const [existingTransactions] = await connection.execute<Transaction[]>("SELECT * FROM transactions WHERE id = ? AND user_id = ?", [id, userId]);

    if (existingTransactions.length === 0) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    }

    const existingTransaction = existingTransactions[0];

    await connection.beginTransaction();

    // Revert old balance
    const oldBalanceChange = existingTransaction.type === "income" ? -existingTransaction.amount : existingTransaction.amount;

    await connection.execute("UPDATE accounts SET balance = balance + ? WHERE id = ?", [oldBalanceChange, existingTransaction.account_id]);

    // Update transaction
    const updates: string[] = [];
    const values: any[] = [];

    if (type) {
      updates.push("type = ?");
      values.push(type);
    }
    if (amount) {
      updates.push("amount = ?");
      values.push(amount);
    }
    if (description !== undefined) {
      updates.push("note = ?");
      values.push(description);
    }
    if (accountId) {
      updates.push("account_id = ?");
      values.push(accountId);
    }
    if (category) {
      updates.push("category = ?");
      values.push(category);
    }
    if (date) {
      updates.push("created_at = ?");
      values.push(date);
    }

    if (updates.length > 0) {
      values.push(id, userId);
      await connection.execute(`UPDATE transactions SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`, values);
    }

    // Apply new balance
    const newType = type || existingTransaction.type;
    const newAmount = amount || existingTransaction.amount;
    const newAccountId = accountId || existingTransaction.account_id;

    const newBalanceChange = newType === "income" ? newAmount : -newAmount;

    await connection.execute("UPDATE accounts SET balance = balance + ? WHERE id = ?", [newBalanceChange, newAccountId]);

    await connection.commit();

    // Get updated transaction
    const [transactions] = await connection.execute<Transaction[]>(
      `SELECT t.*, a.account_name, a.account_type 
       FROM transactions t
       LEFT JOIN accounts a ON t.account_id = a.id
       WHERE t.id = ?`,
      [id]
    );

    const t = transactions[0];
    const formattedTransaction = {
      id: t.id,
      type: t.type.toUpperCase(),
      amount: parseFloat(t.amount.toString()),
      description: t.note || "",
      category: {
        name: t.category,
        icon: getCategoryIcon(t.category),
      },
      account: {
        id: t.account_id,
        name: t.account_name,
        icon: getAccountIcon(t.account_type || ""),
      },
      date: t.created_at,
    };

    res.json({
      message: "Transaksi berhasil diupdate",
      transaction: formattedTransaction,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Update transaction error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  } finally {
    connection.release();
  }
};

// Delete Transaction
export const deleteTransaction = async (req: any, res: Response) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const userId = req.userId;

    // Get existing transaction
    const [transactions] = await connection.execute<Transaction[]>("SELECT * FROM transactions WHERE id = ? AND user_id = ?", [id, userId]);

    if (transactions.length === 0) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    }

    const transaction = transactions[0];

    await connection.beginTransaction();

    // Revert balance
    const balanceChange = transaction.type === "income" ? -transaction.amount : transaction.amount;

    await connection.execute("UPDATE accounts SET balance = balance + ? WHERE id = ?", [balanceChange, transaction.account_id]);

    // Delete transaction
    await connection.execute("DELETE FROM transactions WHERE id = ?", [id]);

    await connection.commit();

    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    await connection.rollback();
    console.error("Delete transaction error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  } finally {
    connection.release();
  }
};

// Get Transaction Stats
export const getTransactionStats = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    let query = "SELECT * FROM transactions WHERE user_id = ?";
    const params: any[] = [userId];

    if (startDate && endDate) {
      query += " AND created_at BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    const [transactions] = await pool.execute<Transaction[]>(query, params);

    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    // Group by category for expenses
    const categoryStats: any = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const category = t.category;
        if (!categoryStats[category]) {
          categoryStats[category] = {
            name: category,
            icon: getCategoryIcon(category),
            amount: 0,
            count: 0,
          };
        }
        categoryStats[category].amount += parseFloat(t.amount.toString());
        categoryStats[category].count += 1;
      });

    const categories = Object.values(categoryStats).map((cat: any) => ({
      ...cat,
      percentage: totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 100) : 0,
    }));

    res.json({
      totalIncome,
      totalExpense,
      totalBalance: totalIncome - totalExpense,
      categories,
    });
  } catch (error) {
    console.error("Get transaction stats error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Helper functions
function getCategoryIcon(category: string): string {
  const icons: { [key: string]: string } = {
    Gaji: "💼",
    Freelance: "💻",
    Investasi: "📈",
    Bonus: "🎁",
    Makanan: "🍔",
    Transportasi: "🚗",
    Belanja: "🛒",
    Hiburan: "🎬",
    Kesehatan: "🏥",
    Pendidikan: "📚",
    Tagihan: "📄",
    Lainnya: "📦",
  };
  return icons[category] || "💰";
}

function getAccountIcon(type: string): string {
  const icons: { [key: string]: string } = {
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
