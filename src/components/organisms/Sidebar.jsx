import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Rooms", href: "/rooms", icon: "Bed" },
    { name: "Bookings", href: "/bookings", icon: "Calendar" },
    { name: "Check-in/out", href: "/checkin", icon: "UserCheck" }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gradient-to-b from-primary-900 to-primary-800 shadow-xl">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-bronze-400 to-bronze-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Hotel" className="w-6 h-6 text-white" />
          </div>
          <span className="ml-3 text-xl font-display font-bold text-white">StayFlow</span>
        </div>
        <nav className="flex-1 px-3 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-bronze-400 to-bronze-500 text-white shadow-lg transform scale-[1.02]"
                    : "text-primary-200 hover:bg-primary-700/50 hover:text-white hover:scale-[1.02]"
                )
              }
            >
              <ApperIcon
                name={item.icon}
                className="mr-3 flex-shrink-0 w-5 h-5"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-200"
        >
          <ApperIcon name="Menu" className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-primary-900 to-primary-800 shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={toggleMobileMenu}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <ApperIcon name="X" className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-6 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-bronze-400 to-bronze-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Hotel" className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-display font-bold text-white">StayFlow</span>
              </div>
              <nav className="px-3 space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={toggleMobileMenu}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-bronze-400 to-bronze-500 text-white shadow-lg"
                          : "text-primary-200 hover:bg-primary-700/50 hover:text-white"
                      )
                    }
>
                    <ApperIcon
                      name={item.icon}
                      className="mr-3 flex-shrink-0 w-5 h-5"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;