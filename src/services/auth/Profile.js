import { Base_Url } from '../../BaseURL/BaseUrl';
import { getApiWithAuthorization, postApiWithAuthorization } from './ApiMethod';

// Get user profile data
export const GetProfile = async (userId) => {
  console.log('GetProfile API URL:', `${Base_Url}api/savedata/GetSeller/${userId}`);
  const res = await getApiWithAuthorization(`${Base_Url}api/savedata/GetSeller/${userId}`);
  return res;
};

// Save shop info to specific endpoint
export const SaveShopInfo = async (params) => {
  const res = await postApiWithAuthorization(`${Base_Url}api/savedata/SaveSeller`, params);
  return res;
};

// Save bank details to specific endpoint
export const SaveBankDetails = async (params) => {
  const res = await postApiWithAuthorization(`${Base_Url}api/savedata/Savesellerbankdeatils`, params);
  return res;
};

// Get dashboard data to fetch sellerId
export const GetSellerDashboard = async (userId) => {
  const res = await getApiWithAuthorization(`${Base_Url}api/dashboard/GetSellerDashboard/1?RequestedFor=1&TaskId=1&UserId=${userId}`);
  return res;
};

// Update user profile data
export const UpdateProfile = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}api/profile/update`,
    params,
  );
  return res?.responseData || res;
};
