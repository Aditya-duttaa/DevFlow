import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Outlet />
    </div>
  );
}

export default AuthLayout;