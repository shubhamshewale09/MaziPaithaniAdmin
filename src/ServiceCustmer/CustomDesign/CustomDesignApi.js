import { postApiWithAuthorization } from '../../services/auth/ApiMethod';
import { Base_Url } from '../../BaseURL/BaseUrl';

export const submitCustomDesignRequest = (data) =>
  postApiWithAuthorization(`${Base_Url}api/customer/custom-design/request`, data);
