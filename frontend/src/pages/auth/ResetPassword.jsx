import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { resetPassword } from "../../api/authApi";

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password cannot exceed 128 characters")
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

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [visible, setVisible] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const token = params.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    try {
      await resetPassword({ token, ...values });
      setSuccess(true);
      toast.success("Password reset successfully");
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Failed to reset password"
      );
    }
  }

  function field(name, label) {
    return (
      <div>
        <label className="font-medium">{label}</label>
        <div className="relative mt-2">
          <input
            type={visible[name] ? "text" : "password"}
            {...register(name)}
            className="w-full rounded-lg border p-3 pr-12"
          />
          <button
            type="button"
            onClick={() =>
              setVisible((current) => ({
                ...current,
                [name]: !current[name],
              }))
            }
            className="absolute right-4 top-3 text-gray-500"
          >
            {visible[name] ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <p className="mt-1 text-sm text-red-500">
          {errors[name]?.message}
        </p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-red-600">
          Invalid reset link
        </h1>
        <Link to="/forgot-password" className="mt-6 block text-indigo-600">
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-green-700">
          Password updated
        </h1>
        <Link to="/login" className="mt-6 block text-indigo-600">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h1 className="text-center text-3xl font-bold">
        Reset Password
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        {field("newPassword", "Password")}
        {field("confirmPassword", "Confirm Password")}
        <button
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
