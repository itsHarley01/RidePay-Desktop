import axiosInstance from './axiosInstance';

export const fetchUserById = async (uid: string) => {
  try {
    const response = await axiosInstance.get(`/user/${uid}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch user by UID:', error);
    throw error;
  }
};
