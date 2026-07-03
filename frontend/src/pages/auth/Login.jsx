import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { login, getMe } from "../../api/authApi";
import useAuthStore from "../../store/authStore";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const navigate = useNavigate();

  const { login: loginStore } =
    useAuthStore();

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values) {
    try {
      const res = await login(values);

      const token =
        res.accessToken ||
        res.token ||
        res.data?.accessToken;

      const me = await getMe();

      loginStore(
        me.user || me.data || me,
        token
      );

      toast.success("Login successful");

      navigate("/", {
        replace: true,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed"
      );
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

      <h1 className="text-3xl font-bold text-center mb-2">
        Welcome Back
      </h1>

      <p className="text-center text-gray-500 mb-8">
        Login to DevFlow
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        <div>

          <label className="font-medium">
            Email
          </label>

          <input
            {...register("email")}
            type="email"
            className="mt-2 w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <p className="text-sm text-red-500 mt-1">
            {errors.email?.message}
          </p>

        </div>

        <div>

          <label className="font-medium">
            Password
          </label>

          <div className="relative">

            <input
              {...register("password")}
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              className="mt-2 w-full border rounded-lg p-3 pr-12 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-6"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

          <p className="text-sm text-red-500 mt-1">
            {errors.password?.message}
          </p>

        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg p-3 font-semibold"
        >
          {isSubmitting
            ? "Logging in..."
            : "Login"}
        </button>

      </form>

      <p className="text-center mt-6">

        Don't have an account?

        <Link
          to="/signup"
          className="ml-2 text-indigo-600 hover:underline"
        >
          Sign Up
        </Link>

      </p>

    </div>
  );
}