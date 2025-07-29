import axiosInstance from './axiosInstance';

// 📌 GET: All Drivers
export const getAllDrivers = async () => {
  const res = await axiosInstance.get('/drivers');
  return res.data;
};

// 📌 GET: Driver by UID
export const getDriverById = async (uid: string) => {
  const res = await axiosInstance.get(`/driver/${uid}`);
  return res.data;
};
