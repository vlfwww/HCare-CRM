import { LoginPage } from "@/features/auth/ui/LoginPage";
import { RegisterPage } from "@/features/auth/ui/RegisterPage";
import { FeedbackPage } from "@/features/feedback/ui/FeedbackPage";
import { Home } from "@/features/home/ui/HomePage";
import { MedicalStaffPage } from "@/features/medical-staff/ui/MedicalStaffPage";
import { PatientProfilePage } from "@/features/patient-profile/ui/PatientProfilePage";
import { PatientListPage } from "@/features/patient-list/ui/PatientListPage";
import { DoctorDashboardPage } from "@/features/doctor-dashboard/ui/DoctorDashboardPage";
import { RootLayout } from "@/widgets/Layout/RootLayout";
import {
  createRootRoute,
  createRoute,
  createRouter,
  createHashHistory,
  useNavigate,
} from "@tanstack/react-router";
import { ProtectedRoute, RoleRoute } from "./ProtectedRoute";
import { useAuth } from "@/shared/lib/useAuth";

export const rootRoute = createRootRoute({
  component: RootLayout,
});

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

export const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "authenticated",
  component: ProtectedRoute,
});

export const profileRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/profile",
  component: function ProfileRoute() {
    const { isDoctor, loading, roleError } = useAuth();
    if (loading) {
      return <div className="p-8 text-gray-500">Checking account role...</div>;
    }
    if (roleError) {
      return (
        <div className="m-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          Cannot determine account role. Check that Firestore rules allow the
          authenticated user to read medical-staff/{`{uid}`}.
        </div>
      );
    }
    if (isDoctor) {
      return <DoctorDashboardPage />;
    }
    return <PatientProfilePage />;
  },
});

export const patientsListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/patients",
  component: function PatientsListRoute() {
    const navigate = useNavigate();
    return (
      <RoleRoute doctorOnly>
        <PatientListPage
          onSelectPatient={(patientId) => {
            void navigate({ to: `/patients/${patientId}` });
          }}
        />
      </RoleRoute>
    );
  },
});

export const patientDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/patients/$patientId",
  component: () => {
    const { patientId } = patientDetailRoute.useParams();
    return (
      <RoleRoute doctorOnly>
        <PatientProfilePage targetUserId={patientId} />
      </RoleRoute>
    );
  },
});

export const medicalStaffRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/medical-staff",
  component: () => (
    <RoleRoute patientOnly>
      <MedicalStaffPage />
    </RoleRoute>
  ),
});

export const feedbackRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/feedback",
  component: function FeedbackRoute() {
    return (
      <RoleRoute patientOnly>
        <FeedbackPage />
      </RoleRoute>
    );
  },
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  authenticatedRoute.addChildren([
    profileRoute,
    patientsListRoute,
    patientDetailRoute,
    medicalStaffRoute,
    feedbackRoute,
  ]),
  loginRoute,
  registerRoute,
]);

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
  history: createHashHistory(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
