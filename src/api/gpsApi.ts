// src/api/gpsApi.ts
import axiosInstance from "./axiosInstance";

export const getGpsDataByDeviceId = async (deviceId: string) => {
  try {
    const response = await axiosInstance.get(`/gps/${deviceId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch GPS data:", error);
    throw error;
  }
};
