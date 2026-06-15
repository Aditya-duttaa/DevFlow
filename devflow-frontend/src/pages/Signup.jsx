import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();

    await api.post("/auth/signup", {
      name,
      email,
      password,
    });

    navigate("/");
  };

  return (
    <div>
      <h1>Signup</h1>

      <form onSubmit={signup}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button>Signup</button>
      </form>

      <Link to="/">Login</Link>
    </div>
  );
}