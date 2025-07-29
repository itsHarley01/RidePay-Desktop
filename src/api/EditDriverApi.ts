import axiosInstance from './axiosInstance';

export const getDriverDetails = async (uid: string) => {
  try {
    const response = await axiosInstance.get(`/driver-edit/${uid}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch driver details:', error);
    throw error;
  }
};

export const updateDriverDetails = async (uid: string, updatedData: any) => {
  try {
    const response = await axiosInstance.put(`/driver-edit/${uid}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Failed to update driver details:', error);
    throw error;
  }
};
