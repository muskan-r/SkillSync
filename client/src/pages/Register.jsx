import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TiltCard from "../components/TiltCard";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registerUser(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
        <TiltCard className="w-full max-w-sm bg-zinc-900/80 border border-zinc-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-1">SkillSync</h1>
        <p className="text-zinc-400 mb-6 text-sm">Create your account</p>

        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-950/40 border border-red-900 rounded px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors rounded px-3 py-2 text-sm font-medium"
          >
            Create account
          </button>
        </form>

        <p className="text-zinc-400 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Log in
          </Link>
        </p>
      </TiltCard>
    </div>
  );
}