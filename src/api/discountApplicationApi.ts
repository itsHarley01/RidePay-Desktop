import axiosInstance from './axiosInstance';

export const getAllDiscountApplications = async () => {
    const response = await axiosInstance.get('/discount/applications'); 
    return response.data;
};