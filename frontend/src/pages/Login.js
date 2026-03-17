import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { login } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login(formData);
      localStorage.setItem("token", data.token);
      setUser(data);
      navigate(data.role === "admin" ? "/admin-dashboard" : "/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-surface via-white to-cyan-50 px-4">
      <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-panel backdrop-blur">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Sign in</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Welcome back</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="gradient-btn w-full">
            Sign in
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          New here?{" "}
          <Link to="/signup" className="font-semibold text-brand-primary">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
