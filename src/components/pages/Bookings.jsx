import { useState, useEffect } from "react";
import Layout from "@/components/organisms/Layout";
import BookingList from "@/components/organisms/BookingList";
import BookingModal from "@/components/organisms/BookingModal";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { bookingService } from "@/services/api/bookingService";
import { roomService } from "@/services/api/roomService";
import { toast } from "react-toastify";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadBookings = async () => {
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
      setFilteredBookings(enhancedBookings);
      setRooms(roomsData);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter]);

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
          // Free up the room if it was occupied
          const roomToFree = rooms.find(r => r.Id === booking.roomId);
          if (roomToFree && roomToFree.status === "occupied") {
            await roomService.update(roomToFree.Id, { ...roomToFree, status: "available" });
          }
          toast.success("Booking cancelled!");
          break;
        default:
          break;
      }
      loadBookings();
    } catch (error) {
      toast.error(`Failed to ${action} booking`);
    }
  };

  const handleCreateBooking = async (bookingData) => {
    try {
      await bookingService.create(bookingData);
      // Update room status to occupied
      const room = rooms.find(r => r.Id === bookingData.roomId);
      if (room) {
        await roomService.update(room.Id, { ...room, status: "occupied" });
      }
      loadBookings();
    } catch (error) {
      throw new Error("Failed to create booking");
    }
  };

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "confirmed", label: "Confirmed" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" }
  ];

  if (loading) {
    return (
      <Layout title="Bookings" subtitle="Manage hotel reservations and guest bookings">
        <Loading type="skeleton" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Bookings" subtitle="Manage hotel reservations and guest bookings">
        <Error message={error} onRetry={loadBookings} />
      </Layout>
    );
  }

  return (
    <Layout title="Bookings" subtitle="Manage hotel reservations and guest bookings">
      <div className="space-y-6">
        {/* Filters and Actions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search by guest name, email, or room..."
                onSearch={setSearchTerm}
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Button onClick={loadBookings} variant="outline" className="gap-2">
                <ApperIcon name="RefreshCw" className="w-4 h-4" />
                Refresh
              </Button>

              <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <ApperIcon name="Plus" className="w-4 h-4" />
                New Booking
              </Button>
            </div>
          </div>
        </div>

        {/* Booking Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {statusOptions.slice(1).map(status => {
            const count = bookings.filter(booking => booking.status === status.value).length;
            return (
              <div key={status.value} className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-2xl font-display font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600">{status.label}</p>
              </div>
            );
          })}
        </div>

        {/* Booking List */}
        {filteredBookings.length === 0 ? (
          <Empty
            icon="Calendar"
            title="No bookings found"
            description={searchTerm || statusFilter !== "all" 
              ? "No bookings match your current filter criteria."
              : "No bookings have been created yet. Create your first booking to get started."
            }
            action={searchTerm || statusFilter !== "all" 
              ? () => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }
              : () => setIsModalOpen(true)
            }
            actionLabel={searchTerm || statusFilter !== "all" ? "Clear Filters" : "Create Booking"}
          />
        ) : (
          <BookingList
            bookings={filteredBookings}
            onBookingAction={handleBookingAction}
            loading={false}
          />
        )}

        {/* Booking Modal */}
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateBooking}
          rooms={rooms}
        />
      </div>
    </Layout>
  );
};

export default Bookings;