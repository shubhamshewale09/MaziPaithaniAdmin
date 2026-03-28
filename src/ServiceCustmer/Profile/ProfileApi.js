import {
  getApiWithAuthorization,
  putApiWithAuthorization,
  postApiWithAuthorization,
  deleteApiWithAuthorization,
} from '../../services/auth/ApiMethod';
import { Base_Url } from '../../BaseURL/BaseUrl';

export const getCustomerProfile = () =>
  getApiWithAuthorization(`${Base_Url}api/customer/profile`);

export const updateCustomerProfile = (userId, data) =>
  putApiWithAuthorization(`${Base_Url}api/customer/${userId}/update-customer-profile`, data);

export const getWishlist = () =>
  getApiWithAuthorization(`${Base_Url}api/customer/profile/wishlist`);

export const removeFromWishlist = (productId) =>
  deleteApiWithAuthorization(`${Base_Url}api/customer/profile/wishlist/${productId}`);

export const getSavedAddresses = () =>
  getApiWithAuthorization(`${Base_Url}api/customer/profile/addresses`);

export const addAddress = (data) =>
  postApiWithAuthorization(`${Base_Url}api/customer/add-customer-aaddress`, data);
