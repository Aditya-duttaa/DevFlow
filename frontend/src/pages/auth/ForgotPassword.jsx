import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { forgotPassword } from "../../api/authApi";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values) {
    const result = await forgotPassword(values);
    setMessage(result.message);
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h1 className="text-center text-3xl font-bold">
        Forgot Password
      </h1>
      <p className="mb-8 mt-2 text-center text-gray-500">
        Enter your email and we will send reset instructions.
      </p>

      {message ? (
        <div className="rounded-lg bg-green-50 p-4 text-green-700">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="mt-2 w-full rounded-lg border p-3"
            />
            <p className="mt-1 text-sm text-red-500">
              {errors.email?.message}
            </p>
          </div>
          <button
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}

      <Link
        to="/login"
        className="mt-6 block text-center text-indigo-600 hover:underline"
      >
        Back to login
      </Link>
    </div>
  );
}
