import { getApiWithAuthorization, postApiWithAuthorization } from '../../services/auth/ApiMethod';
import { Base_Url } from '../../BaseURL/BaseUrl';

export const getConversations = () =>
  getApiWithAuthorization(`${Base_Url}api/customer/messages/conversations`);

export const getMessages = (conversationId) =>
  getApiWithAuthorization(`${Base_Url}api/customer/messages/${conversationId}`);

export const sendMessage = (data) =>
  postApiWithAuthorization(`${Base_Url}api/customer/messages/send`, data);
