import axiosInstance from './axiosInstance';

export interface BaseTransaction {
  type: 'bus' | 'topup' | 'card';
  amount: number;
  fromUser: string;
  // dynamic fields depending on type
  [key: string]: any;
}

export interface GetTransactionFilters {
  type?: string;
  fromUser?: string;
  startTimestamp?: number;
  endTimestamp?: number;
}

// 🔹 Create a transaction
export const createTransaction = async (transaction: BaseTransaction) => {
  try {
    const res = await axiosInstance.post(`/transactions`, transaction);
    return res.data;
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    throw error.response?.data || error;
  }
};

// 🔹 Get transactions with optional filters
export const getTransactions = async (filters: GetTransactionFilters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (filters.type) queryParams.append('type', filters.type);
    if (filters.fromUser) queryParams.append('fromUser', filters.fromUser);
    if (filters.startTimestamp) queryParams.append('startTimestamp', filters.startTimestamp.toString());
    if (filters.endTimestamp) queryParams.append('endTimestamp', filters.endTimestamp.toString());

    const res = await axiosInstance.get(`/transactions?${queryParams.toString()}`);
    return res.data;
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    throw error.response?.data || error;
  }
};
