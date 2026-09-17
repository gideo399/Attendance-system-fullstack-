import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Attendance System</h1>
        <p className="text-slate-500 mb-8">Welcome — please choose an option.</p>

        <div className="space-y-4">
          <Link
            to="/register"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Register Attendance
          </Link>
          <Link
            to="/admin/login"
            className="block w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-lg transition"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}