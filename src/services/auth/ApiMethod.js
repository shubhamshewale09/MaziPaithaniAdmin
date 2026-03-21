import axios from 'axios';
import { startApiLoader, stopApiLoader } from '../../Utils/apiLoader';

// Helper function to handle authorization errors
const handleAuthorizationError = (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.clear();
    window.location.replace('/login');
  }
  throw error;
};

// Helper to get token safely
const getToken = () => {
  const storedAuth = JSON.parse(localStorage.getItem('login'));
  return storedAuth?.token || '';
};

// Helper to get UserId safely
const getUserId = () => {
  const userId = localStorage.getItem('UserId');
  return userId || '';
};

// Helper to get RoleId safely
const getRoleId = () => {
  const roleId = localStorage.getItem('RoleId');
  return roleId || '';
};

// Create Axios instance
const axiosInstance = axios.create();

// Export axiosInstance for use in other files
export { axiosInstance };

// Request interceptor to add headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    const userId = getUserId();
    const roleId = getRoleId();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (userId) {
      config.headers.UserId = userId;
    }
    if (roleId) {
      config.headers.RoleId = roleId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    handleAuthorizationError(error);
    return Promise.reject(error);
  },
);

// POST API with Authorization
export const postApiWithAuthorization = async (url, data) => {
  startApiLoader();
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    handleAuthorizationError(error);
  } finally {
    stopApiLoader();
  }
};

// POST API without Authorization
export const postApiWithoutAuthorization = async (url, data) => {
  startApiLoader();
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  } finally {
    stopApiLoader();
  }
};

// GET API with Authorization
export const getApiWithAuthorization = async (url) => {
  startApiLoader();
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleAuthorizationError(error);
  } finally {
    stopApiLoader();
  }
};

// GET API without Authorization
export const getApiWithoutAuthorization = async (url) => {
  startApiLoader();
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  } finally {
    stopApiLoader();
  }
};
