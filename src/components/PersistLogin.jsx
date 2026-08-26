import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import useActivityTracker from "../hooks/useActivityTracker";
import useAutoRefresh from "../hooks/useAutoRefresh";
// import useTabFocusRedirect from "../hooks/useTabFocusRedirect";
import LoadingSpinner from "./LoadingSpinner";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize all our custom hooks
  useActivityTracker(15); // 15 minutes inactivity timeout
  useAutoRefresh(14); // Refresh token every 14 minutes (before 15-minute expiry)

  // Helper function to get redirect path based on user roles
  const getRedirectPath = (roles) => {
    if (!roles || !roles.length) return null;

    const normalizedRoles = roles.map((role) => role.toLowerCase());

    if (normalizedRoles.includes("admin") || normalizedRoles.includes("super_admin")) {
      return "/dashboard";
    }
    if (normalizedRoles.includes("client")) {
      return "/client";
    }
    return null;
  };

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error("Failed to refresh token on app start:", err);
        // Don't show error toast here as useRefreshToken handles it
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Only try to refresh if:
    // 1. We don't have an access token
    // 2. Persist is enabled (user wants to stay logged in)
    if (!auth?.accessToken && persist) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run on mount

  // Redirect authenticated users away from login pages
  useEffect(() => {
    if (auth?.accessToken && auth?.roles && !isLoading) {
      const currentPath = location.pathname;
      const redirectPath = getRedirectPath(auth.roles);

      // If user is on login page or root and has active session, redirect to dashboard
      if ((currentPath === "/login" || currentPath === "/") && redirectPath) {
        navigate(redirectPath, { replace: true });
      }
    }
  }, [auth?.accessToken, auth?.roles, isLoading, location.pathname, navigate]);

  // Don't show loading screen if persist is disabled
  if (!persist) {
    return <Outlet />;
  }

  // Show loading screen while verifying authentication
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center text-center h-screen bg-gray-50">
        <LoadingSpinner size={40} />
        <p className="mt-4 text-gray-600">Verifying authentication...</p>
      </div>
    );
  }

  return <Outlet />;
};

export default PersistLogin;
