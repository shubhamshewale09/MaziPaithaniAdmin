import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetServiceList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Services/GetServiceList`,
    params
  );
  return res;
};

export const AddUpdateService = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Services/AddUpdateService`,
    params
  );
  return res;
};

export const GetServiceModel = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}Services/GetServiceModel?ServiceKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}Services/GetServiceModel?ServiceKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};

export const ChangeServiceStatus = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}Services/ChangeServiceStatus?ServiceKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}Services/ChangeServiceStatus?ServiceKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};
