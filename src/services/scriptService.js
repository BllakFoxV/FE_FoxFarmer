import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const scriptService = {
  // Lưu script
  saveScript: async (name, actions) => {
    try {
      const response = await axios.post(`${API_BASE}/api/v1/scripts/save`, {
        name: name.endsWith('.json') ? name : `${name}.json`,
        data: actions
      });
      return response.data;
    } catch (error) {
      console.error("Save failed:", error);
      throw error;
    }
  },

  // Lấy screenshot mới nhất từ thiết bị để Pick
  getScreenshot: async (deviceId) => {
    const response = await axios.get(`${API_BASE}/api/v1/devices/${deviceId}/screenshot`);
    return response.data.image; // Trả về chuỗi Base64
  }
};