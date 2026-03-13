import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetNotificationList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Notification/GetNotificationsList`,
    params
  );
  return res;
};

export const GetNotificationModel = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}Notification/GetNotificationModel?NotificationKeyID=${KeyID}`
  );
  return res;
};

export const AddUpdateNotification = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Notification/AddUpdateNotification`,
    params
  );
  return res;
};

export const ChangeNotificationStatus = async (id) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}Notification/DeleteNotificationChangeToSeenStatus=${id}`
  );
  return res;
};
