import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:9000/api/';

const api = axios.create({
  baseURL: BASE_URL,
});

const commonHeaders = () => {
  const token = Cookies.get('accessToken');

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiRequest = async (
  method: string,
  url: string,
  data: any = null,
  onUploadProgress?: (progressEvent: ProgressEvent) => void,
) => {
  try {
    const token = Cookies.get('accessToken');
    const headers = {
      ...(data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : commonHeaders()),
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const config: any = {
      method,
      url,
      headers,
      ...(onUploadProgress && { onUploadProgress }),
    };

    if (data && method !== 'DELETE') {
      config.data = data;
    }

    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export const login = async (credentials: {
  userIdentifier: string;
  password: string;
}) => {
  return await apiRequest('POST', 'api/auth/login', credentials);
};

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  return await apiRequest('POST', 'api/auth/register', userData);
};

export const getAllTasks = async () => {
  return await apiRequest('GET', 'api/tasks');
};

export const updateTask = async (taskId: string, updatedData: any) => {
  return await apiRequest('PUT', `api/tasks/${taskId}`, updatedData);
};

export const removeTask = async (taskId: string) => {
  return await apiRequest('DELETE', `api/tasks/${taskId}`);
};

export const createTask = async (taskData: any) => {
  return await apiRequest('POST', 'api/tasks', taskData);
};
