import  AxiosInstance  from './axiosInstance';

const sendPasswordResetApi = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await AxiosInstance.post('/auth/send-password-reset', { email });

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'An error occurred while sending the reset email.',
    };
  }
};

export default sendPasswordResetApi;
