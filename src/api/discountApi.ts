import axiosInstance from './axiosInstance'

interface Discount {
  rate: number
  validity: number
}

export interface DiscountData {
  student: Discount
  senior: Discount
  pwd: Discount
}

interface UpdateDiscountPayload {
  rate?: number
  validity?: number
}

// 🔹 Update a specific discount type (student, senior, pwd)
export const updateDiscount = async (
  type: 'student' | 'senior' | 'pwd',
  data: UpdateDiscountPayload
) => {
  try {
    const response = await axiosInstance.patch(`/discount/${type}`, data)
    return response.data
  } catch (error: any) {
    console.error('Failed to update discount:', error)
    throw error?.response?.data || { success: false, message: 'Unknown error' }
  }
}

// 🔹 Fetch all discount settings
export const getDiscounts = async (): Promise<DiscountData> => {
  try {
    const response = await axiosInstance.get('/discount')
    return response.data.data
  } catch (error: any) {
    console.error('Failed to fetch discounts:', error)
    throw error?.response?.data || { success: false, message: 'Unknown error' }
  }
}
