import React from "react";
import { ArrowRight, Building2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/shared/lib/useAuth";

export const Home: React.FC = () => {
  const { user, isDoctor, loading } = useAuth();

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 font-manrope">
      <div className="bg-white rounded-2xl border border-gray-200 p-10 sm:p-16 shadow-2xs max-w-3xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xs">
          <Building2 className="w-8 h-8" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Harmony Health Clinic
        </h1>

        <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          Welcome to our centralized management system. Here you can easily
          coordinate medical staff schedules, review doctor availability, and
          monitor service feedback.
        </p>

        <div className="flex justify-center gap-4">
          {user && !loading && !isDoctor ? (
            <Link
              to="/medical-staff"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer shadow-emerald-500/20"
            >
              <span>Open Medical Staff</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer shadow-emerald-500/20"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
