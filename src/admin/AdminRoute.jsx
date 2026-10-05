import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingState from "../components/ui/LoadingState";
import { ROUTES } from "../lib/constants";

export default function AdminRoute() {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState message="Checking access…" />;

  if (!isAdmin) {
    return (
      <Navigate
        to={ROUTES.adminLogin}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}