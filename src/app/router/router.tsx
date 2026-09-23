import { Home } from "@/features/home/ui/HomePage";
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
import {
  DoctorDashboardPage,
  FeedbackPage,
  LoginPage,
  MedicalStaffPage,
  PatientListPage,
  PatientProfilePage,
  RegisterPage,
  Suspended,
} from "./lazyPages";

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
  component: () => (
    <Suspended>
      <LoginPage />
    </Suspended>
  ),
});

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => (
    <Suspended>
      <RegisterPage />
    </Suspended>
  ),
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
      return (
        <Suspended>
          <DoctorDashboardPage />
        </Suspended>
      );
    }
    return (
      <Suspended>
        <PatientProfilePage />
      </Suspended>
    );
  },
});

export const patientsListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/patients",
  component: function PatientsListRoute() {
    const navigate = useNavigate();
    return (
      <Suspended>
        <RoleRoute doctorOnly>
          <PatientListPage
            onSelectPatient={(patientId) => {
              void navigate({ to: `/patients/${patientId}` });
            }}
          />
        </RoleRoute>
      </Suspended>
    );
  },
});

export const patientDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/patients/$patientId",
  component: () => {
    const { patientId } = patientDetailRoute.useParams();
    return (
      <Suspended>
        <RoleRoute doctorOnly>
          <PatientProfilePage targetUserId={patientId} />
        </RoleRoute>
      </Suspended>
    );
  },
});

export const medicalStaffRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/medical-staff",
  component: () => (
    <Suspended>
      <RoleRoute patientOnly>
        <MedicalStaffPage />
      </RoleRoute>
    </Suspended>
  ),
});

export const feedbackRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/feedback",
  component: function FeedbackRoute() {
    return (
      <Suspended>
        <RoleRoute patientOnly>
          <FeedbackPage />
        </RoleRoute>
      </Suspended>
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
