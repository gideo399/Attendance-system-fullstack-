import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Alert from "../components/Alert";

const initialForm = { name: "", phone_number: "", hostel: "", level: "" };

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    else if (form.name.trim().length < 2) errs.name = "Name is too short.";

    if (!form.phone_number.trim()) errs.phone_number = "Phone number is required.";
    else if (!/^\+?\d{9,15}$/.test(form.phone_number.trim()))
      errs.phone_number = "Enter a valid phone number (digits only).";

    if (!form.hostel.trim()) errs.hostel = "Hostel is required.";

    if (!form.level) errs.level = "Level is required.";
    else if (!["100", "200", "300", "400"].includes(String(form.level)))
      errs.level = "Level must be 100, 200, 300, or 400.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", msg: "" });
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/attendance/", {
        ...form,
        level: Number(form.level),
      });
      setAlert({ type: "success", msg: "Attendance registered successfully." });
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        // DRF field errors
        const fieldErrors = {};
        let general = "";
        for (const [k, v] of Object.entries(data)) {
          if (Array.isArray(v)) fieldErrors[k] = v.join(" ");
          else general += `${v} `;
        }
        setErrors(fieldErrors);
        setAlert({
          type: "error",
          msg: general || "Please correct the highlighted fields.",
        });
      } else {
        setAlert({
          type: "error",
          msg: err.message || "Network error. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Register Attendance</h1>
        <p className="text-slate-500 text-sm mb-6">
          Please fill in your details below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-400" : "border-slate-300"
              }`}
              placeholder="Gideon Nyamedi"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone_number ? "border-red-400" : "border-slate-300"
              }`}
              placeholder="024XXXXXXX"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Hostel
            </label>
            <input
              type="text"
              name="hostel"
              value={form.hostel}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.hostel ? "border-red-400" : "border-slate-300"
              }`}
              placeholder="Unity Hall"
            />
            {errors.hostel && (
              <p className="text-red-500 text-xs mt-1">{errors.hostel}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Level
            </label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.level ? "border-red-400" : "border-slate-300"
              }`}
            >
              <option value="">Select level</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
            </select>
            {errors.level && (
              <p className="text-red-500 text-xs mt-1">{errors.level}</p>
            )}
          </div>

          {alert.msg && <Alert type={alert.type}>{alert.msg}</Alert>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Submitting..." : "Submit Attendance"}
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