import { getApiWithAuthorization } from '../../services/auth/ApiMethod';
import { Base_Url } from '../../BaseURL/BaseUrl';

export const getProductById = (productId) =>
  getApiWithAuthorization(`${Base_Url}api/customer/products/${productId}`);

export const getProductReviews = (productId) =>
  getApiWithAuthorization(`${Base_Url}api/customer/products/${productId}/reviews`);
