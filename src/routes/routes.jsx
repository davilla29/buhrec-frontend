import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { Route, createRoutesFromElements } from "react-router-dom";
// import Notfound from "../pages/Notfound";
import ProtectedRoute from "../routes/ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";

const RootLayout = lazy(() => import("../layouts/RootLayout"));
const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));
const DashboardNotFoundPage = lazy(() => import("../pages/DashboardNotFound"));

const HomePage = lazy(() => import("../pages/Home"));
const ContactPage = lazy(() => import("../pages/Contact"));
const ObjectivesPage = lazy(() => import("../pages/Objectives"));
const SopsGuidelinesPage = lazy(() => import("../pages/SopsGuidelines"));
const AboutUsPage = lazy(() => import("../pages/AboutUs"));
const NhrecMissionPage = lazy(() => import("../pages/NhrecMission"));
const LandingPage = lazy(() => import("../pages/LandingPage"));
const UnifiedLoginPage = lazy(() => import("../pages/UnifiedLoginPage"));
const ResearcherSignUpPage = lazy(() => import("../pages/researcher/SignUp"));
const VerifyEmailPage = lazy(() => import("../pages/researcher/VerifyEmail"));
const NotificationsPage = lazy(() => import("../pages/Notifications"));

// Admin
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminPaymentsListPage = lazy(() => import("../pages/admin/Payments"));
const AdminReviewersListPage = lazy(
  () => import("../pages/admin/ReviewersList"),
);
const AdminReviewerAssignemntsPage = lazy(
  () => import("../pages/admin/Reviewer_Assignments/AdminReviewerAssignments"),
);
const AdminReviewerAssignmentDetailsPage = lazy(
  () => import("../pages/admin/Reviewer_Assignments/AdminAssignmentDetails"),
);
const AdminAddReviewerPage = lazy(() => import("../pages/admin/AddReviewer"));
const ReviewerAddedSuccessPage = lazy(
  () => import("../pages/admin/ReviewerAddedSuccess"),
);
const AdminAssignmentsPage = lazy(
  () => import("../pages/admin/AdminAssignments"),
);
const AdminUnassignedAssignmentsPage = lazy(
  () => import("../pages/admin/UnAssignedAssignments"),
);
const AdminProposalDetailsPage = lazy(
  () => import("../pages/admin/AdminProposalDetails"),
);
const AdminProposalAssignPage = lazy(
  () => import("../pages/admin/AssignProposal"),
);
const AllUsersPage = lazy(() => import("../pages/admin/AllUsers"));
const AllResearchersPage = lazy(() => import("../pages/admin/AllResearchers"));
const ResearcherProposalsPage = lazy(
  () => import("../pages/admin/ResearcherProposals"),
);

// Researcher
const ResearcherDashboardPage = lazy(
  () => import("../pages/researcher/ResearcherDashboard"),
);
const MyProposalsPage = lazy(() => import("../pages/researcher/Proposals"));
const ProposalSubmissionPage = lazy(
  () => import("../pages/researcher/ProposalSubmission"),
);
const ProposalPaymentPage = lazy(
  () => import("../pages/researcher/ProposalPayment"),
);
const ProposalPaymentSuccessPage = lazy(
  () => import("../pages/researcher/ProposalPaymentSuccess"),
);
const ProposalPaymentFailedPage = lazy(
  () => import("../pages/researcher/ProposalPaymentFailed"),
);
const ProposalSubmittedPage = lazy(
  () => import("../pages/researcher/ProposalSubmitted"),
);
const ProposalDetailsPage = lazy(
  () => import("../pages/researcher/ProposalDetails"),
);
const SubmitRevisionPage = lazy(
  () => import("../pages/researcher/SubmitRevision"),
);
const SubmissionSuccessPage = lazy(
  () => import("../pages/researcher/SubmissionSuccess"),
);
const ProposalDecisionPage = lazy(() => import("../pages/ProposalDecision"));
const ResearcherSettingsPage = lazy(
  () => import("../pages/researcher/ResearcherSettings"),
);

// Reviewer
const ReviewerDashboardPage = lazy(
  () => import("../pages/reviewer/ReviewerDashboard"),
);
const ReviewerAssignmentsPage = lazy(
  () => import("../pages/reviewer/ReviewerAssignments"),
);
const ProposalReviewPage = lazy(
  () => import("../pages/reviewer/ProposalReview"),
);
const ApplicationInfoPage = lazy(
  () => import("../pages/reviewer/ApplicationInfo"),
);
const ReviewerResponsesPage = lazy(
  () => import("../pages/reviewer/ReviewerResponses"),
);
const ReviewerSettingsPage = lazy(
  () => import("../pages/reviewer/ReviewerSettings"),
);

