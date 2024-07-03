import { ExpensesContext } from "../context/expenseContext";
import { useContext } from "react";

export const useExpensesContext = () => {
  const context = useContext(ExpensesContext);

  if (!context) {
    throw Error(
      "useExpensesContext must be used inside an expensesContextProvider"
    );
  }

  return context;
};
