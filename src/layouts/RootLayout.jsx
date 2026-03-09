import { lazy, Suspense } from "react";
const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));
import { Outlet } from "react-router-dom";
import ScrollToTop from "../hooks/ScrollToTop"

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <Header />

      <main className="grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;
