import { createContext, useReducer, useEffect } from "react";
import { BACKEND_URL } from "../../config";

export const AuthContext = createContext({});

const initialState = {
  user: null,
  role: null,
  token: "",
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state, action) => {
  switch (action?.type) {
    case "LOGIN":
      return {
        ...state,
        user: action?.payload?.user,
        token: action?.payload?.token,
        role: action?.payload?.user?.role,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: "",
        role: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOADING":
      return {
        ...state,
        isLoading: true,
      };
    case "STOP_LOADING":
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  async function fetchUserStatus() {
    dispatch({ type: "LOADING" });
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({ type: "LOGOUT" });
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/auth/verify-user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.log("Nice");
        return dispatch({ type: "LOGOUT" });
      }
      const data = await response.json();
      dispatch({
        type: "LOGIN",
        payload: {
          token: token,
          user: data?.data,
        },
      });
      return;
    } catch (err) {
      console.log(err);
      return dispatch({ type: "LOGOUT" });
    }
  }

  useEffect(() => {
    fetchUserStatus();
  }, []);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
