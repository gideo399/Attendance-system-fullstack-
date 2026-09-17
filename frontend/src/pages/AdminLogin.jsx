import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import Alert from "../components/Alert";

export default function AdminLogin() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!code.trim()) {
      setError("Please enter the admin code.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/admin/login/", { code: code.trim() });
      login(res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.response?.status === 401) setError("Invalid admin code.");
      else if (err.response?.data?.detail) setError(err.response.data.detail);
      else setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Admin Login</h1>
        <p className="text-slate-500 text-sm mb-6">Enter your admin code.</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Admin Code
            </label>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••"
            />
          </div>

          {error && <Alert type="error">{error}</Alert>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}