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
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterLogin");
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
      className="relative min-h-screen overflow-hidden bg-slate-950"
      style={{
        background: `url('${campingBg}') center/cover no-repeat`,
      }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      <div className="pointer-events-none absolute -top-48 left-10 h-96 w-96 rounded-full bg-emerald-400/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-160px] right-[-40px] h-[420px] w-[420px] rounded-full bg-cyan-500/25 blur-3xl" />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div className="text-center text-white lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
              Welcome back
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">Reignite your next camping adventure</h1>
            <p className="mt-5 text-base text-white/80 lg:max-w-xl">
              Seamlessly manage bookings, track approvals, and stay inspired with curated campground insights tailored for both
              explorers and admins.
            </p>
          </div>

          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg" />
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-2xl backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-x-10 -top-32 h-64 rounded-full bg-gradient-to-br from-cyan-400/40 via-emerald-400/30 to-transparent blur-3xl" />
              <div className="relative px-8 py-10 sm:px-10 sm:py-12">
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-white">Sign in</h2>
                  <p className="mt-2 text-sm text-white/70">Choose your access level and continue your journey.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Login as</span>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <label
                        className={`relative flex cursor-pointer flex-col items-center gap-3 rounded-2xl border px-4 py-4 transition-all ${
                          role === "user"
                            ? "border-cyan-400/60 bg-cyan-400/10 shadow-lg shadow-cyan-500/20"
                            : "border-white/15 bg-white/5 hover:border-white/25 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="radio"
                          value="user"
                          checked={role === "user"}
                          onChange={(e) => setRole(e.target.value)}
                          className="peer sr-only"
                        />
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-sm font-semibold text-white/80 transition-all peer-checked:border-transparent peer-checked:bg-gradient-to-br peer-checked:from-cyan-400 peer-checked:to-emerald-400 peer-checked:text-slate-900">
                          U
                        </span>
                        <span className="text-sm font-semibold text-white">User</span>
                        <span className="text-center text-xs text-white/60">Book and explore campsites</span>
                      </label>

                      <label
                        className={`relative flex cursor-pointer flex-col items-center gap-3 rounded-2xl border px-4 py-4 transition-all ${
                          role === "admin"
                            ? "border-emerald-400/60 bg-emerald-400/10 shadow-lg shadow-emerald-500/20"
                            : "border-white/15 bg-white/5 hover:border-white/25 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="radio"
                          value="admin"
                          checked={role === "admin"}
                          onChange={(e) => setRole(e.target.value)}
                          className="peer sr-only"
                        />
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-sm font-semibold text-white/80 transition-all peer-checked:border-transparent peer-checked:bg-gradient-to-br peer-checked:from-emerald-400 peer-checked:to-cyan-400 peer-checked:text-slate-900">
                          A
                        </span>
                        <span className="text-sm font-semibold text-white">Admin</span>
                        <span className="text-center text-xs text-white/60">Monitor and approve requests</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-white/80">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 shadow-inner transition focus:border-cyan-300 focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5 transition-opacity" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-white/80">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 shadow-inner transition focus:border-cyan-300 focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5 transition-opacity" />
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-rose-500/40 bg-rose-500/20 px-4 py-3 text-sm text-rose-100 shadow-lg shadow-rose-900/20">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 px-5 py-3.5 text-base font-semibold text-slate-900 transition hover:from-cyan-300 hover:via-sky-300 hover:to-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/70">
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-semibold text-cyan-300 transition hover:text-emerald-300">
                    Sign up here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
