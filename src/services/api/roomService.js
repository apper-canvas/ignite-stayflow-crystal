import roomsData from "@/services/mockData/rooms.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let rooms = [...roomsData];

export const roomService = {
  async getAll() {
    await delay(300);
    return [...rooms];
  },

  async getById(id) {
    await delay(200);
    const room = rooms.find(r => r.Id === id);
    if (!room) throw new Error("Room not found");
    return { ...room };
  },

  async create(roomData) {
    await delay(400);
    const highestId = Math.max(...rooms.map(r => r.Id), 0);
    const newRoom = {
      ...roomData,
      Id: highestId + 1
    };
    rooms.push(newRoom);
    return { ...newRoom };
  },

  async update(id, roomData) {
    await delay(300);
    const index = rooms.findIndex(r => r.Id === id);
    if (index === -1) throw new Error("Room not found");
    
    rooms[index] = { ...roomData, Id: id };
    return { ...rooms[index] };
  },

  async delete(id) {
    await delay(250);
    const index = rooms.findIndex(r => r.Id === id);
    if (index === -1) throw new Error("Room not found");
    
    const deleted = rooms.splice(index, 1)[0];
    return { ...deleted };
  },

  async getAvailable() {
    await delay(250);
    return rooms.filter(room => room.status === "available");
  },

  async getByStatus(status) {
    await delay(250);
    return rooms.filter(room => room.status === status);
  },

  async getByFloor(floor) {
    await delay(250);
    return rooms.filter(room => room.floor === floor);
  }
};