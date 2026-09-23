import React from "react";
import { Outlet, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/shared/lib/useAuth";
import { Loader2 } from "lucide-react";

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

interface RoleRouteProps {
  doctorOnly?: boolean;
  patientOnly?: boolean;
}

export const RoleRoute: React.FC<React.PropsWithChildren<RoleRouteProps>> = ({
  doctorOnly = false,
  patientOnly = false,
  children,
}) => {
  const { user, isDoctor, loading, roleError } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roleError) {
    return (
      <div className="m-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        Cannot determine account role. Please try again later.
      </div>
    );
  }

  if ((doctorOnly && !isDoctor) || (patientOnly && isDoctor)) {
    return <Navigate to="/profile" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
