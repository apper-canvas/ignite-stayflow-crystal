import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({
  className,
  variant = "default",
  size = "default",
  children,
  disabled,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-gradient-to-r from-bronze-100 to-bronze-200 text-bronze-800 border border-bronze-300 hover:from-bronze-200 hover:to-bronze-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    outline: "border border-primary-300 bg-transparent text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:border-primary-400 hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 hover:scale-[1.02] active:scale-[0.98]"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-6 py-2",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;