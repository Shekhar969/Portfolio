import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import LoadingState from "../components/ui/LoadingState";

export default function AdminShell() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingState />}>
        <Outlet />
      </Suspense>
    </AuthProvider>
  );
}