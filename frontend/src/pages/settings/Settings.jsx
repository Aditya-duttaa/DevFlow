import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  logout as logoutRequest,
  logoutAll,
} from "../../api/authApi";
import { changePassword } from "../../api/profileApi";
import { queryClient } from "../../lib/queryClient";
import useAuthStore from "../../store/authStore";
import useWorkspaceStore from "../../store/workspaceStore";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
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
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export default function Settings() {
  const { logout } = useAuthStore();
  const { clearWorkspace } = useWorkspaceStore();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function submitPassword(values) {
    try {
      await changePassword(values);
      reset();
      toast.success("Password changed successfully");
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Failed to change password"
      );
    }
  }

  async function handleLogout() {
    try {
      await logoutRequest();
    } catch {
      // Continue local logout if the server session is already gone.
    }

    clearWorkspace();
    logout();
    queryClient.clear();
    toast.success("Logged out");
  }

  async function handleLogoutAll() {
    try {
      await logoutAll();
      clearWorkspace();
      logout();
      queryClient.clear();
      toast.success("Logged out from all devices");
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Failed to logout all devices"
      );
    }
  }

  function passwordField(name, label) {
    return (
      <div>
        <label className="mb-2 block font-medium">{label}</label>
        <div className="relative">
          <input
            type={show[name] ? "text" : "password"}
            {...register(name)}
            className="w-full rounded-lg border p-3 pr-12"
          />
          <button
            type="button"
            onClick={() =>
              setShow((current) => ({
                ...current,
                [name]: !current[name],
              }))
            }
            className="absolute right-4 top-3 text-gray-500"
          >
            {show[name] ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <p className="mt-1 text-sm text-red-500">
          {errors[name]?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-gray-500">
          Manage account security and sessions.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(submitPassword)}
        className="rounded-xl bg-white p-6 shadow"
      >
        <h2 className="mb-5 text-xl font-semibold">
          Change Password
        </h2>
        <div className="grid gap-5">
          {passwordField("currentPassword", "Current Password")}
          {passwordField("newPassword", "New Password")}
          {passwordField("confirmPassword", "Confirm Password")}
        </div>
        <button
          disabled={isSubmitting}
          className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Changing..." : "Change Password"}
        </button>
      </form>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          Sessions
        </h2>
        <button
          onClick={handleLogoutAll}
          className="rounded-lg bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
        >
          Logout All Devices
        </button>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-red-600">
          Danger Zone
        </h2>
        <div className="flex flex-wrap gap-4">
          {!confirmLogout ? (
            <button
              onClick={() => setConfirmLogout(true)}
              className="rounded-lg bg-red-500 px-6 py-3 text-white hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <>
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
            </>
          )}
          <button
            disabled
            className="rounded-lg bg-red-100 px-6 py-3 text-red-500 opacity-70"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
