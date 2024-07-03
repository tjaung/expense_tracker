const express = require("express");
const {
  createExpense,
  getExpenses,
  getExpense,
  deleteExpense,
  updateExpense,
} = require("../controllers/expenseController");

const router = express.Router();

// GET all Expenses
router.get("/", getExpenses);

//GET a single Expense
router.get("/:id", getExpense);

// POST a new Expense
router.post("/", createExpense);

// DELETE a Expense
router.delete("/:id", deleteExpense);

// UPDATE a Expense
router.patch("/:id", updateExpense);

module.exports = router;
