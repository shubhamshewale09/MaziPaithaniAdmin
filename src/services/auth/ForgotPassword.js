import { Base_Url } from "../../BaseURL/BaseUrl";
import { postApiWithoutAuthorization } from "./ApiMethod";

export const sendForgotPasswordOtp = async (email) => {
  return await postApiWithoutAuthorization(`${Base_Url}api/auth/forgot-password`, { email });
};

export const verifyOtp = async (email, otp) => {
  return await postApiWithoutAuthorization(`${Base_Url}api/auth/verify-otp`, { email, otp });
};

export const resetPasswordWithOtp = async (email, otp, newPassword) => {
  return await postApiWithoutAuthorization(`${Base_Url}api/auth/reset-password`, { email, otp, newPassword });
};
