import axiosInstance from './axiosInstance';

// 📌 Add new device
export const addDevice = async (deviceData) => {
  const res = await axiosInstance.post(`/device`, deviceData)
  return res.data
}

// 📌 Get all devices
export const getAllDevices = async () => {
  const res = await axiosInstance.get(`/device`)
  return res.data
}

// 📌 Get device by UID
export const getDeviceByUID = async (uid) => {
  const res = await axiosInstance.get(`/device/${uid}`)
  return res.data
}

// 📌 Update device by UID
export const updateDeviceByUID = async (uid, updates) => {
  const res = await axiosInstance.put(`/device/${uid}`, updates)
  return res.data
}
