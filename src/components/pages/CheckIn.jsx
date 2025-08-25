import { useState, useEffect } from "react";
import Layout from "@/components/organisms/Layout";
import BookingList from "@/components/organisms/BookingList";
import SearchBar from "@/components/molecules/SearchBar";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { bookingService } from "@/services/api/bookingService";
import { roomService } from "@/services/api/roomService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const CheckIn = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("arrivals");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [bookingsData, roomsData] = await Promise.all([
        bookingService.getAll(),
        roomService.getAll()
      ]);
      
      // Enhance bookings with room information
      const enhancedBookings = bookingsData.map(booking => {
        const room = roomsData.find(r => r.Id === booking.roomId);
        return {
          ...booking,
          roomNumber: room ? room.number : `Room ${booking.roomId}`
        };
      });
      
      setBookings(enhancedBookings);
      setRooms(roomsData);
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = [];

    if (activeTab === "arrivals") {
      // Today's check-ins
      filtered = bookings.filter(booking => {
        const checkInDate = new Date(booking.checkIn);
        checkInDate.setHours(0, 0, 0, 0);
        return checkInDate.getTime() === today.getTime() && booking.status === "confirmed";
      });
    } else {
      // Today's check-outs
      filtered = bookings.filter(booking => {
        const checkOutDate = new Date(booking.checkOut);
        checkOutDate.setHours(0, 0, 0, 0);
        return checkOutDate.getTime() === today.getTime() && booking.status === "confirmed";
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, activeTab]);

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
          toast.success(`${booking.guestName} checked in successfully!`);
          break;
        case "checkout":
          // Update room status to dirty (needs cleaning)
          const roomToClean = rooms.find(r => r.Id === booking.roomId);
          if (roomToClean) {
            await roomService.update(roomToClean.Id, { ...roomToClean, status: "dirty" });
          }
          toast.success(`${booking.guestName} checked out successfully!`);
          break;
        default:
          break;
      }
      loadData();
    } catch (error) {
      toast.error(`Failed to ${action} guest`);
    }
  };

  const tabs = [
    { id: "arrivals", label: "Today's Arrivals", icon: "UserCheck" },
    { id: "departures", label: "Today's Departures", icon: "LogOut" }
  ];

  const getQuickStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const arrivals = bookings.filter(booking => {
      const checkInDate = new Date(booking.checkIn);
      checkInDate.setHours(0, 0, 0, 0);
      return checkInDate.getTime() === today.getTime() && booking.status === "confirmed";
    });

    const departures = bookings.filter(booking => {
      const checkOutDate = new Date(booking.checkOut);
      checkOutDate.setHours(0, 0, 0, 0);
      return checkOutDate.getTime() === today.getTime();
    });

    return { arrivals: arrivals.length, departures: departures.length };
  };

  const stats = getQuickStats();

  if (loading) {
    return (
      <Layout title="Check-in/out" subtitle="Process guest arrivals and departures">
        <Loading type="skeleton" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Check-in/out" subtitle="Process guest arrivals and departures">
        <Error message={error} onRetry={loadData} />
      </Layout>
    );
  }

  return (
    <Layout title="Check-in/out" subtitle="Process guest arrivals and departures">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Today's Arrivals</p>
                <p className="text-3xl font-display font-bold text-green-900">{stats.arrivals}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="UserCheck" className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Today's Departures</p>
                <p className="text-3xl font-display font-bold text-blue-900">{stats.departures}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="LogOut" className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <SearchBar
                  placeholder="Search by guest name, email, or room..."
                  onSearch={setSearchTerm}
                />
              </div>
              <Button onClick={loadData} variant="outline" className="gap-2">
                <ApperIcon name="RefreshCw" className="w-4 h-4" />
                Refresh
              </Button>
            </div>

            {filteredBookings.length === 0 ? (
              <Empty
                icon={activeTab === "arrivals" ? "UserCheck" : "LogOut"}
                title={`No ${activeTab === "arrivals" ? "arrivals" : "departures"} today`}
                description={
                  searchTerm
                    ? `No ${activeTab} match your search criteria.`
                    : `No guests are scheduled to ${
                        activeTab === "arrivals" ? "check in" : "check out"
                      } today.`
                }
                action={searchTerm ? () => setSearchTerm("") : undefined}
                actionLabel={searchTerm ? "Clear Search" : undefined}
              />
            ) : (
              <BookingList
                bookings={filteredBookings}
                onBookingAction={handleBookingAction}
                loading={false}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckIn;