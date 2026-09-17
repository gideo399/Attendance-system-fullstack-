export default function Alert({ type = "info", children }) {
  if (!children) return null;
  const styles = {
    success: "bg-green-50 border-green-300 text-green-800",
    error: "bg-red-50 border-red-300 text-red-800",
    info: "bg-blue-50 border-blue-300 text-blue-800",
  }[type];

  return (
    <div className={`border rounded-lg px-4 py-3 text-sm ${styles}`}>{children}</div>
  );
}