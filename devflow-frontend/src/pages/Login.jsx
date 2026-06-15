import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const login = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    console.log(res.data);

    console.log(res.data);

localStorage.setItem(
  "accessToken",
  res.data.accessToken || res.data.data?.accessToken
);
    navigate("/dashboard");
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={login}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Login</button>
      </form>

      <Link to="/signup">Signup</Link>
    </div>
  );
}