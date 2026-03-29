import { getApiWithAuthorization, postApiWithAuthorization, putApiWithAuthorization, deleteApiWithAuthorization } from '../../services/auth/ApiMethod';
import { Base_Url } from '../../BaseURL/BaseUrl';

const getUserId = () => {
  try {
    const d = JSON.parse(localStorage.getItem('login') || '{}');
    return d?.userId ?? d?.UserId ?? localStorage.getItem('UserId') ?? '0';
  } catch {
    return '0';
  }
};

export const getCartList = () =>
  getApiWithAuthorization(`${Base_Url}api/cart/get-cart-list/${getUserId()}`);

export const addToCart = (productId, sellerId, quantity = 1) =>
  postApiWithAuthorization(`${Base_Url}api/cart/add-to-cart`, {
    userId: Number(getUserId()),
    productId,
    sellerId,
    quantity,
  });

export const updateCartQuantity = (cartItemId, quantity) =>
  putApiWithAuthorization(`${Base_Url}api/cart/update-quantity/${cartItemId}`, { quantity });

export const deleteCartItem = (cartItemId) =>
  deleteApiWithAuthorization(`${Base_Url}api/cart/delete-item-from-cart/${cartItemId}`);
