import { getApiWithAuthorization } from '../../services/auth/ApiMethod';
import { Base_Url } from '../../BaseURL/BaseUrl';

export const getCustomerDashboardStats = () =>
  getApiWithAuthorization(`${Base_Url}api/customer/dashboard/stats`);

export const getFeaturedSarees = () =>
  getApiWithAuthorization(`${Base_Url}api/customer/products/featured`);

export const getNewArrivals = () =>
  getApiWithAuthorization(`${Base_Url}api/customer/products/new-arrivals`);

export const getTopSellers = () =>
  getApiWithAuthorization(`${Base_Url}api/customer/sellers/top`);
