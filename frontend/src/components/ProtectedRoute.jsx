import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles}) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    return <Navigate to="/login" />;
  }
   // If roles are specified, check access
   if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}