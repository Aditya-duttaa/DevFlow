import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <div>
      <h2>DevFlow</h2>

      <Link to="/dashboard">Dashboard</Link>{" "}
      <Link to="/organizations">Organizations</Link>{" "}
      <Link to="/projects">Projects</Link>{" "}
      <Link to="/tasks">Tasks</Link>{" "}
      <Link to="/activity">Activity</Link>{" "}
      <Link to="/notifications">Notifications</Link>{" "}

      <button onClick={logout}>Logout</button>
      <hr />
    </div>
  );
}