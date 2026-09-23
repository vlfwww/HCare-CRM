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
import { ProtectedRoute } from "./ProtectedRoute";
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

export const feedbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/feedback",
  component: FeedbackPage,
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
    const { isDoctor } = useAuth();
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
      <PatientListPage
        onSelectPatient={(patientId) => {
          void navigate({ to: `/patients/${patientId}` });
        }}
      />
    );
  },
});

export const patientDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/patients/$patientId",
  component: () => {
    const { patientId } = patientDetailRoute.useParams();
    return <PatientProfilePage targetUserId={patientId} />;
  },
});

export const medicalStaffRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/medical-staff",
  component: MedicalStaffPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  authenticatedRoute.addChildren([
    profileRoute,
    patientsListRoute,
    patientDetailRoute,
    medicalStaffRoute,
  ]),
  feedbackRoute,
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
