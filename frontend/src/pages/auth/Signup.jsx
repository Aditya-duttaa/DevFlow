import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { signup } from "../../api/authApi";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Signup() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values) => {

    try {

      await signup(values);

      toast.success("Account created");

      navigate("/login");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
          "Signup failed"
      );

    }
  };

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

          <label>Name</label>

          <input
            {...register("name")}
            className="w-full mt-2 border rounded-lg p-3"
          />

          <p className="text-red-500 text-sm">
            {errors.name?.message}
          </p>

        </div>

        <div>

          <label>Email</label>

          <input
            {...register("email")}
            className="w-full mt-2 border rounded-lg p-3"
          />

          <p className="text-red-500 text-sm">
            {errors.email?.message}
          </p>

        </div>

        <div>

          <label>Password</label>

          <input
            type="password"
            {...register("password")}
            className="w-full mt-2 border rounded-lg p-3"
          />

          <p className="text-red-500 text-sm">
            {errors.password?.message}
          </p>

        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-3 font-semibold"
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
          className="text-indigo-600 ml-2"
        >
          Login
        </Link>

      </p>

    </div>
  );
}