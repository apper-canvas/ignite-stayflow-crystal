import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const BookingModal = ({ isOpen, onClose, onSubmit, rooms, selectedRoom }) => {
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    roomId: selectedRoom?.Id || "",
    checkIn: format(new Date(), "yyyy-MM-dd"),
    checkOut: format(new Date(Date.now() + 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    notes: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedRoom) {
      setFormData(prev => ({ ...prev, roomId: selectedRoom.Id }));
    }
  }, [selectedRoom]);

  const calculateTotal = () => {
    const room = rooms?.find(r => r.Id === parseInt(formData.roomId));
    if (!room || !formData.checkIn || !formData.checkOut) return 0;

    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights * room.price : 0;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.guestName.trim()) newErrors.guestName = "Guest name is required";
    if (!formData.guestEmail.trim()) newErrors.guestEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.guestEmail)) newErrors.guestEmail = "Invalid email format";
    if (!formData.guestPhone.trim()) newErrors.guestPhone = "Phone number is required";
    if (!formData.roomId) newErrors.roomId = "Room selection is required";
    if (!formData.checkIn) newErrors.checkIn = "Check-in date is required";
    if (!formData.checkOut) newErrors.checkOut = "Check-out date is required";

    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    if (checkIn >= checkOut) {
      newErrors.checkOut = "Check-out date must be after check-in date";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData = {
        ...formData,
        roomId: parseInt(formData.roomId),
        totalPrice: calculateTotal(),
        status: "confirmed"
      };

      await onSubmit(bookingData);
      toast.success("Booking created successfully!");
      onClose();
      setFormData({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        roomId: "",
        checkIn: format(new Date(), "yyyy-MM-dd"),
        checkOut: format(new Date(Date.now() + 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        notes: ""
      });
    } catch (error) {
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const availableRooms = rooms?.filter(room => room.status === "available") || [];
  const totalPrice = calculateTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={onClose}
                >
                  <ApperIcon name="X" className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-0 sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-display font-semibold leading-6 text-gray-900 mb-6">
                    Create New Booking
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>Guest Name</Label>
                        <Input
                          name="guestName"
                          value={formData.guestName}
                          onChange={handleInputChange}
                          placeholder="Enter guest name"
                          error={errors.guestName}
                        />
                        {errors.guestName && (
                          <p className="text-sm text-red-600 mt-1">{errors.guestName}</p>
                        )}
                      </div>

                      <div>
                        <Label required>Email</Label>
                        <Input
                          type="email"
                          name="guestEmail"
                          value={formData.guestEmail}
                          onChange={handleInputChange}
                          placeholder="Enter email address"
                          error={errors.guestEmail}
                        />
                        {errors.guestEmail && (
                          <p className="text-sm text-red-600 mt-1">{errors.guestEmail}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>Phone</Label>
                        <Input
                          name="guestPhone"
                          value={formData.guestPhone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          error={errors.guestPhone}
                        />
                        {errors.guestPhone && (
                          <p className="text-sm text-red-600 mt-1">{errors.guestPhone}</p>
                        )}
                      </div>

                      <div>
                        <Label required>Room</Label>
                        <select
                          name="roomId"
                          value={formData.roomId}
                          onChange={handleInputChange}
                          className={cn(
                            "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                            errors.roomId && "border-red-300"
                          )}
                        >
                          <option value="">Select a room</option>
                          {availableRooms.map(room => (
                            <option key={room.Id} value={room.Id}>
                              Room {room.number} - {room.type} (${room.price}/night)
                            </option>
                          ))}
                        </select>
                        {errors.roomId && (
                          <p className="text-sm text-red-600 mt-1">{errors.roomId}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>Check-in Date</Label>
                        <Input
                          type="date"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleInputChange}
                          error={errors.checkIn}
                        />
                        {errors.checkIn && (
                          <p className="text-sm text-red-600 mt-1">{errors.checkIn}</p>
                        )}
                      </div>

                      <div>
                        <Label required>Check-out Date</Label>
                        <Input
                          type="date"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleInputChange}
                          error={errors.checkOut}
                        />
                        {errors.checkOut && (
                          <p className="text-sm text-red-600 mt-1">{errors.checkOut}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Notes</Label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                        placeholder="Any special requests or notes..."
                      />
                    </div>

                    {totalPrice > 0 && (
                      <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg border border-primary-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-primary-800">Total Price:</span>
                          <span className="text-xl font-display font-bold text-primary-900">
                            ${totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <ApperIcon name="Plus" className="w-4 h-4" />
                            Create Booking
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;