import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import { BACKEND_URL } from "../../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // user or admin
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate("/home");
    }
  }, [state.isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint = role === "admin" ? "/auth/admin-login" : "/auth/login";
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      // Update auth context
      dispatch({
        type: "LOGIN",
        payload: {
          token: data.token,
          user: data.user,
        },
      });

      // Navigate to home page
      navigate("/home");
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5">
      <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-center text-gray-800 text-3xl font-semibold mb-8">Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-5">
            <label className="block mb-2 text-gray-700 font-medium text-sm">Login as:</label>
            <div className="flex gap-5 mt-3">
              <label className="flex items-center gap-2 cursor-pointer px-5 py-3 border-2 border-gray-200 rounded-lg transition-all hover:border-indigo-500 hover:bg-indigo-50 font-medium flex-1 justify-center">
                <input
                  type="radio"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
                <span className={role === "user" ? "text-indigo-600" : ""}>User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer px-5 py-3 border-2 border-gray-200 rounded-lg transition-all hover:border-indigo-500 hover:bg-indigo-50 font-medium flex-1 justify-center">
                <input
                  type="radio"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
                <span className={role === "admin" ? "text-indigo-600" : ""}>Admin</span>
              </label>
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-gray-700 font-medium text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Password Input */}
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-gray-700 font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm border-l-4 border-red-600">{error}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all mt-3 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:text-purple-600 hover:underline transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
