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
  putApiWithAuthorization(
    `${Base_Url}api/CustomerProfile/${userId}/update-customer-profile`,
    data,
  );

export const getWishlist = () =>
  getApiWithAuthorization(`${Base_Url}api/customer/profile/wishlist`);

export const removeFromWishlist = (productId) =>
  deleteApiWithAuthorization(
    `${Base_Url}api/customer/profile/wishlist/${productId}`,
  );

export const getCustomerAddresses = (userId) =>
  getApiWithAuthorization(`${Base_Url}api/CustomerProfile/${userId}/addresses`);

export const updateCustomerAddress = (addressId, data) =>
  putApiWithAuthorization(
    `${Base_Url}api/CustomerProfile/update-customer-address/${addressId}`,
    data,
  );

export const deleteAddress = (addressId) =>
  deleteApiWithAuthorization(`${Base_Url}api/CustomerProfile/delete-address/${addressId}`);

export const addAddress = (data) =>
  postApiWithAuthorization(
    `${Base_Url}api/CustomerProfile/add-customer-address`,
    data,
  );