export const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about-us" element={<AboutUsPage />} />
      {/* <Route path="test" element={<ProposalPaymentSuccessPage />} /> */}
      <Route path="objectives" element={<ObjectivesPage />} />
      <Route path="nhrec-mission" element={<NhrecMissionPage />} />
      <Route path="sops-guidelines" element={<SopsGuidelinesPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="login/:role" element={<UnifiedLoginPage />} />
      <Route
        path="/auth/researcher/register"
        element={<ResearcherSignUpPage />}
      />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="*" element={<NotFound />} />
    </Route>

    {/* ADMIN */}
    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route path="admin/dashboard" element={<DashboardLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="payments" element={<AdminPaymentsListPage />} />
        <Route path="reviewers" element={<AdminReviewersListPage />} />
        <Route
          path="reviewers/:reviewerId/assignments"
          element={<AdminReviewerAssignemntsPage />}
        />
        <Route
          path="assignments/:assignmentId/details"
          element={<AdminReviewerAssignmentDetailsPage />}
        />
        <Route path="reviewers/add" element={<AdminAddReviewerPage />} />
        <Route
          path="reviewers/add/success"
          element={<ReviewerAddedSuccessPage />}
        />
        <Route path="assignments" element={<AdminAssignmentsPage />} />
        <Route path="all-users" element={<AllUsersPage />} />
        <Route
          path="assignments/un-assigned"
          element={<AdminUnassignedAssignmentsPage />}
        />
        <Route
          path="proposals/:proposalId/details"
          element={<AdminProposalDetailsPage />}
        />
        <Route
          path="proposals/:proposalId/assign"
          element={<AdminProposalAssignPage />}
        />
        <Route path="researchers" element={<AllResearchersPage />} />
        <Route
          path="researchers/:researcherId/proposals"
          element={<ResearcherProposalsPage />}
        />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="*" element={<DashboardNotFoundPage />} />

        {/* <Route path="manage-users" element={<ManageUsers />} />
        <Route path="settings" element={<AdminSettings />} />
        */}
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={["reviewer"]} />}>
      <Route path="/reviewer/dashboard" element={<DashboardLayout />}>
        <Route index element={<ReviewerDashboardPage />} />
        <Route path="assignments" element={<ReviewerAssignmentsPage />} />
        <Route
          path="assignments/:assignmentId/review"
          element={<ProposalReviewPage />}
        />
        <Route
          path="assignments/:assignmentId/review/:version"
          element={<ProposalReviewPage />}
        />
        <Route
          path="assignments/:assignmentId/info"
          element={<ApplicationInfoPage />}
        />
        <Route path="responses" element={<ReviewerResponsesPage />} />
        <Route path="settings" element={<ReviewerSettingsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        {/* <Route path="assigned-proposals" element={<AssignedProposals />} />
        <Route path="reviews" element={<Reviews />} /> */}
        <Route path="*" element={<DashboardNotFoundPage />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={["researcher"]} />}>
      <Route path="/researcher/dashboard" element={<DashboardLayout />}>
        <Route index element={<ResearcherDashboardPage />} />
        <Route path="my-proposals" element={<MyProposalsPage />} />
        <Route
          path="proposals/:proposalId/draft"
          element={<ProposalSubmissionPage />}
        />
        <Route
          path="proposals/:proposalId/payment"
          element={<ProposalPaymentPage />}
        />
        <Route
          path="proposals/:proposalId/payment-success"
          element={<ProposalPaymentSuccessPage />}
        />
        <Route
          path="proposals/:proposalId/payment-failed"
          element={<ProposalPaymentFailedPage />}
        />
        <Route
          path="proposals/:proposalId/submitted"
          element={<ProposalSubmittedPage />}
        />
        <Route
          path="proposals/:proposalId/details"
          element={<ProposalDetailsPage />}
        />
        <Route
          path="proposals/:proposalId/submit-revision"
          element={<SubmitRevisionPage />}
        />
        <Route
          path="proposals/:proposalId/success"
          element={<SubmissionSuccessPage />}
        />
        <Route
          path="proposals/:proposalId/decision"
          element={<ProposalDecisionPage />}
        />
        ;
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="*" element={<DashboardNotFoundPage />} />
        <Route path="settings" element={<ResearcherSettingsPage />} />
      </Route>
    </Route>
  </>,
);
