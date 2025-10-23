import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import { BACKEND_URL } from "../../config";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [role, setRole] = useState("user"); // user or admin
  const [adminSecretKey, setAdminSecretKey] = useState(""); // For admin signup
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = role === "admin" ? "/auth/admin-signup" : "/auth/signup";

      // Prepare request body
      const requestBody = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      };

      // Add admin secret key if signing up as admin
      if (role === "admin") {
        requestBody.adminSecretKey = adminSecretKey;
      }

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
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
      setError(err.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5">
      <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-center text-gray-800 text-3xl font-semibold mb-8">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-5">
            <label className="block mb-2 text-gray-700 font-medium text-sm">Sign up as:</label>
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

          {/* Username Input */}
          <div className="mb-5">
            <label htmlFor="username" className="block mb-2 text-gray-700 font-medium text-sm">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Email Input */}
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-gray-700 font-medium text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Phone Input */}
          <div className="mb-5">
            <label htmlFor="phone" className="block mb-2 text-gray-700 font-medium text-sm">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="mb-5">
            <label htmlFor="confirmPassword" className="block mb-2 text-gray-700 font-medium text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Admin Secret Key (only shown for admin signup) */}
          {role === "admin" && (
            <div className="mb-5">
              <label htmlFor="adminSecretKey" className="block mb-2 text-gray-700 font-medium text-sm">
                Admin Secret Key
              </label>
              <input
                type="password"
                id="adminSecretKey"
                value={adminSecretKey}
                onChange={(e) => setAdminSecretKey(e.target.value)}
                required
                placeholder="Enter admin secret key"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          )}

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
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-purple-600 hover:underline transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
