import { LoginPage } from "@/features/auth/ui/LoginPage";
import { RegisterPage } from "@/features/auth/ui/RegisterPage";
import { FeedbackPage } from "@/features/feedback/ui/FeedbackPage";
import { Home } from "@/features/home/ui/HomePage";
import { MedicalStaffPage } from "@/features/medical-staff/ui/MedicalStaffPage";
import { PatientProfilePage } from "@/features/patient-profile/ui/PatientProfilePage";
import { RootLayout } from "@/widgets/Layout/RootLayout";
import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ProtectedRoute } from "./ProtectedRoute";

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
  component: PatientProfilePage,
});

export const medicalStaffRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/medical-staff",
  component: MedicalStaffPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  authenticatedRoute.addChildren([profileRoute, medicalStaffRoute]),
  feedbackRoute,
  loginRoute,
  registerRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
