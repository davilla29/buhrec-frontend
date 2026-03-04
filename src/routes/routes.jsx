import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { Route, createRoutesFromElements } from "react-router-dom";
// import Notfound from "../pages/Notfound";
import ProtectedRoute from "../routes/ProtectedRoute";

const RootLayout = lazy(() => import("../layouts/RootLayout"));
const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));
const DashboardNotFoundPage = lazy(() => import("../pages/DashboardNotFound"));

const HomePage = lazy(() => import("../pages/Home"));
const UnifiedLoginPage = lazy(() => import("../pages/UnifiedLoginPage"));
const ResearcherSignUpPage = lazy(() => import("../pages/researcher/SignUp"));
const VerifyEmailPage = lazy(() => import("../pages/researcher/VerifyEmail"));
const NotificationsPage = lazy(() => import("../pages/Notifications"));

const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminPaymentsListPage = lazy(() => import("../pages/admin/Payments"));
const AdminReviewersListPage = lazy(
  () => import("../pages/admin/ReviewersList"),
);
const AdminAddReviewerPage = lazy(() => import("../pages/admin/AddReviewer"));

const ResearcherDashboardPage = lazy(
  () => import("../pages/researcher/ResearcherDashboard"),
);
const MyProposalsPage = lazy(() => import("../pages/researcher/Proposals"));
const ProposalSubmissionPage = lazy(
  () => import("../pages/researcher/ProposalSubmission"),
);

export const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/login/:role" element={<UnifiedLoginPage />} />
      <Route
        path="/auth/researcher/register"
        element={<ResearcherSignUpPage />}
      />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
      {/* <Route
        path="/auth/signup"
        element={
          <RouteWithSkeleton Component={SignUp} Fallback={PagePreloader} />
        }
      />
      <Route
        path="/auth/signin"
        element={
          <RouteWithSkeleton Component={SignIn} Fallback={PagePreloader} />
        }
      /> */}

      {/* <Route path="*" element={Notfound} /> */}
    </Route>

    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route path="admin/dashboard" element={<DashboardLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="payments" element={<AdminPaymentsListPage />} />
        <Route path="reviewers" element={<AdminReviewersListPage />} />
        <Route path="reviewers/add" element={<AdminAddReviewerPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="*" element={<DashboardNotFoundPage />} />

        {/* <Route path="manage-users" element={<ManageUsers />} />
        <Route path="settings" element={<AdminSettings />} />
        */}
      </Route>
    </Route>

    {/* <Route element={<ProtectedRoute allowedRoles={["reviewer"]} />}>
      <Route path="/reviewer/dashboard" element={<ReviewerLayout />}>
        <Route index element={<ReviewerDashboard />} />
        <Route path="assigned-proposals" element={<AssignedProposals />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="*" element={<DashboardNotFound />} />
      </Route>
    </Route> */}

    <Route element={<ProtectedRoute allowedRoles={["researcher"]} />}>
      <Route path="/researcher/dashboard" element={<DashboardLayout />}>
        <Route index element={<ResearcherDashboardPage />} />
        <Route path="my-proposals" element={<MyProposalsPage />} />
        <Route
          path="proposals/:proposalId/draft"
          element={<ProposalSubmissionPage />}
        />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="*" element={<DashboardNotFoundPage />} />
        {/* <Route path="submit-proposal" element={<SubmitProposal />} />
     
         */}
      </Route>
    </Route>
  </>,
);
