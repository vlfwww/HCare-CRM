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
