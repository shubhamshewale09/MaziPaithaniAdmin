// TokenAuthorization.js
import axios from "axios";

// Helper function to handle authorization errors
const handleAuthorizationError = (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.clear();
    window.location.replace("/login");
  }
  return error; // Rethrow error for handling in slice
};

// POST API with Authorization
export const postApiWithAuthorization = async (url, data) => {
  try {
    const storedAuth = JSON.parse(localStorage.getItem("login")); // Get token from Redux state
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${storedAuth.token}`, // Attach token dynamically
      },
    });
    return response.data; // Return response data directly
  } catch (error) {
    return handleAuthorizationError(error);
  }
};

// POST API without Authorization
export const postApiWithoutAuthorization = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response.data; // Return response data directly
  } catch (error) {
    return error; // Handle error in calling function
  }
};

// GET API with Authorization
export const getApiWithAuthorization = async (url) => {
  try {
    const storedAuth = JSON.parse(localStorage.getItem("login")); // Get token from Redux state
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${storedAuth.token}`, // Attach token dynamically
        // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUwMTJkN2I0LWVlYjgtNDVmZC1hYjRlLWNkMmJmOTA3OGZiYSIsIm5iZiI6MTc2MjI0NDcyOCwiZXhwIjoxNzYyMzMxMTI4LCJpYXQiOjE3NjIyNDQ3Mjh9.kcuQu5GosyZ9Zfb3QQgQQz0AixAO8Qf9l5xdUfbfESQ` //TODO:fix this once login api integrated
      },
    });
    return response.data; // Return response data directly
  } catch (error) {
    return handleAuthorizationError(error);
  }
};

// GET API without Authorization
export const getApiWithoutAuthorization = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data; // Return response data directly
  } catch (error) {
    return error; // Handle error in calling function
  }
};
