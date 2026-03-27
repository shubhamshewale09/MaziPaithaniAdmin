import { getApiWithAuthorization } from '../../services/auth/ApiMethod';
import { Base_Url } from '../../BaseURL/BaseUrl';

export const getMyOrders = () =>
  getApiWithAuthorization(`${Base_Url}api/customer/orders`);

export const getOrderById = (orderId) =>
  getApiWithAuthorization(`${Base_Url}api/customer/orders/${orderId}`);
