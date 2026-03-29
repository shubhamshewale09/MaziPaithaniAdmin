import {
  getApiWithAuthorization,
  postApiWithAuthorization,
  deleteApiWithAuthorization,
} from '../../services/auth/ApiMethod';
import { Base_Url } from '../../BaseURL/BaseUrl';

export const getWishlist = (userId) =>
  getApiWithAuthorization(`${Base_Url}api/cart/get-wishlist/${userId}`);

export const addToWishlist = (data) =>
  postApiWithAuthorization(`${Base_Url}api/cart/add-to-wishlist`, data);

export const removeFromWishlist = (wishlistId) =>
  deleteApiWithAuthorization(`${Base_Url}api/cart/remove-from-wishlist/${wishlistId}`);
