import { createContext, useReducer } from "react";

export const ExpensesContext = createContext();

export const expensesReducer = (state, action) => {
  switch (action.type) {
    case "SET_EXPENSE":
      return {
        Expenses: action.payload,
      };
    case "CREATE_EXPENSE":
      return {
        Expenses: [action.payload, ...state.Expenses],
      };
    case "DELETE_EXPENSE":
      return {
        Expenses: state.Expenses.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const ExpensesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expensesReducer, {
    Expenses: null,
  });

  return (
    <ExpensesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ExpensesContext.Provider>
  );
};
