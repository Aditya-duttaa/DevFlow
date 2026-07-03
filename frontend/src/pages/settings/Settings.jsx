import { useState } from "react";
import { toast } from "sonner";

import useAuthStore from "../../store/useAuthStore";
import useWorkspaceStore from "../../store/workspaceStore";

export default function Settings() {
  const { logout } = useAuthStore();
  const { clearWorkspace } = useWorkspaceStore();

  const [confirmLogout, setConfirmLogout] =
    useState(false);

  function handleLogout() {
    clearWorkspace();
    logout();

    toast.success("Logged out");
  }

  return (
    <div className="max-w-5xl space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your application preferences.
        </p>

      </div>

      {/* Account */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Account
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between">

            <span>Email</span>

            <span className="text-gray-500">
              Stored in your profile
            </span>

          </div>

          <div className="flex justify-between">

            <span>Password</span>

            <span className="text-gray-500">
              Backend support coming later
            </span>

          </div>

        </div>

      </div>

      {/* Workspace */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Workspace
        </h2>

        <p className="text-gray-500 mb-5">
          You can switch organizations from the
          Organizations page.
        </p>

      </div>

      {/* Appearance */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Appearance
        </h2>

        <p className="text-gray-500">
          Dark mode support can be added later.
        </p>

      </div>

      {/* Logout */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Danger Zone
        </h2>

        {!confirmLogout ? (

          <button
            onClick={() =>
              setConfirmLogout(true)
            }
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
          >
            Logout
          </button>

        ) : (

          <div className="flex gap-4">

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
            >
              Confirm Logout
            </button>

            <button
              onClick={() =>
                setConfirmLogout(false)
              }
              className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        )}

      </div>

    </div>
  );
}