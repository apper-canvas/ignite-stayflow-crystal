import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const StatusIndicator = ({
  status,
  showIcon = true,
  showText = true,
  size = "default",
  className
}) => {
  const statusConfig = {
    available: {
      icon: "CheckCircle",
      text: "Available",
      variant: "available",
      color: "text-green-600"
    },
    occupied: {
      icon: "User",
      text: "Occupied",
      variant: "occupied",
      color: "text-yellow-600"
    },
    maintenance: {
      icon: "Wrench",
      text: "Maintenance",
      variant: "maintenance",
      color: "text-red-600"
    },
    dirty: {
      icon: "AlertCircle",
      text: "Dirty",
      variant: "dirty",
      color: "text-gray-600"
    },
    confirmed: {
      icon: "CheckCircle2",
      text: "Confirmed",
      variant: "success",
      color: "text-green-600"
    },
    pending: {
      icon: "Clock",
      text: "Pending",
      variant: "warning",
      color: "text-yellow-600"
    },
    cancelled: {
      icon: "XCircle",
      text: "Cancelled",
      variant: "error",
      color: "text-red-600"
    }
  };

  const config = statusConfig[status] || statusConfig.available;
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {showIcon && (
        <ApperIcon
          name={config.icon}
          className={cn(iconSize, config.color)}
        />
      )}
      {showText && (
        <Badge variant={config.variant} className="text-xs">
          {config.text}
        </Badge>
      )}
    </div>
  );
};

export default StatusIndicator;