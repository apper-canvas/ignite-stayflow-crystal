import { useState } from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import { cn } from "@/utils/cn";

const BookingList = ({ bookings, onBookingAction, loading }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const getBookingActions = (booking) => {
    switch (booking.status) {
      case "confirmed":
        return [
          { label: "Check In", icon: "UserCheck", action: "checkin", variant: "success" },
          { label: "Cancel", icon: "XCircle", action: "cancel", variant: "danger" }
        ];
      case "pending":
        return [
          { label: "Confirm", icon: "CheckCircle2", action: "confirm", variant: "success" },
          { label: "Cancel", icon: "XCircle", action: "cancel", variant: "danger" }
        ];
      default:
        return [];
    }
  };

  const handleBookingAction = (booking, action) => {
    if (onBookingAction) {
      onBookingAction(booking, action);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-20"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const actions = getBookingActions(booking);
        return (
          <Card
            key={booking.Id}
            className={cn(
              "p-6 transition-all duration-200 hover:shadow-lg",
              selectedBooking?.Id === booking.Id && "ring-2 ring-primary-500 ring-offset-2"
            )}
            onClick={() => setSelectedBooking(booking)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-lg text-gray-900">
                  {booking.guestName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Mail" className="w-4 h-4" />
                    {booking.guestEmail}
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Phone" className="w-4 h-4" />
                    {booking.guestPhone}
                  </div>
                </div>
              </div>
              <StatusIndicator status={booking.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Room</p>
                <p className="text-base text-gray-900">#{booking.roomNumber || booking.roomId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Check-in</p>
                <p className="text-base text-gray-900">
                  {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Check-out</p>
                <p className="text-base text-gray-900">
                  {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Total</p>
                <p className="text-base font-bold text-primary-600">
                  {formatCurrency(booking.totalPrice)}
                </p>
              </div>
            </div>

            {booking.notes && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                <p className="text-sm text-gray-600">{booking.notes}</p>
              </div>
            )}

            {actions.length > 0 && (
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                {actions.map((action) => (
                  <Button
                    key={action.action}
                    size="sm"
                    variant={action.variant}
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookingAction(booking, action.action);
                    }}
                  >
                    <ApperIcon name={action.icon} className="w-4 h-4" />
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default BookingList;