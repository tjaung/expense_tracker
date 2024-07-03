import { useEffect } from "react";
import { useExpensesContext } from "../hooks/useExpensesContext";

// components
import ExpenseDetails from "../components/ExpenseDetails/ExpenseDetails";
import ExpenseForm from "../components/ExpenseForm/ExpenseForm";

const Home = () => {
  const { expenses, dispatch } = useExpensesContext();

  useEffect(() => {
    const fetchExpenses = async () => {
      const response = await fetch("/expenses");
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_EXPENSES", payload: json });
      }
    };

    fetchExpenses();
  }, [dispatch]);

  return (
    <div className="home">
      <div className="expenses">
        {expenses &&
          expenses.map((expense) => (
            <ExpenseDetails key={expense._id} expense={expense} />
          ))}
      </div>
      <ExpenseForm />
    </div>
  );
};

export default Home;
