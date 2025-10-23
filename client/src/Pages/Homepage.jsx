import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";

const Homepage = () => {
  const { state } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user role
    if (state.user) {
      if (state.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    }
  }, [state.user, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-600">Redirecting...</p>
    </div>
  );
};

export default Homepage;
