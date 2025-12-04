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
      window.location.reload();
    } catch (err) {
      setError(err.message || "An error occurred during signup");
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
      <div className="absolute inset-0 bg-slate-950/78 backdrop-blur-sm" />
      <div className="pointer-events-none absolute top-[12%] right-[10%] h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-160px] left-[-40px] h-[420px] w-[420px] rounded-full bg-emerald-400/25 blur-3xl" />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-7xl gap-12 lg:grid-cols-[520px_minmax(0,1fr)] lg:items-center">
          <div className="relative order-last w-full max-w-md lg:order-first">
            <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg" />
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-2xl backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-x-8 -top-28 h-60 rounded-full bg-gradient-to-br from-emerald-400/40 via-sky-400/30 to-transparent blur-3xl" />
              <div className="relative px-8 py-10 sm:px-10 sm:py-12">
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-white">Create your account</h2>
                  <p className="mt-2 text-sm text-white/70">Unlock seamless campsite bookings and tailored admin tools.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-white/80">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Choose a memorable nickname"
                        className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 shadow-inner transition focus:border-emerald-300 focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5 transition-opacity" />
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
                        className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 shadow-inner transition focus:border-emerald-300 focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
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
                        placeholder="At least 6 characters"
                        className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 shadow-inner transition focus:border-emerald-300 focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5 transition-opacity" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Re-enter your password"
                        className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 shadow-inner transition focus:border-emerald-300 focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
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
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 px-5 py-3.5 text-base font-semibold text-slate-900 transition hover:from-emerald-300 hover:via-cyan-300 hover:to-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </button>
                </form>

                <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/70">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-cyan-300 transition hover:text-emerald-300">
                    Log in here
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="order-first text-center text-white lg:order-last lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
              New here?
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">Join the trailblazer community</h1>
            <p className="mt-5 text-base text-white/80 lg:max-w-xl">
              Discover hidden gems, collaborate with fellow campers, and manage every request with confidence across our immersive
              platform.
            </p>

            <div className="mt-10 grid gap-4 text-left text-sm text-white/75">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="font-semibold text-white">• Curated campground intelligence</p>
                <p className="mt-1 text-white/60">
                  Access detailed amenities, availability, and insider tips for every destination.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="font-semibold text-white">• Smarter collaboration tools</p>
                <p className="mt-1 text-white/60">
                  Coordinate trips, approvals, and maintenance workflows from one intuitive hub.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="font-semibold text-white">• Personalized dashboards</p>
                <p className="mt-1 text-white/60">
                  Tailor insights for campers and admins alike with roles that fit your journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
