import { cn } from "@/lib/utils";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { Bell, Globe, Hourglass, Timer } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface NavTab {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const TABS: NavTab[] = [
  { id: "worldclock", label: "World Clock", path: "/worldclock", icon: Globe },
  { id: "alarm", label: "Alarm", path: "/alarm", icon: Bell },
  { id: "stopwatch", label: "Stopwatch", path: "/stopwatch", icon: Timer },
  { id: "timer", label: "Timer", path: "/timer", icon: Hourglass },
];

export default function BottomNav() {
  const router = useRouter();
  const location = useRouterState({ select: (s) => s.location });
  const currentPath = location.pathname;

  return (
    <nav
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      aria-label="Main navigation"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
        className="pill-nav"
        style={{ minWidth: 340 }}
      >
        {TABS.map((tab) => {
          const isActive =
            currentPath === tab.path || currentPath.startsWith(`${tab.path}/`);
          const Icon = tab.icon;

          return (
            <motion.button
              key={tab.id}
              data-ocid={`nav.${tab.id}.tab`}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => void router.navigate({ to: tab.path })}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1",
                "min-w-[75px] min-h-[60px] px-3 py-2 rounded-full",
                "transition-colors duration-200 select-none cursor-pointer",
                isActive
                  ? "nav-tab-active text-vibrant-primary"
                  : "text-vibrant-tertiary hover:text-vibrant-secondary",
              )}
              whileHover={!isActive ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Active background capsule */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="active-tab-bg"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "oklch(0.75 0.18 220 / 0.22)",
                      boxShadow:
                        "0 0 18px oklch(0.75 0.18 220 / 0.35), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 0 1px oklch(0.75 0.18 220 / 0.25)",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <motion.span
                className="relative z-10 flex items-center justify-center"
                animate={
                  isActive
                    ? { scale: 1.1, filter: "brightness(1.3)" }
                    : { scale: 1, filter: "brightness(1)" }
                }
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <Icon
                  size={20}
                  className={cn(
                    "transition-colors duration-200",
                    isActive
                      ? "text-[oklch(0.78_0.20_220)]"
                      : "text-vibrant-tertiary",
                  )}
                />
              </motion.span>

              {/* Label */}
              <span
                className={cn(
                  "relative z-10 text-[10px] font-medium leading-tight tracking-wide transition-colors duration-200",
                  isActive ? "text-vibrant-primary" : "text-vibrant-tertiary",
                )}
                style={isActive ? { color: "oklch(0.90 0.04 220)" } : undefined}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Home indicator bar */}
      <div
        className="mx-auto mt-2 h-1 w-28 rounded-full opacity-30"
        style={{ background: "oklch(0.65 0.04 245)" }}
      />
    </nav>
  );
}
