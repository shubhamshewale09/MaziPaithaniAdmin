import axios from "axios";

// Helper function to handle authorization errors
const handleAuthorizationError = (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.clear();
    window.location.replace("/login");
  }
  throw error;
};

// Helper to get token safely
const getToken = () => {
  const storedAuth = JSON.parse(localStorage.getItem("login"));
  return storedAuth?.token || "";
};

// POST API with Authorization
export const postApiWithAuthorization = async (url, data) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAuthorizationError(error);
  }
};

// POST API without Authorization
export const postApiWithoutAuthorization = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET API with Authorization
export const getApiWithAuthorization = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAuthorizationError(error);
  }
};

// GET API without Authorization
export const getApiWithoutAuthorization = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};