import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
  postApiWithoutAuthorization,
} from "../auth/ApiMethod";

export const GetEventList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Event/GetEventList`,
    params
  );
  return res;
};

export const ChangeEventStatus = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}Event/ChangeEventStatus?EventKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}Event/ChangeEventStatus?EventKeyID=${KeyID}`;

  const res = await getApiWithAuthorization(url);
  return res;
};

export const GetEventModel = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}Event/GetEventModel?EventKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}Event/GetEventModel?EventKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};

export const AddUpdateEvent = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Event/AddUpdateEvent`,
    params
  );
  return res;
};
