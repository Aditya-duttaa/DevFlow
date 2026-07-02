import { Link, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("accessToken");
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">

        <h1 className="text-2xl font-bold mb-8">
          DevFlow
        </h1>

        <nav className="space-y-4">

          <Link to="/" className="block">Dashboard</Link>
          <Link to="/projects" className="block">Projects</Link>
          <Link to="/tasks" className="block">Tasks</Link>
          <Link to="/notifications" className="block">Notifications</Link>
          <Link to="/activity" className="block">Activity</Link>
          <Link to="/organization" className="block">Organization</Link>

        </nav>

        <button
          onClick={logout}
          className="mt-10 bg-red-500 px-4 py-2 rounded-lg w-full"
        >
          Logout
        </button>

      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-100 p-8">
        {children}
      </main>

    </div>
  );
}