import { useState } from "react";
import { useNavigate, Link } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import { BACKEND_URL } from "../../config";
import toast from "react-hot-toast";
import campingBg from "/assets/camping-bg.jpg";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const failData = await response.json();
        toast.error(failData?.message || "An Error Occured Please Try again Later!");
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

      navigate("/");
    } catch (err) {
      setError(err.message || "An error occurred during signup");
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
      <div className="relative z-10 bg-transparent border-2 border-white border-opacity-50 rounded-xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-center text-white text-3xl font-semibold mb-8">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="username" className="block mb-2 text-white font-medium text-sm">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className="w-full px-4 py-3 bg-transparent border-2 border-white border-opacity-50 rounded-lg text-white placeholder-white placeholder-opacity-90 text-sm transition-all focus:outline-none focus:border-opacity-70"
            />
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

          <div className="mb-5">
            <label htmlFor="confirmPassword" className="block mb-2 text-white font-medium text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
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
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-white border-opacity-50">
          <p className="text-white text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-semibold hover:text-cyan-300 hover:underline transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
