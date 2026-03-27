import { postApiWithAuthorization, getApiWithAuthorization } from '../../services/auth/ApiMethod';
import { Base_Url } from '../../BaseURL/BaseUrl';

export const placeOrder = (data) =>
  postApiWithAuthorization(`${Base_Url}api/customer/checkout/place-order`, data);

export const getShippingAddresses = () =>
  getApiWithAuthorization(`${Base_Url}api/customer/checkout/addresses`);
