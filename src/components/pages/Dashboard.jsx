import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import DashboardStats from "@/components/organisms/DashboardStats";
import BookingList from "@/components/organisms/BookingList";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { roomService } from "@/services/api/roomService";
import { bookingService } from "@/services/api/bookingService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [todayBookings, setTodayBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [roomsData, bookingsData] = await Promise.all([
        roomService.getAll(),
        bookingService.getAll()
      ]);

      setRooms(roomsData);
      setBookings(bookingsData);

      // Filter today's arrivals and departures
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysArrivals = bookingsData.filter(booking => {
        const checkInDate = new Date(booking.checkIn);
        checkInDate.setHours(0, 0, 0, 0);
        return checkInDate.getTime() === today.getTime() && booking.status === "confirmed";
      });

      const todaysDepartures = bookingsData.filter(booking => {
        const checkOutDate = new Date(booking.checkOut);
        checkOutDate.setHours(0, 0, 0, 0);
        return checkOutDate.getTime() === today.getTime();
      });

      setTodayBookings([...todaysArrivals, ...todaysDepartures].slice(0, 5));

    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleBookingAction = async (booking, action) => {
    try {
      switch (action) {
        case "checkin":
          await bookingService.update(booking.Id, { ...booking, status: "confirmed" });
          // Update room status to occupied
          const room = rooms.find(r => r.Id === booking.roomId);
          if (room) {
            await roomService.update(room.Id, { ...room, status: "occupied" });
          }
          toast.success("Guest checked in successfully!");
          break;
        case "confirm":
          await bookingService.update(booking.Id, { ...booking, status: "confirmed" });
          toast.success("Booking confirmed!");
          break;
        case "cancel":
          await bookingService.update(booking.Id, { ...booking, status: "cancelled" });
          // Free up the room
          const roomToFree = rooms.find(r => r.Id === booking.roomId);
          if (roomToFree && roomToFree.status === "occupied") {
            await roomService.update(roomToFree.Id, { ...roomToFree, status: "available" });
          }
          toast.success("Booking cancelled!");
          break;
        default:
          break;
      }
      loadDashboardData();
    } catch (error) {
      toast.error(`Failed to ${action} booking`);
    }
  };

  const quickActions = [
    {
      title: "New Booking",
      description: "Create a new reservation",
      icon: "Plus",
      color: "text-green-600",
      bgColor: "from-green-50 to-green-100",
      action: () => navigate("/bookings")
    },
    {
      title: "Check-in Guest",
      description: "Process guest arrival",
      icon: "UserCheck",
      color: "text-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      action: () => navigate("/checkin")
    },
    {
      title: "View Rooms",
      description: "Manage room status",
      icon: "Bed",
      color: "text-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      action: () => navigate("/rooms")
    }
  ];

  if (loading) {
    return (
      <Layout title="Dashboard" subtitle="Hotel overview and today's activities">
        <Loading type="skeleton" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard" subtitle="Hotel overview and today's activities">
        <Error message={error} onRetry={loadDashboardData} />
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" subtitle="Hotel overview and today's activities">
      <div className="space-y-8">
        {/* Dashboard Statistics */}
        <DashboardStats rooms={rooms} bookings={bookings} />

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-display font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r ${action.bgColor}`}
                onClick={action.action}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center ${action.color} mr-4`}>
                    <ApperIcon name={action.icon} className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Today's Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-gray-900">Today's Activity</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/bookings")}
              className="gap-2"
            >
              <ApperIcon name="Calendar" className="w-4 h-4" />
              View All Bookings
            </Button>
          </div>
          
          {todayBookings.length === 0 ? (
            <Empty
              icon="Calendar"
              title="No activity today"
              description="No check-ins or check-outs scheduled for today."
              action={() => navigate("/bookings")}
              actionLabel="View All Bookings"
            />
          ) : (
            <BookingList
              bookings={todayBookings}
              onBookingAction={handleBookingAction}
              loading={false}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;