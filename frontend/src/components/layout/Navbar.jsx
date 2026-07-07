import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { logout as logoutRequest } from "../../api/authApi";
import useAuthStore from "../../store/authStore";
import useWorkspaceStore from "../../store/workspaceStore";

export default function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  const { clearWorkspace } =
    useWorkspaceStore();

  async function handleLogout() {
    try {
      await logoutRequest();
    } catch {
      // Local logout should still complete if the session is already gone.
    }

    logout();
    clearWorkspace();
    navigate("/login");
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">

      <div>
        <h1 className="text-2xl font-bold text-indigo-600">
          DevFlow
        </h1>
      </div>

      <div className="flex items-center gap-6">

        <div className="text-right">

          <p className="font-semibold">
            {user?.name || "Guest"}
          </p>

          <p className="text-sm text-gray-500">
            {user?.email || ""}
          </p>

        </div>

        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </header>
  );
}
