const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'Rooms';

export const roomService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "number" } },
          { field: { Name: "type" } },
          { field: { Name: "floor" } },
          { field: { Name: "status" } },
          { field: { Name: "price" } },
          { field: { Name: "amenities" } }
        ],
        orderBy: [
          {
            fieldName: "number",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching rooms:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "number" } },
          { field: { Name: "type" } },
          { field: { Name: "floor" } },
          { field: { Name: "status" } },
          { field: { Name: "price" } },
          { field: { Name: "amenities" } }
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching room with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, roomData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            number: roomData.number,
            type: roomData.type,
            floor: parseInt(roomData.floor),
            status: roomData.status,
            price: parseFloat(roomData.price),
            amenities: Array.isArray(roomData.amenities) ? roomData.amenities.join(',') : roomData.amenities
          }
        ]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update room ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating room:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
};