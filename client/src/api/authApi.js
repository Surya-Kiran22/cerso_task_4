import axiosClient from './axiosClient';

export const registerApi = async (data) => {
  return await axiosClient.post('/auth/register', data);
};

export const loginApi = async (credentials) => {
  return await axiosClient.post('/auth/login', credentials);
};

export const getMeApi = async () => {
  return await axiosClient.get('/auth/me');
};
