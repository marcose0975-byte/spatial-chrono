import { cn } from "@/lib/utils";
import type { GlassVariant, GlowLevel } from "@/types";
import { forwardRef } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  glow?: GlowLevel;
  radius?: "sm" | "md" | "lg" | "xl" | "2xl";
  noPadding?: boolean;
  as?: React.ElementType;
}

const variantClasses: Record<GlassVariant, string> = {
  default: "glass",
  light: "glass-light",
  heavy: "glass-heavy",
  glow: "glass",
};

const glowClasses: Record<GlowLevel, string> = {
  none: "",
  sm: "shadow-glass-sm",
  md: "shadow-glass-md",
  lg: "shadow-glass-lg",
};

const radiusClasses = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-[20px]",
  "2xl": "rounded-[24px]",
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = "default",
      glow = "none",
      radius = "lg",
      noPadding = false,
      as: Component = "div",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          variantClasses[variant],
          glowClasses[glow],
          radiusClasses[radius],
          !noPadding && "p-4",
          variant === "glow" && "animate-pulse-glow",
          className,
        )}
        {...props}
      >
        {/* Specular rim highlight */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: "inherit",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 55%)",
          }}
          aria-hidden="true"
        />
        {/* Noise texture for glass depth */}
        <div
          className="pointer-events-none absolute inset-0 noise-texture opacity-50"
          style={{ borderRadius: "inherit", mixBlendMode: "overlay" }}
          aria-hidden="true"
        />
        {/* Content */}
        <div className="relative z-10">{children}</div>
      </Component>
    );
  },
);

GlassCard.displayName = "GlassCard";
export default GlassCard;
