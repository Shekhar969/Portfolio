import { Component, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

class PageErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.error(error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div role="alert" className="mx-auto max-w-content px-4 py-24 text-center sm:px-6">
          <p className="font-medium">Something went wrong on this page.</p>
          <a href="/" className="mt-3 inline-block text-sm text-accent hover:underline">
            Back home →
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Layout() {
  const { pathname } = useLocation();

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
        <PageErrorBoundary key={pathname}>
          <Suspense
            fallback={
              <p className="py-24 text-center text-sm text-muted-foreground">
                Loading…
              </p>
            }
          >
            <Outlet />
          </Suspense>
        </PageErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}