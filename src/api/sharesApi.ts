import axiosInstance from './axiosInstance';

export interface Shares {
  dotrShare: string;
  coopShare: string;
  operatorShare?: string;
  driverShare?: string;
}

// GET /api/shares
export const getShares = async (): Promise<Shares> => {
  const response = await axiosInstance.get<Shares>('/shares');
  return response.data;
};

// PUT /api/shares/main (update DOTR & Coop)
export const updateMainShares = async (shares: {
  dotrShare: string;
  coopShare: string;
}): Promise<{ message: string }> => {
  const response = await axiosInstance.put('/shares/main', shares);
  return response.data;
};

// PUT /api/shares/operator (update Operator & Driver)
export const updateOperatorShares = async (shares: {
  operatorShare: string;
  driverShare: string;
}): Promise<{ message: string }> => {
  const response = await axiosInstance.put('/shares/operator', shares);
  return response.data;
};
