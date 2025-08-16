import axiosInstance from './axiosInstance'

// 📌 Get card price
export const getCardPrice = async () => {
  const res = await axiosInstance.get(`/card/price`)
  return res.data
}

// 📌 Update card price
export const updateCardPrice = async (price: number): Promise<{ message: string; price: number }> => {
  // Ensure price is a number
  const formattedPrice = parseFloat(price.toFixed(2))
  const res = await axiosInstance.put<{ message: string; price: number }>(`/card/price`, { price: formattedPrice })
  return res.data
}

// 📌 Get all issued cards
export const getAllCards = async () => {
  const res = await axiosInstance.get(`/card/cards`)
  return res.data.cards // returns the array of cards
}

// 📌 Issue a driver card
export const issueDriverCard = async (tagUid: string, userUid: string): Promise<{ message: string; cardId: string; tagUid: string; userUid: string }> => {
  const res = await axiosInstance.post(`/card/driver-issuance`, { tagUid, userUid });
  return res.data;
}
