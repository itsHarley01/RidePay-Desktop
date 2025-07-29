import axiosInstance from './axiosInstance';

export const getAllAdminUsers = async () => {
  try {
    const response = await axiosInstance.get('/user');
    return response.data.users || [];
  } catch (error) {
    console.error('Failed to fetch admin users:', error);
    throw error;
  }
};
