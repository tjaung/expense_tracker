import { useAuthContext } from "./useAuthContext";
import { useExpensesContext } from "./useExpensesContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: expenseDispatch } = useExpensesContext();
  const logout = () => {
    // remove local storage tokens
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
    expenseDispatch({ type: "SET_EXPENSES", PAYLOAD: null });
  };
  return { logout };
};
