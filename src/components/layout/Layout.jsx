import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import { SiteProvider } from "../../context/SiteContext";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:text-accent-foreground"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense
          fallback={
            <p className="py-24 text-center text-sm text-muted-foreground">
              Loading…
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </main>
          <SiteProvider>
      <div className="flex min-h-screen flex-col">
        {/* ...existing contents unchanged... */}
      </div>
    </SiteProvider>
      <Footer />
    </div>
  );
}