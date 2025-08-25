import bookingsData from "@/services/mockData/bookings.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let bookings = [...bookingsData];

export const bookingService = {
  async getAll() {
    await delay(350);
    return [...bookings];
  },

  async getById(id) {
    await delay(200);
    const booking = bookings.find(b => b.Id === id);
    if (!booking) throw new Error("Booking not found");
    return { ...booking };
  },

  async create(bookingData) {
    await delay(450);
    const highestId = Math.max(...bookings.map(b => b.Id), 0);
    const newBooking = {
      ...bookingData,
      Id: highestId + 1
    };
    bookings.push(newBooking);
    return { ...newBooking };
  },

  async update(id, bookingData) {
    await delay(300);
    const index = bookings.findIndex(b => b.Id === id);
    if (index === -1) throw new Error("Booking not found");
    
    bookings[index] = { ...bookingData, Id: id };
    return { ...bookings[index] };
  },

  async delete(id) {
    await delay(250);
    const index = bookings.findIndex(b => b.Id === id);
    if (index === -1) throw new Error("Booking not found");
    
    const deleted = bookings.splice(index, 1)[0];
    return { ...deleted };
  },

  async getByStatus(status) {
    await delay(250);
    return bookings.filter(booking => booking.status === status);
  },

  async getByGuest(guestName) {
    await delay(250);
    return bookings.filter(booking => 
      booking.guestName.toLowerCase().includes(guestName.toLowerCase())
    );
  },

  async getByDateRange(startDate, endDate) {
    await delay(300);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      return (checkIn >= start && checkIn <= end) || 
             (checkOut >= start && checkOut <= end) ||
             (checkIn <= start && checkOut >= end);
    });
  },

  async getTodayArrivals() {
    await delay(200);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      checkIn.setHours(0, 0, 0, 0);
      return checkIn.getTime() === today.getTime() && booking.status === "confirmed";
    });
  },

  async getTodayDepartures() {
    await delay(200);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return bookings.filter(booking => {
      const checkOut = new Date(booking.checkOut);
      checkOut.setHours(0, 0, 0, 0);
      return checkOut.getTime() === today.getTime();
    });
  }
};