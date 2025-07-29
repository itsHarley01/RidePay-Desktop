import axiosInstance from './axiosInstance';

export const getAdminDetails = async (uid: string) => {
  try {
    const response = await axiosInstance.get(`/admin-edit/${uid}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch admin details:', error);
    throw error;
  }
};

export const updateAdminDetails = async (uid: string, updatedData: any) => {
  try {
    const response = await axiosInstance.put(`/admin-edit/${uid}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Failed to update admin details:', error);
    throw error;
  }
};
