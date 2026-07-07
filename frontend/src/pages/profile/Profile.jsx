import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  changePassword,
  getProfile,
  updateProfile,
} from "../../api/profileApi";
import useAuthStore from "../../store/authStore";

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  avatarUrl: z
    .preprocess(
      (value) => (value === "" ? null : value),
      z
        .union([
          z.string().trim().url("Avatar URL must be valid"),
          z.null(),
        ])
        .optional()
    ),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(128, "New password cannot exceed 128 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/[0-9]/, "Include a number")
      .regex(/[^A-Za-z0-9]/, "Include a special character"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords must match",
    }
  );

const formatDate = (value) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const getAvatarFallback = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=4f46e5&color=fff`;

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="h-9 w-40 animate-pulse rounded bg-slate-200" />
      <div className="rounded-xl bg-white p-8 shadow">
        <div className="flex gap-6">
          <div className="h-28 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="flex-1 space-y-4">
            <div className="h-6 w-52 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-72 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-44 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-white p-8 shadow">
        <div className="space-y-4">
          <div className="h-12 animate-pulse rounded bg-slate-200" />
          <div className="h-12 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const setUser = useAuthStore((state) => state.setUser);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
      isDirty,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      avatarUrl: "",
    },
  });

  const watchedName = watch("name");
  const watchedAvatarUrl = watch("avatarUrl");

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: {
      errors: passwordErrors,
      isSubmitting: isChangingPassword,
    },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const previewUrl = useMemo(() => {
    if (imageFailed || !watchedAvatarUrl) {
      return getAvatarFallback(watchedName);
    }

    return watchedAvatarUrl;
  }, [imageFailed, watchedAvatarUrl, watchedName]);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const data = await getProfile();

      setProfile(data);
      setUser(data);
      reset({
        name: data.name ?? "",
        avatarUrl: data.avatarUrl ?? "",
      });
    } catch (e) {
      setLoadError(
        e.response?.data?.message ||
          "Failed to load profile"
      );
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [reset, setUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    setImageFailed(false);
  }, [watchedAvatarUrl]);

  async function submit(values) {
    try {
      const updated = await updateProfile({
        name: values.name.trim(),
        avatarUrl: values.avatarUrl
          ? values.avatarUrl.trim()
          : null,
      });

      setProfile(updated);
      setUser(updated);
      reset({
        name: updated.name ?? "",
        avatarUrl: updated.avatarUrl ?? "",
      });

      toast.success("Profile updated");
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Failed to update profile"
      );
    }
  }

  function cancelChanges() {
    reset({
      name: profile?.name ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
    });
  }

  async function submitPassword(values) {
    try {
      await changePassword(values);
      resetPassword();
      toast.success("Password changed successfully");
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Failed to change password"
      );
    }
  }

  function togglePasswordVisibility(field) {
    setVisiblePasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  function PasswordField({
    name,
    label,
    autoComplete,
  }) {
    const isVisible = visiblePasswords[name];

    return (
      <div>
        <label className="mb-2 block font-semibold">
          {label}
        </label>
        <div className="relative">
          <input
            type={isVisible ? "text" : "password"}
            autoComplete={autoComplete}
            className="w-full rounded-lg border p-3 pr-12"
            {...registerPassword(name)}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility(name)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-slate-100"
            aria-label={
              isVisible ? "Hide password" : "Show password"
            }
          >
            {isVisible ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>
        {passwordErrors[name] && (
          <p className="mt-2 text-sm text-red-600">
            {passwordErrors[name].message}
          </p>
        )}
      </div>
    );
  }

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (loadError) {
    return (
      <div className="max-w-3xl rounded-xl bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold text-red-600">
          Profile unavailable
        </h1>
        <p className="mt-3 text-gray-500">{loadError}</p>
        <button
          type="button"
          onClick={loadProfile}
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-gray-500">
          Manage your personal information and avatar.
        </p>
      </div>

      <div className="rounded-xl bg-white p-8 shadow">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <img
            src={previewUrl}
            alt=""
            onError={() => setImageFailed(true)}
            className="h-28 w-28 rounded-full border object-cover"
          />

          <div>
            <h2 className="text-2xl font-bold">
              {profile?.name}
            </h2>
            <p className="mt-1 text-gray-500">{profile?.email}</p>
            <div className="mt-4 grid gap-2 text-sm text-gray-500 sm:grid-cols-2">
              <p>
                <span className="font-medium text-gray-700">
                  Joined:
                </span>{" "}
                {formatDate(profile?.createdAt)}
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  Last Updated:
                </span>{" "}
                {formatDate(profile?.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        className="rounded-xl bg-white p-8 shadow"
      >
        <div className="grid gap-5">
          <div>
            <label className="mb-2 block font-semibold">
              Name
            </label>
            <input
              className="w-full rounded-lg border p-3"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Email
            </label>
            <input
              className="w-full rounded-lg border bg-slate-100 p-3 text-gray-600"
              value={profile?.email ?? ""}
              readOnly
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Avatar URL
            </label>
            <input
              className="w-full rounded-lg border p-3"
              placeholder="https://example.com/avatar.png"
              {...register("avatarUrl")}
            />
            {errors.avatarUrl && (
              <p className="mt-2 text-sm text-red-600">
                {errors.avatarUrl.message}
              </p>
            )}
          </div>
        </div>

        {isDirty && (
          <p className="mt-5 text-sm text-amber-700">
            You have unsaved changes.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={cancelChanges}
            disabled={isSubmitting || !isDirty}
            className="rounded-lg bg-slate-200 px-6 py-3 text-slate-800 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>

      <form
        onSubmit={handlePasswordSubmit(submitPassword)}
        className="rounded-xl bg-white p-8 shadow"
      >
        <div>
          <h2 className="text-xl font-bold">
            Change Password
          </h2>
          <p className="mt-2 text-gray-500">
            Update your password without changing your email or profile details.
          </p>
        </div>

        <div className="mt-6 grid gap-5">
          <PasswordField
            name="currentPassword"
            label="Current Password"
            autoComplete="current-password"
          />
          <PasswordField
            name="newPassword"
            label="New Password"
            autoComplete="new-password"
          />
          <PasswordField
            name="confirmPassword"
            label="Confirm Password"
            autoComplete="new-password"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isChangingPassword}
            className="rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {isChangingPassword
              ? "Changing..."
              : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
