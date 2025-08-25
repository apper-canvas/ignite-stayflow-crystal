import { useState, useEffect } from "react";
import Layout from "@/components/organisms/Layout";
import RoomGrid from "@/components/organisms/RoomGrid";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { roomService } from "@/services/api/roomService";
import { toast } from "react-toastify";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await roomService.getAll();
      setRooms(data);
      setFilteredRooms(data);
    } catch (err) {
      setError("Failed to load rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    let filtered = rooms;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(room =>
        room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(room => room.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(room => room.type === typeFilter);
    }

    setFilteredRooms(filtered);
  }, [rooms, searchTerm, statusFilter, typeFilter]);

  const handleRoomAction = async (room, action) => {
    try {
      let updatedRoom = { ...room };

      switch (action) {
        case "book":
          // In a real app, this would open booking modal
          toast.info("Booking functionality would open here");
          return;
        case "checkout":
          updatedRoom.status = "dirty";
          break;
        case "clean":
          updatedRoom.status = "available";
          break;
        case "fixed":
          updatedRoom.status = "available";
          break;
        default:
          return;
      }

      await roomService.update(room.Id, updatedRoom);
      toast.success(`Room ${room.number} updated successfully!`);
      loadRooms();
    } catch (error) {
      toast.error(`Failed to update room ${room.number}`);
    }
  };

  const uniqueTypes = [...new Set(rooms.map(room => room.type))];
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "available", label: "Available" },
    { value: "occupied", label: "Occupied" },
    { value: "maintenance", label: "Maintenance" },
    { value: "dirty", label: "Dirty" }
  ];

  if (loading) {
    return (
      <Layout title="Rooms" subtitle="Manage room availability and status">
        <Loading type="skeleton" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Rooms" subtitle="Manage room availability and status">
        <Error message={error} onRetry={loadRooms} />
      </Layout>
    );
  }

  return (
    <Layout title="Rooms" subtitle="Manage room availability and status">
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search by room number or type..."
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

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <Button onClick={loadRooms} variant="outline" className="gap-2">
                <ApperIcon name="RefreshCw" className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Room Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statusOptions.slice(1).map(status => {
            const count = rooms.filter(room => room.status === status.value).length;
            return (
              <div key={status.value} className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-2xl font-display font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600">{status.label}</p>
              </div>
            );
          })}
        </div>

        {/* Room Grid */}
        {filteredRooms.length === 0 ? (
          <Empty
            icon="Bed"
            title="No rooms found"
            description="No rooms match your current filter criteria."
            action={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
            actionLabel="Clear Filters"
          />
        ) : (
          <RoomGrid
            rooms={filteredRooms}
            onRoomAction={handleRoomAction}
            loading={false}
          />
        )}
      </div>
    </Layout>
  );
};

export default Rooms;