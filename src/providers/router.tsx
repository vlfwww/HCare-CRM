import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { RootLayout } from "../widgets/Layout/RootLayout";
import { PatientProfilePage } from "../features/patient-profile/ui/PatientProfilePage";
import { MedicalStaffPage } from "../features/medical-staff/ui/MedicalStaffPage";
import { FeedbackPage } from "../features/feedback/ui/FeedbackPage";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: PatientProfilePage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: PatientProfilePage,
});

const medicalStaffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/medical-staff",
  component: MedicalStaffPage,
});

const feedbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/feedback",
  component: FeedbackPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileRoute,
  medicalStaffRoute,
  feedbackRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
