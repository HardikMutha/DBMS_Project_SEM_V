import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import { BACKEND_URL } from "../../config";
import toast from "react-hot-toast";
import campingBg from "/assets/camping-bg.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // user or admin
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

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

      if (!response.ok) {
        const failData = await response.json();
        toast.error(failData?.message + " Please try again !");
        return;
      }

      const data = await response.json();

      localStorage.setItem("token", data?.token);

      dispatch({
        type: "LOGIN",
        payload: {
          token: data?.token,
          user: data?.data,
          role: data?.data?.role,
        },
      });

      // Check if there's a redirect URL stored
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex justify-center items-center p-5"
      style={{
        background: `url('${campingBg}') center/cover no-repeat`
      }}
    >
      <div className="absolute inset-0 bg-opacity-40"></div>
      
      <div className="relative z-10 bg-transparent border-2 border-white border-opacity-50 rounded-xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-center text-white text-3xl font-semibold mb-8">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 text-white font-medium text-sm">Login as:</label>
            <div className="flex gap-5 mt-3">
              <label className="flex items-center gap-2 cursor-pointer px-5 py-3 bg-transparent border-2 border-white border-opacity-50 rounded-lg transition-all hover:border-opacity-70 font-medium flex-1 justify-center">
                <input
                  type="radio"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 accent-white cursor-pointer"
                />
                <span className={role === "user" ? "text-white font-bold" : "text-white"}>User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer px-5 py-3 bg-transparent border-2 border-white border-opacity-50 rounded-lg transition-all hover:border-opacity-70 font-medium flex-1 justify-center">
                <input
                  type="radio"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 accent-white cursor-pointer"
                />
                <span className={role === "admin" ? "text-white font-bold" : "text-white"}>Admin</span>
              </label>
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-white font-medium text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-transparent border-2 border-white border-opacity-50 rounded-lg text-white placeholder-white placeholder-opacity-90 text-sm transition-all focus:outline-none focus:border-opacity-70"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-white font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-transparent border-2 border-white border-opacity-50 rounded-lg text-white placeholder-white placeholder-opacity-90 text-sm transition-all focus:outline-none focus:border-opacity-70"
            />
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-80 text-white px-4 py-3 rounded-lg mb-4 text-sm border border-red-300">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-transparent border-2 border-white border-opacity-50 text-white rounded-lg text-base font-semibold cursor-pointer transition-all mt-3 hover:border-opacity-70 hover:bg-white hover:bg-opacity-10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-white border-opacity-50">
          <p className="text-white text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-white font-semibold hover:text-cyan-300 hover:underline transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
