import { useEffect, useState } from "react";
import { toast } from "sonner";

import useAuthStore from "../../store/authStore";
import { getCurrentUser } from "../../api/authApi";

export default function Profile() {
  const { user, setUser } = useAuthStore();

  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    try {
      const data = await getCurrentUser();

      setUser(data);
    } catch {
      toast.error("Failed to load profile");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl">

      <h1 className="text-3xl font-bold mb-8">
        My Profile
      </h1>

      <div className="bg-white rounded-xl shadow p-8">

        <div className="flex items-center gap-6">

          <img
            src={
              user.avatarUrl ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user.name)
            }
            alt=""
            className="w-24 h-24 rounded-full"
          />

          <div>

            <h2 className="text-2xl font-bold">
              {user.name}
            </h2>

            <p className="text-gray-500">
              {user.email}
            </p>

            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${
                user.isEmailVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.isEmailVerified
                ? "Verified"
                : "Not Verified"}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}
