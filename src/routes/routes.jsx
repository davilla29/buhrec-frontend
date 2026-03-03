import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { Route, createRoutesFromElements } from "react-router-dom";
// import Notfound from "../pages/Notfound";

const RootLayout = lazy(() => import("../layouts/RootLayout"));

const HomePage = lazy(() => import("../pages/Home"));
const UnifiedLoginPage = lazy(() => import("../pages/UnifiedLoginPage"));

export const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/login/:role" element={<UnifiedLoginPage />} />
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
  </>,
);
