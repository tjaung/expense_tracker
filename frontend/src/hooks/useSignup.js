import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    await fetch("/api/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        return response.json().then((jsonRes) => {
          if (!response.ok) {
            throw new Error(jsonRes.error);
          }
          return jsonRes;
        });
      })
      .then((jsonRes) => {
        // Save token to local storage so user doesn't log out every time
        localStorage.setItem("user", JSON.stringify(jsonRes));

        // Update auth context
        dispatch({ type: "LOGIN", PAYLOAD: jsonRes });
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.message);
      });
  };
  //   const jsonRes = await response.json();

  //   if (!response.ok) {
  //     setIsLoading(false);
  //     setError(jsonRes.error);
  //   }
  //   if (response.ok) {
  //     // save token to local storage so user doesnt log out every time
  //     localStorage.setItem("user", JSON.stringify(jsonRes));

  //     // update auth context
  //     dispatch({ type: "LOGIN", PAYLOAD: jsonRes });
  //     setIsLoading(false);
  //   }
  // };
  return { signup, isLoading, error };
};
