import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ title, subtitle, className }) => {
  const currentDate = format(new Date(), "EEEE, MMMM do, yyyy");

  return (
    <div className={cn("bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 px-4 py-6 sm:px-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
          {currentDate}
        </div>
      </div>
    </div>
  );
};

export default Header;