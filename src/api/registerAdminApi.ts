import api from './axiosInstance'; // adjust the path based on your folder structure

export const registerAdmin = async (admin: {
  firstName: string;
  middleName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  email: string;
  contactNumber: string;
  role: string;
  organization: string;
  operatorUnit: string;
}) => {
  try {
    const response = await api.post('/register', admin);
    console.log('✅ Backend response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ API error:', error.response?.data || error.message);
    throw error;
  }
};
