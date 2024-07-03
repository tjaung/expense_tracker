import { useExpensesContext } from "../../hooks/useExpensesContext";

import "./expenseDetails.css";

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const ExpenseDetails = ({ expense }) => {
  const { dispatch } = useExpensesContext();

  const handleClick = async () => {
    const response = await fetch("/expenses/" + expense._id, {
      method: "DELETE",
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_EXPENSE", payload: json });
    }
  };

  return (
    <div className="expense-details">
      <h4>{expense.title}</h4>
      <p>
        <strong>Load (kg): </strong>
        {expense.load}
      </p>
      <p>
        <strong>Reps: </strong>
        {expense.reps}
      </p>
      <p>
        {formatDistanceToNow(new Date(expense.createdAt), { addSuffix: true })}
      </p>
      <span className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>
    </div>
  );
};

export default ExpenseDetails;
