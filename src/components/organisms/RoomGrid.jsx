import { useState } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import { cn } from "@/utils/cn";

const RoomGrid = ({ rooms, onRoomSelect, onRoomAction, loading }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const getRoomStatusColor = (status) => {
    const colors = {
      available: "border-l-green-500 bg-gradient-to-r from-green-50 to-white",
      occupied: "border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white",
      maintenance: "border-l-red-500 bg-gradient-to-r from-red-50 to-white",
      dirty: "border-l-gray-500 bg-gradient-to-r from-gray-50 to-white"
    };
    return colors[status] || colors.available;
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    if (onRoomSelect) {
      onRoomSelect(room);
    }
  };

  const handleQuickAction = (room, action, e) => {
    e.stopPropagation();
    if (onRoomAction) {
      onRoomAction(room, action);
    }
  };

  const getQuickActions = (room) => {
    switch (room.status) {
      case "available":
        return [
          { label: "Book", icon: "Plus", action: "book", variant: "default" }
        ];
      case "occupied":
        return [
          { label: "Check Out", icon: "LogOut", action: "checkout", variant: "secondary" }
        ];
      case "dirty":
        return [
          { label: "Clean", icon: "Sparkles", action: "clean", variant: "success" }
        ];
      case "maintenance":
        return [
          { label: "Fixed", icon: "CheckCircle", action: "fixed", variant: "success" }
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-32 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {rooms.map((room) => {
        const quickActions = getQuickActions(room);
        return (
          <Card
            key={room.Id}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-l-4",
              getRoomStatusColor(room.status),
              selectedRoom?.Id === room.Id && "ring-2 ring-primary-500 ring-offset-2"
            )}
            onClick={() => handleRoomClick(room)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-gray-900">
                  {room.number}
                </h3>
                <p className="text-sm text-gray-600">{room.type}</p>
                <p className="text-xs text-gray-500">Floor {room.floor}</p>
              </div>
              <StatusIndicator status={room.status} showText={false} size="sm" />
            </div>

            <div className="flex items-center justify-between text-sm mb-3">
              <span className="font-medium text-primary-600">
                ${room.price}/night
              </span>
              <StatusIndicator status={room.status} showIcon={false} size="sm" />
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {room.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-bronze-100 text-bronze-800"
                  >
                    {amenity}
                  </span>
                ))}
                {room.amenities.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{room.amenities.length - 3} more
                  </span>
                )}
              </div>
            )}

            {quickActions.length > 0 && (
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    size="sm"
                    variant={action.variant}
                    className="flex-1 gap-1 text-xs"
                    onClick={(e) => handleQuickAction(room, action.action, e)}
                  >
                    <ApperIcon name={action.icon} className="w-3 h-3" />
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

export default RoomGrid;