const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'Bookings';

export const bookingService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "guestName" } },
          { field: { Name: "guestEmail" } },
          { field: { Name: "guestPhone" } },
          { field: { Name: "roomId" } },
          { field: { Name: "checkIn" } },
          { field: { Name: "checkOut" } },
          { field: { Name: "status" } },
          { field: { Name: "totalPrice" } },
          { field: { Name: "notes" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "DESC"
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
        console.error("Error fetching bookings:", error?.response?.data?.message);
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
          { field: { Name: "guestName" } },
          { field: { Name: "guestEmail" } },
          { field: { Name: "guestPhone" } },
          { field: { Name: "roomId" } },
          { field: { Name: "checkIn" } },
          { field: { Name: "checkOut" } },
          { field: { Name: "status" } },
          { field: { Name: "totalPrice" } },
          { field: { Name: "notes" } }
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
        console.error(`Error fetching booking with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async create(bookingData) {
    try {
      const params = {
        records: [
          {
            guestName: bookingData.guestName,
            guestEmail: bookingData.guestEmail,
            guestPhone: bookingData.guestPhone,
            roomId: parseInt(bookingData.roomId),
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            status: bookingData.status || "confirmed",
            totalPrice: parseFloat(bookingData.totalPrice),
            notes: bookingData.notes || ""
          }
        ]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create booking ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating booking:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, bookingData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            guestName: bookingData.guestName,
            guestEmail: bookingData.guestEmail,
            guestPhone: bookingData.guestPhone,
            roomId: parseInt(bookingData.roomId),
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            status: bookingData.status,
            totalPrice: parseFloat(bookingData.totalPrice),
            notes: bookingData.notes || ""
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
          console.error(`Failed to update booking ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating booking:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete booking ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting booking:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
};