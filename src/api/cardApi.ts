import axiosInstance from './axiosInstance'

// 📌 Get card price
export const getCardPrice = async () => {
  const res = await axiosInstance.get(`/card/price`)
  return res.data
}

// 📌 Update card price
export const updateCardPrice = async (price) => {
  const res = await axiosInstance.put(`/card/price`, { price })
  return res.data
}
