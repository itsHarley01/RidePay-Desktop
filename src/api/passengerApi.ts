import axiosInstance from './axiosInstance'

// 📌 Get all passengers
export const getAllPassengers = async () => {
  const res = await axiosInstance.get('/passengers')
  return res.data // returns an array of passengers
}

// 📌 Search passenger by email
export const getPassengerByEmail = async (email: string) => {
  const res = await axiosInstance.get(`/passengers?email=${email}`)
  return res.data // returns one passenger object
}

// 📌 Search passenger by systemUid
export const getPassengerBySystemUid = async (systemUid: string) => {
  const res = await axiosInstance.get(`/passengers?systemUid=${systemUid}`)
  return res.data // returns one passenger object
}
