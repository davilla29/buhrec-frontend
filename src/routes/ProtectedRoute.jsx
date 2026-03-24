import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  const isAuthenticated = Boolean(user);

  // 🔐 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

    // 📩 Not verified
    if (user && user.isVerified === false) {
      return <Navigate to="/verify-email" replace />;
    }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
