import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import Alert from "../components/Alert";

export default function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [hostelFilter, setHostelFilter] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (levelFilter) params.level = levelFilter;
      if (hostelFilter.trim()) params.hostel = hostelFilter.trim();

      const res = await api.get("/admin/dashboard/", { params });
      setRecords(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        // token invalid/expired
        logout();
        navigate("/admin/login", { replace: true });
      } else {
        setError(
          err.response?.data?.detail ||
            err.message ||
            "Failed to load records."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch on filter change (debounced for search)
  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, levelFilter, hostelFilter]);

  const uniqueHostels = useMemo(() => {
    const s = new Set(records.map((r) => r.hostel).filter(Boolean));
    return Array.from(s).sort();
  }, [records]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const formatDate = (iso) => new Date(iso).toLocaleString();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-medium rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stat card */}
        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-slate-500 text-sm">Total Registered Attendees</p>
          <p className="text-3xl font-bold text-slate-800">{records.length}</p>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search by name, phone, hostel, level..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Levels</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
          </select>
          <input
            type="text"
            placeholder="Filter by hostel (e.g. Unity Hall)"
            value={hostelFilter}
            onChange={(e) => setHostelFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {/* Table */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {["#", "Name", "Phone Number", "Hostel", "Level", "Date/Time"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  records.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-700">{idx + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">
                        {r.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {r.phone_number}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{r.hostel}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{r.level}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {formatDate(r.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}