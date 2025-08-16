import api from './axiosInstance';

export interface Requirement {
  id?: string;
  category: string;
  name: string;
  inputType: string;
  organization?: string;
  operatorUnit?: string;
}

export interface RequirementsByCategory {
  coop?: Requirement[];
  operator?: Requirement[];
  driver?: Requirement[];
}

// ✅ Get requirements for a category
export const getRequirements = async (category: string): Promise<Requirement[]> => {
  const res = await api.get(`/req/${category}`);
  return res.data;
};

// ✅ Create a requirement
export const createRequirement = async (data: Requirement) => {
  const res = await api.post(`/req`, data);
  return res.data;
};

// ✅ Update requirement
export const updateRequirement = async (id: string, data: Requirement) => {
  const res = await api.put(`/req/${id}`, data);
  return res.data;
};

// ✅ Delete requirement
export const deleteRequirement = async (id: string) => {
  const res = await api.delete(`/req/${id}`);
  return res.data;
};

