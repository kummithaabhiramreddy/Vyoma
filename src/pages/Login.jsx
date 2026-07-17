import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plane } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-bg">
      <div className="flex items-center gap-2 mb-1">
        <Plane className="text-accent -rotate-45" size={30} />
        <span className="font-display font-extrabold text-3xl">Vyoma</span>
      </div>
      <p className="text-dim text-sm mb-7">Every post is a takeoff.</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-surface border border-border rounded-2xl p-6">
        <input
          type="email" placeholder="Email" value={email} required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-surface2 border border-border rounded-lg px-3.5 py-2.5 text-sm mb-3 outline-none"
        />
        <input
          type="password" placeholder="Password" value={password} required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-surface2 border border-border rounded-lg px-3.5 py-2.5 text-sm mb-4 outline-none"
        />
        {error && <p className="text-accent text-xs mb-3">{error}</p>}
        <button
          disabled={busy}
          className="w-full bg-gradient-to-r from-accent to-orange-300 text-[#1A1204] font-display font-bold text-sm py-3 rounded-lg disabled:opacity-60"
        >
          {busy ? "Logging in..." : "Log in"}
        </button>
        <p className="text-center text-dim text-sm mt-4">
          New to Vyoma?{" "}
          <Link to="/signup" className="text-accent2 font-semibold">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
