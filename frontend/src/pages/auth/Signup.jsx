import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { signup } from "../../api/authApi";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
  const navigate = useNavigate();

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
      await signup(values);

      toast.success("Account created successfully");

      navigate("/login", {
        replace: true,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Signup failed"
      );
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

      <h1 className="text-3xl font-bold text-center mb-2">
        Create Account
      </h1>

      <p className="text-center text-gray-500 mb-8">
        Join DevFlow
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        <div>

          <label className="font-medium">
            Name
          </label>

          <input
            {...register("name")}
            type="text"
            className="w-full mt-2 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <p className="text-sm text-red-500 mt-1">
            {errors.name?.message}
          </p>

        </div>

        <div>

          <label className="font-medium">
            Email
          </label>

          <input
            {...register("email")}
            type="email"
            className="w-full mt-2 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <p className="text-sm text-red-500 mt-1">
            {errors.email?.message}
          </p>

        </div>

        <div>

          <label className="font-medium">
            Password
          </label>

          <input
            {...register("password")}
            type="password"
            className="w-full mt-2 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

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
            ? "Creating..."
            : "Create Account"}
        </button>

      </form>

      <p className="text-center mt-6">

        Already have an account?

        <Link
          to="/login"
          className="ml-2 text-indigo-600 hover:underline"
        >
          Login
        </Link>

      </p>

    </div>
  );
}
