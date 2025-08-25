import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const DashboardStats = ({ rooms, bookings, className }) => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    occupancyRate: 0,
    todayArrivals: 0,
    todayDepartures: 0,
    revenue: 0,
    maintenanceRooms: 0
  });

  useEffect(() => {
    if (!rooms || !bookings) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Room statistics
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(room => room.status === "occupied").length;
    const availableRooms = rooms.filter(room => room.status === "available").length;
    const maintenanceRooms = rooms.filter(room => room.status === "maintenance").length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Booking statistics
    const todayArrivals = bookings.filter(booking => {
      const checkInDate = new Date(booking.checkIn);
      checkInDate.setHours(0, 0, 0, 0);
      return checkInDate.getTime() === today.getTime() && booking.status === "confirmed";
    }).length;

    const todayDepartures = bookings.filter(booking => {
      const checkOutDate = new Date(booking.checkOut);
      checkOutDate.setHours(0, 0, 0, 0);
      return checkOutDate.getTime() === today.getTime();
    }).length;

    // Revenue calculation (today's bookings)
    const todayRevenue = bookings
      .filter(booking => {
        const checkInDate = new Date(booking.checkIn);
        checkInDate.setHours(0, 0, 0, 0);
        return checkInDate.getTime() === today.getTime() && booking.status === "confirmed";
      })
      .reduce((total, booking) => total + booking.totalPrice, 0);

    setStats({
      totalRooms,
      occupiedRooms,
      availableRooms,
      occupancyRate,
      todayArrivals,
      todayDepartures,
      revenue: todayRevenue,
      maintenanceRooms
    });
  }, [rooms, bookings]);

  const statCards = [
    {
      title: "Total Rooms",
      value: stats.totalRooms,
      icon: "Bed",
      color: "text-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-l-blue-500"
    },
    {
      title: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      icon: "PieChart",
      color: "text-green-600",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-l-green-500"
    },
    {
      title: "Available Rooms",
      value: stats.availableRooms,
      icon: "CheckCircle",
      color: "text-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      borderColor: "border-l-emerald-500"
    },
    {
      title: "Occupied Rooms",
      value: stats.occupiedRooms,
      icon: "User",
      color: "text-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100",
      borderColor: "border-l-yellow-500"
    },
    {
      title: "Today's Arrivals",
      value: stats.todayArrivals,
      icon: "UserCheck",
      color: "text-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-l-purple-500"
    },
    {
      title: "Today's Departures",
      value: stats.todayDepartures,
      icon: "LogOut",
      color: "text-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-l-orange-500"
    },
    {
      title: "Today's Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: "DollarSign",
      color: "text-green-600",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-l-green-500"
    },
    {
      title: "Maintenance",
      value: stats.maintenanceRooms,
      icon: "Wrench",
      color: "text-red-600",
      bgColor: "from-red-50 to-red-100",
      borderColor: "border-l-red-500"
    }
  ];

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {statCards.map((stat, index) => (
        <Card
          key={index}
          className={cn(
            "p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-l-4 bg-gradient-to-r",
            stat.bgColor,
            stat.borderColor
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">{stat.title}</p>
              <p className="text-2xl font-display font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={cn("w-12 h-12 rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center", stat.color)}>
              <ApperIcon name={stat.icon} className="w-6 h-6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;