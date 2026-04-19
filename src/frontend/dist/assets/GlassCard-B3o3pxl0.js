import { r as reactExports, j as jsxRuntimeExports, m as motion, F as cn } from "./index-Ch_J1oJE.js";
const variantClasses$1 = {
  default: "glass glass-rim text-vibrant-primary hover:shadow-glass-md hover:border-white/20",
  primary: "text-[oklch(0.08_0.02_245)] font-semibold shadow-glass-glow hover:shadow-glass-lg",
  ghost: "bg-transparent border-transparent text-vibrant-secondary hover:glass hover:text-vibrant-primary",
  danger: "glass glass-rim text-warning border-warning/20 hover:border-warning/40 hover:shadow-[0_0_16px_oklch(0.60_0.20_25_/_0.3)]",
  success: "glass glass-rim text-success border-success/20 hover:border-success/40 hover:shadow-[0_0_16px_oklch(0.70_0.18_145_/_0.3)]"
};
const primaryBg = "linear-gradient(135deg, oklch(0.78 0.20 220) 0%, oklch(0.68 0.22 230) 100%)";
const sizeClasses = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-12 px-6 text-base rounded-2xl",
  icon: "h-10 w-10 rounded-xl p-0 flex items-center justify-center"
};
const GlassButton = reactExports.forwardRef(
  ({
    variant = "default",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    className,
    children,
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || isLoading;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.button,
      {
        ref,
        whileHover: isDisabled ? {} : { scale: 1.02 },
        whileTap: isDisabled ? {} : { scale: 0.97 },
        transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
        disabled: isDisabled,
        className: cn(
          "relative inline-flex items-center justify-center gap-2",
          "font-medium tracking-wide select-none cursor-pointer",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantClasses$1[variant],
          sizeClasses[size],
          variant !== "primary" && variant !== "ghost" && "border",
          className
        ),
        style: variant === "primary" ? {
          background: primaryBg,
          border: "1px solid rgba(255,255,255,0.2)"
        } : void 0,
        ...props,
        children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          leftIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0", children: leftIcon }),
          children,
          rightIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0", children: rightIcon })
        ] })
      }
    );
  }
);
GlassButton.displayName = "GlassButton";
const variantClasses = {
  default: "glass",
  light: "glass-light",
  heavy: "glass-heavy",
  glow: "glass"
};
const glowClasses = {
  none: "",
  sm: "shadow-glass-sm",
  md: "shadow-glass-md",
  lg: "shadow-glass-lg"
};
const radiusClasses = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-[20px]",
  "2xl": "rounded-[24px]"
};
const GlassCard = reactExports.forwardRef(
  ({
    variant = "default",
    glow = "none",
    radius = "lg",
    noPadding = false,
    as: Component = "div",
    className,
    children,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Component,
      {
        ref,
        className: cn(
          "relative overflow-hidden",
          variantClasses[variant],
          glowClasses[glow],
          radiusClasses[radius],
          !noPadding && "p-4",
          variant === "glow" && "animate-pulse-glow",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "pointer-events-none absolute inset-0",
              style: {
                borderRadius: "inherit",
                background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 55%)"
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "pointer-events-none absolute inset-0 noise-texture opacity-50",
              style: { borderRadius: "inherit", mixBlendMode: "overlay" },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10", children })
        ]
      }
    );
  }
);
GlassCard.displayName = "GlassCard";
export {
  GlassButton as G,
  GlassCard as a
};
