import axiosClient from './axiosClient';

export const getStudentsApi = async (params = {}) => {
  return await axiosClient.get('/students', { params });
};

export const getStudentStatsApi = async () => {
  return await axiosClient.get('/students/stats');
};

export const getStudentByIdApi = async (id) => {
  return await axiosClient.get(`/students/${id}`);
};

export const createStudentApi = async (data) => {
  return await axiosClient.post('/students', data);
};

export const updateStudentApi = async (id, data) => {
  return await axiosClient.put(`/students/${id}`, data);
};

export const deleteStudentApi = async (id) => {
  return await axiosClient.delete(`/students/${id}`);
};
