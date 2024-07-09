const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    transactionName: {
      type: String,
      required: true,
    },
    transactionAmount: {
      type: Number,
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("expense", expenseSchema);
