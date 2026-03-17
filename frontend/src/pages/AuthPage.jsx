import { useEffect, useState } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { login, signup, user } = useAuth();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
  }, [navigate, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        await signup(form);
      } else {
        await login({
          email: form.email,
          password: form.password
        });
      }

      const redirectTo = location.state?.from || (mode === "login" ? "/dashboard" : "/");
      navigate(redirectTo);
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode) {
    setSearchParams(nextMode === "signup" ? { mode: "signup" } : {});
  }

  return (
    <div className="section-shell py-14">
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] bg-hero-grid p-8 text-white shadow-soft sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">Customer account</p>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Login for faster checkout and smarter order tracking.</h1>
          <div className="mt-8 space-y-4 text-sm leading-7 text-slate-200">
            <div className="flex items-start gap-3 rounded-[24px] bg-white/10 p-4">
              <ShieldCheck className="mt-1 text-gold" />
              <p>Secure JWT-based authentication for customer and admin access.</p>
            </div>
            <div className="flex items-start gap-3 rounded-[24px] bg-white/10 p-4">
              <Sparkles className="mt-1 text-gold" />
              <p>Save your wishlist, track warranty-backed orders, and manage delivery addresses in one place.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[36px] bg-white p-8 shadow-soft sm:p-10">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                mode === "login" ? "bg-ink text-white" : "text-slate-500"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                mode === "signup" ? "bg-ink text-white" : "text-slate-500"
              }`}
            >
              Signup
            </button>
          </div>

          <h2 className="mt-6 font-display text-3xl font-bold text-ink">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {mode === "signup"
              ? "Set up your profile for smooth cart, checkout, order history, and wishlist syncing."
              : "Login to continue shopping, manage orders, and update your profile details."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {mode === "signup" ? (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  placeholder="Your full name"
                />
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                placeholder="name@example.com"
              />
            </div>

            {mode === "signup" ? (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Phone number</label>
                <input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <input
                required
                type="password"
                minLength={8}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                placeholder="Minimum 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-coral px-5 py-4 text-sm font-bold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
