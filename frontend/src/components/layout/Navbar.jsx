import useAuthStore from "../../store/authStore";

function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
      <h1 className="text-xl font-bold text-indigo-600">
        DevFlow
      </h1>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-semibold">
            {user?.name || "Guest"}
          </p>

          <p className="text-sm text-gray-500">
            {user?.email}
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}

export default Navbar;