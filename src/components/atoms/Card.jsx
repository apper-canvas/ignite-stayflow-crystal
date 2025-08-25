import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({
  className,
  children,
  variant = "default",
  ...props
}, ref) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    elevated: "bg-white border border-gray-200 shadow-lg",
    glass: "bg-white/80 backdrop-blur-sm border border-white/20 shadow-md",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-md"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;