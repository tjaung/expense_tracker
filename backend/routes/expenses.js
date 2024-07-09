const express = require("express");
const requireAuth = require("../middleware/requireAuthentification");
const {
  createExpense,
  getExpenses,
  getExpense,
  deleteExpense,
  updateExpense,
} = require("../controllers/expenseController");

// ensure authentification is correct

const router = express.Router();

// before anything else ensure authentification
router.use(requireAuth);

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
