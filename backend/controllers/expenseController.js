const Eorkout = require("../models/expenseModel");
const mongoose = require("mongoose");

// get all expenses
const getExpenses = async (req, res) => {
  const expenses = await expense.find({}).sort({ createdAt: -1 });

  res.status(200).json(expenses);
};

// get a single expense
const getExpense = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such expense" });
  }

  const expense = await expense.findById(id);

  if (!expense) {
    return res.status(404).json({ error: "No such expense" });
  }

  res.status(200).json(expense);
};

// create new expense
const createExpense = async (req, res) => {
  const { title, load, reps } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!load) {
    emptyFields.push("load");
  }
  if (!reps) {
    emptyFields.push("reps");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  // add doc to db
  try {
    const expense = await expense.create({ title, load, reps });
    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a expense
const deleteExpense = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such expense" });
  }

  const expense = await expense.findOneAndDelete({ _id: id });

  if (!expense) {
    return res.status(400).json({ error: "No such expense" });
  }

  res.status(200).json(expense);
};

// update a expense
const updateExpense = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such expense" });
  }

  const expense = await expense.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!expense) {
    return res.status(400).json({ error: "No such expense" });
  }

  res.status(200).json(expense);
};

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  deleteExpense,
  updateExpense,
};
