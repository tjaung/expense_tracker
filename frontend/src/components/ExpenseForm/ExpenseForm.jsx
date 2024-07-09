import { useState } from "react";
import { useExpensesContext } from "../../hooks/useExpensesContext";
import { useAuthContext } from "../../hooks/useAuthContext";

import "./expenseForm.css";

const ExpenseForm = () => {
  const { dispatch } = useExpensesContext();
  const { user } = useAuthContext();

  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const expense = { transactionName, transactionAmount, transactionDate };

    const response = await fetch("/api/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTransactionName("");
      setTransactionAmount("");
      setTransactionDate("");
      setError(null);
      setEmptyFields([]);
      console.log("new Expense added", json);
      dispatch({ type: "CREATE_EXPENSE", PAYLOAD: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Expense</h3>

      <label>Expense Name:</label>
      <input
        type="text"
        onChange={(e) => setTransactionName(e.target.value)}
        value={transactionName}
        // className={emptyFields.includes("transactionName") ? "error" : ""}
      />

      <label>Amount:</label>
      <input
        type="number"
        onChange={(e) => setTransactionAmount(e.target.value)}
        value={transactionAmount}
        // className={emptyFields.includes("transactionAmount") ? "error" : ""}
      />

      <label>Date:</label>
      <input
        type="date"
        onChange={(e) => setTransactionDate(e.target.value)}
        value={transactionDate}
        // className={emptyFields.includes("transactionDate") ? "error" : ""}
      />

      <button>Add Expense</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default ExpenseForm;
