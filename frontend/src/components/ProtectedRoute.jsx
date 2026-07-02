import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles}) {

  // Get token 
  const token = localStorage.getItem("token");
  
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
   // If roles are specified, check access
   if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}