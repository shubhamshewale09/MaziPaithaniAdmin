import {
  getApiWithAuthorization,
  postApiWithAuthorization,
  putApiWithAuthorization,
  deleteApiWithAuthorization,
} from '../../services/auth/ApiMethod';
import { Base_Url } from '../../BaseURL/BaseUrl';

export const getCart = () =>
  getApiWithAuthorization(`${Base_Url}api/customer/cart`);

export const addToCart = (data) =>
  postApiWithAuthorization(`${Base_Url}api/customer/cart/add`, data);

export const updateCartItem = (itemId, data) =>
  putApiWithAuthorization(`${Base_Url}api/customer/cart/item/${itemId}`, data);

export const removeCartItem = (itemId) =>
  deleteApiWithAuthorization(`${Base_Url}api/customer/cart/item/${itemId}`);

export const clearCart = () =>
  deleteApiWithAuthorization(`${Base_Url}api/customer/cart/clear`);
