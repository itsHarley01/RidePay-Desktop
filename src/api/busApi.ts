import axiosInstance from './axiosInstance'; // ✅ import the configured axios instance

// 📌 GET: All Buses
export const getAllBuses = async () => {
  const res = await axiosInstance.get('/buses');
  return res.data;
};

// 📌 POST: Add New Bus
export const addNewBus = async (busData: any) => {
  const res = await axiosInstance.post('/add-bus', busData);
  return res.data;
};

// 📌 GET: Get Bus by ID
export const getBusById = async (busUID: string) => {
  const res = await axiosInstance.get(`/bus-edit/${busUID}`);
  return res.data;
};

// 📌 PUT: Update Bus by ID
export const updateBusById = async (busUID: string, updates: any) => {
  const res = await axiosInstance.put(`/bus-edit/${busUID}`, updates);
  return res.data;
};

