import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { forwardRef } from "react";

type ButtonVariant = "default" | "primary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "glass glass-rim text-vibrant-primary hover:shadow-glass-md hover:border-white/20",
  primary:
    "text-[oklch(0.08_0.02_245)] font-semibold shadow-glass-glow hover:shadow-glass-lg",
  ghost:
    "bg-transparent border-transparent text-vibrant-secondary hover:glass hover:text-vibrant-primary",
  danger:
    "glass glass-rim text-warning border-warning/20 hover:border-warning/40 hover:shadow-[0_0_16px_oklch(0.60_0.20_25_/_0.3)]",
  success:
    "glass glass-rim text-success border-success/20 hover:border-success/40 hover:shadow-[0_0_16px_oklch(0.70_0.18_145_/_0.3)]",
};

const primaryBg =
  "linear-gradient(135deg, oklch(0.78 0.20 220) 0%, oklch(0.68 0.22 230) 100%)";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-12 px-6 text-base rounded-2xl",
  icon: "h-10 w-10 rounded-xl p-0 flex items-center justify-center",
};

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileHover={isDisabled ? {} : { scale: 1.02 }}
        whileTap={isDisabled ? {} : { scale: 0.97 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        disabled={isDisabled}
        className={cn(
          "relative inline-flex items-center justify-center gap-2",
          "font-medium tracking-wide select-none cursor-pointer",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          variant !== "primary" && variant !== "ghost" && "border",
          className,
        )}
        style={
          variant === "primary"
            ? {
                background: primaryBg,
                border: "1px solid rgba(255,255,255,0.2)",
              }
            : undefined
        }
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {isLoading ? (
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  },
);

GlassButton.displayName = "GlassButton";
export default GlassButton;
