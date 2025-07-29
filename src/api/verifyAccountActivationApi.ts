import axiosInstance from "./axiosInstance";

interface VerifyAccountParams {
  email: string;
  otp: string;
}

interface VerifyAccountResponse {
  success: boolean;
  message: string;
  uid: string; 
}

const verifyAccountActivationApi = async (
  data: VerifyAccountParams
): Promise<VerifyAccountResponse> => {
  try {
    const response = await axiosInstance.post<VerifyAccountResponse>(
      "/verify-account",
      data
    );
    return response.data;
  } catch (error: any) {
    // Return a consistent error response shape
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export default verifyAccountActivationApi;
