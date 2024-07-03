import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const jsonRes = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(jsonRes.error);
    }
    if (response.ok) {
      // save token to local storage so user doesnt log out every time
      localStorage.setItem("user", JSON.stringify(jsonRes));

      // update auth context
      dispatch({ type: "LOGIN", PAYLOAD: jsonRes });
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};
