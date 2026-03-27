import { getApiWithAuthorization } from '../../services/auth/ApiMethod';
import { Base_Url } from '../../BaseURL/BaseUrl';

export const getAllCategories = () =>
  getApiWithAuthorization(`${Base_Url}api/customer/categories`);

export const getProductsByCategory = (categoryId, filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return getApiWithAuthorization(`${Base_Url}api/customer/categories/${categoryId}/products?${params}`);
};
