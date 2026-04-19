import BottomNav from "@/components/layout/BottomNav";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";

// ─── Lazy page imports ────────────────────────────────────────────────────────
const WorldClockPage = lazy(() => import("@/pages/WorldClockPage"));
const AlarmPage = lazy(() => import("@/pages/AlarmPage"));
const StopwatchPage = lazy(() => import("@/pages/StopwatchPage"));
const TimerPage = lazy(() => import("@/pages/TimerPage"));

// ─── Page wrapper with entrance animation ────────────────────────────────────
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="flex-1 min-h-0"
    >
      {children}
    </motion.div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
    </div>
  );
}

// ─── Root layout ──────────────────────────────────────────────────────────────
function RootLayout() {
  return (
    <div
      className="flex flex-col min-h-dvh overflow-hidden relative"
      style={{ background: "oklch(0.08 0.02 245)" }}
    >
      {/* Deep space ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.20 0.06 230 / 0.35) 0%, transparent 70%)",
        }}
      />

      {/* Scrollable content area with bottom padding for nav */}
      <main
        className="relative z-10 flex-1 overflow-y-auto scrollbar-hide pb-32"
        id="main-content"
      >
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </AnimatePresence>
      </main>

      {/* Bottom pill navigation */}
      <BottomNav />
    </div>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/worldclock" });
  },
});

const worldclockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/worldclock",
  component: () => (
    <PageTransition>
      <WorldClockPage />
    </PageTransition>
  ),
});

const alarmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alarm",
  component: () => (
    <PageTransition>
      <AlarmPage />
    </PageTransition>
  ),
});

const stopwatchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stopwatch",
  component: () => (
    <PageTransition>
      <StopwatchPage />
    </PageTransition>
  ),
});

const timerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/timer",
  component: () => (
    <PageTransition>
      <TimerPage />
    </PageTransition>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  worldclockRoute,
  alarmRoute,
  stopwatchRoute,
  timerRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── App entry ────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
