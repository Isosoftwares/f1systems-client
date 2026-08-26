import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // If no auth data or not authenticated, redirect to login
  if (!auth?.user || !auth?.accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get user roles from auth state
  const userRoles = auth?.roles || [];

  // If no user roles found, redirect to login
  if (!userRoles.length) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize allowed roles for comparison (convert to lowercase)
  const normalizedAllowedRoles =
    allowedRoles?.map((role) => role.toLowerCase()) || [];
  const normalizedUserRoles = userRoles.map((role) => role.toLowerCase());

  // Check if user has permission for this route
  const hasPermission =
    normalizedAllowedRoles.length === 0 ||
    normalizedAllowedRoles.some((allowedRole) =>
      normalizedUserRoles.includes(allowedRole)
    );

  if (hasPermission) {
    return <Outlet />;
  }

  // User is authenticated but doesn't have permission
  // Redirect to their appropriate dashboard based on user roles
  const getRedirectPath = (roles) => {
    const normalizedRoles = roles.map((role) => role.toLowerCase());

    if (normalizedRoles.includes("admin") || normalizedRoles.includes("super_admin")) {
      return "/dashboard";
    }
    if (normalizedRoles.includes("client")) {
      return "/client";
    }
    return "/unauthorized";
  };

  return (
    <Navigate
      to={getRedirectPath(userRoles)}
      state={{ from: location }}
      replace
    />
  );
};

export default RequireAuth;
