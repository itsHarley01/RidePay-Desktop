// src/api/loginAuthApi.ts
import axiosInstance from './axiosInstance';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  uid: string;
}

const loginAuthApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/login', payload);
  return response.data;
};

export default loginAuthApi;
