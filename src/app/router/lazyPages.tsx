import { lazy, Suspense, type ReactNode } from "react";

export const LoginPage = lazy(() =>
  import("@/features/auth/ui/LoginPage").then(({ LoginPage }) => ({
    default: LoginPage,
  })),
);
export const RegisterPage = lazy(() =>
  import("@/features/auth/ui/RegisterPage").then(({ RegisterPage }) => ({
    default: RegisterPage,
  })),
);
export const FeedbackPage = lazy(() =>
  import("@/features/feedback/ui/FeedbackPage").then(({ FeedbackPage }) => ({
    default: FeedbackPage,
  })),
);
export const MedicalStaffPage = lazy(() =>
  import("@/features/medical-staff/ui/MedicalStaffPage").then(
    ({ MedicalStaffPage }) => ({ default: MedicalStaffPage }),
  ),
);
export const PatientProfilePage = lazy(() =>
  import("@/features/patient-profile/ui/PatientProfilePage").then(
    ({ PatientProfilePage }) => ({ default: PatientProfilePage }),
  ),
);
export const PatientListPage = lazy(() =>
  import("@/features/patient-list/ui/PatientListPage").then(
    ({ PatientListPage }) => ({ default: PatientListPage }),
  ),
);
export const DoctorDashboardPage = lazy(() =>
  import("@/features/doctor-dashboard/ui/DoctorDashboardPage").then(
    ({ DoctorDashboardPage }) => ({ default: DoctorDashboardPage }),
  ),
);

const RouteFallback = () => (
  <div className="p-8 text-gray-500" role="status">
    Loading...
  </div>
);

export const Suspended = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<RouteFallback />}>{children}</Suspense>
);
