import { Navigate } from "react-router-dom";
import useWorkspaceStore from "../store/workspaceStore";

export default function RoleGuard({
  children,
  allowedRoles = [],
}) {
  const { currentOrganization } =
    useWorkspaceStore();

  const member =
    currentOrganization?.members?.find(
      (m) => m.userId === currentOrganization.currentUserId
    );

  // fallback safety
  if (!currentOrganization) {
    return <Navigate to="/" replace />;
  }

  // if role not allowed
  if (
    member &&
    allowedRoles.length &&
    !allowedRoles.includes(member.role)
  ) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          Access Denied
        </h1>
        <p className="text-gray-500 mt-2">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return children;
}