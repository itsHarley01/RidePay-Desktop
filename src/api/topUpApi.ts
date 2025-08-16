import axiosInstance from "./axiosInstance";

export interface TopUpPayload {
  userId: string;
  topUpAmount: number;
  topUpFee: number;
  topupMethod: string;
  organization: string;
}

export interface TopUpResponse {
  message: string;
  newBalance: number;
}

export const topUpUserBalance = async (payload: TopUpPayload): Promise<TopUpResponse> => {
  try {
    const response = await axiosInstance.post<TopUpResponse>(`/topup`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Top-up API error:', error);
    throw error.response?.data || { message: 'Top-up failed.' };
  }
};
