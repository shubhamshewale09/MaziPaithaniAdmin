import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetAreaList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Area/GetAreaList`,
    params
  );
  return res;
};

export const AddUpdateArea = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Area/AddUpdateArea`,
    params
  );
  return res;
};

export const GetAreaModel = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}Area/GetAreaModel?AreaKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}Area/GetAreaModel?AreaKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};

export const ChangeAreaStatus = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}Area/ChangeAreaStatus?AreaKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}Area/ChangeAreaStatus?AreaKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};
