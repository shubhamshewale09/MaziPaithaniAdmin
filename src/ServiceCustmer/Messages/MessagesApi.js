import { getApiWithAuthorization, postApiWithAuthorization } from '../../services/auth/ApiMethod';
import { Base_Url } from '../../BaseURL/BaseUrl';

export const getConversations = (userId) =>
  getApiWithAuthorization(`${Base_Url}api/chat/conversations?userId=${userId}`);

export const getChatHistory = (senderId, receiverId, roomId) => {
  const url = roomId
    ? `${Base_Url}api/chat/history?roomId=${roomId}`
    : `${Base_Url}api/chat/history?senderId=${senderId}&receiverId=${receiverId}`;
  return getApiWithAuthorization(url);
};

export const sendChatMessage = (data) =>
  postApiWithAuthorization(`${Base_Url}api/chat/send`, data);
