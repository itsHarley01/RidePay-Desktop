import axiosInstance from './axiosInstance';

interface RegisterActivatedAccountPayload {
  email: string;
  password: string;
  old_uid: string;
}

interface RegisterActivatedAccountResponse {
  success: boolean;
  message: string;
  uid?: string;
}

const registerActivatedAccountApi = async (
  payload: RegisterActivatedAccountPayload
): Promise<RegisterActivatedAccountResponse> => {
  try {
    const response = await axiosInstance.post<RegisterActivatedAccountResponse>(
      '/register-final-account',
      payload
    );
    return response.data;
  } catch (error: any) {
    // Handle known error response shape or fallbacks
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        'Something went wrong',
    };
  }
};

export default registerActivatedAccountApi;
