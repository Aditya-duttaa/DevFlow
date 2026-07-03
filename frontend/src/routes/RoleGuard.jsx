import { Navigate } from "react-router-dom";
import useWorkspaceStore from "../store/workspaceStore";

export default function RoleGuard({
  children,
  allowedRoles = [],
}) {
  const {
    currentOrganization,
    currentMember,
  } = useWorkspaceStore();

  if (!currentOrganization) {
    return <Navigate to="/" replace />;
  }

  if (
    !currentMember ||
    (allowedRoles.length &&
      !allowedRoles.includes(currentMember.role))
  ) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Access Denied
          </h1>

          <p className="text-gray-500 mt-3">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
}