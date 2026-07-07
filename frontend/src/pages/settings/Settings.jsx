import { useEffect, useState } from "react";
import { toast } from "sonner";

import { logout as logoutRequest } from "../../api/authApi";
import { getPreferences, updatePreferences } from "../../api/preferenceApi";
import useAuthStore from "../../store/authStore";
import useWorkspaceStore from "../../store/workspaceStore";

const defaultPreferences = {
  theme: "system",
  language: "en",
  timezone: "UTC",
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
};

export default function Settings() {
  const { logout } = useAuthStore();
  const { clearWorkspace } = useWorkspaceStore();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    async function loadPreferences() {
      try {
        const data = await getPreferences();
        setPreferences({
          ...defaultPreferences,
          ...data,
        });
      } catch {
        toast.error("Failed to load preferences");
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, []);

  function updateField(field, value) {
    setPreferences((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function savePreferences(e) {
    e.preventDefault();

    try {
      setSaving(true);
      const updated = await updatePreferences(preferences);
      setPreferences({
        ...defaultPreferences,
        ...updated,
      });
      toast.success("Preferences updated");
    } catch {
      toast.error("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await logoutRequest();
    } catch {
      // Local logout should still complete if the session is already gone.
    }

    clearWorkspace();
    logout();
    toast.success("Logged out");
  }

  if (loading) {
    return (
      <div className="max-w-5xl rounded-xl bg-white p-8 shadow">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-gray-500">
          Manage your application preferences.
        </p>
      </div>

      <form
        onSubmit={savePreferences}
        className="rounded-xl bg-white p-6 shadow"
      >
        <h2 className="mb-5 text-xl font-semibold">
          Preferences
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block font-medium">Theme</label>
            <select
              value={preferences.theme}
              onChange={(e) => updateField("theme", e.target.value)}
              className="w-full rounded-lg border p-3"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => updateField("language", e.target.value)}
              className="w-full rounded-lg border p-3"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">Timezone</label>
            <input
              value={preferences.timezone}
              onChange={(e) => updateField("timezone", e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Asia/Calcutta"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["emailNotifications", "Email Notifications"],
            ["taskNotifications", "Task Notifications"],
            ["projectNotifications", "Project Notifications"],
          ].map(([field, label]) => (
            <label
              key={field}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <span className="font-medium">{label}</span>
              <input
                type="checkbox"
                checked={preferences[field]}
                onChange={(e) => updateField(field, e.target.checked)}
                className="h-5 w-5"
              />
            </label>
          ))}
        </div>

        <button
          disabled={saving}
          className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </form>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Account</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Email</span>
            <span className="text-gray-500">Stored in your profile</span>
          </div>
          <div className="flex justify-between">
            <span>Password</span>
            <span className="text-gray-500">Managed from your profile</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Workspace</h2>
        <p className="text-gray-500">
          You can switch organizations from the Organizations page.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-red-600">
          Danger Zone
        </h2>

        {!confirmLogout ? (
          <button
            onClick={() => setConfirmLogout(true)}
            className="rounded-lg bg-red-500 px-6 py-3 text-white hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700"
            >
              Confirm Logout
            </button>
            <button
              onClick={() => setConfirmLogout(false)}
              className="rounded-lg bg-gray-300 px-6 py-3 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
