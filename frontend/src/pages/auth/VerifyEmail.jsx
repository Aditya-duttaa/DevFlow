import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { resendVerification, verifyEmail } from "../../api/authApi";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [email, setEmail] = useState("");
  const token = params.get("token");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("invalid");
        return;
      }

      try {
        await verifyEmail(token);
        setStatus("success");
      } catch (e) {
        const message = e.response?.data?.message || "";
        setStatus(
          message.toLowerCase().includes("expired")
            ? "expired"
            : "invalid"
        );
      }
    }

    verify();
  }, [token]);

  async function resend() {
    try {
      await resendVerification({ email });
      toast.success("If verification is needed, a new email has been sent.");
    } catch {
      toast.error("Failed to resend verification email");
    }
  }

  const content = {
    loading: ["Verifying email...", "Please wait."],
    success: ["Email verified", "You can now login."],
    expired: ["Verification link expired", "Request a new verification email."],
    invalid: ["Verification failed", "This link is invalid or has already been used."],
  }[status];

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
      <h1 className="text-2xl font-bold">{content[0]}</h1>
      <p className="mt-3 text-gray-500">{content[1]}</p>

      {(status === "expired" || status === "invalid") && (
        <div className="mt-6 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border p-3"
          />
          <button
            onClick={resend}
            disabled={!email}
            className="w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white disabled:opacity-50"
          >
            Resend verification
          </button>
        </div>
      )}

      {status === "success" && (
        <Link to="/login" className="mt-6 block text-indigo-600">
          Login
        </Link>
      )}
    </div>
  );
}
