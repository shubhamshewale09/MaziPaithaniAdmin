import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
  postApiWithoutAuthorization,
} from "../auth/ApiMethod";

export const GetServiceTypeList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}ServiceType/GetServiceTypeList`,
    params
  );
  return res;
};

export const GetServiceTypeModel = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}ServiceType/GetServiceTypeModel?ServiceTypeKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}ServiceType/GetServiceTypeModel?ServiceTypeKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};

export const ChangeServiceTypeStatus = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}ServiceType/ChangeServiceTypeStatus?ServiceTypeKeyID=${KeyID}`
  );
  return res;
};

export const AddUpdateServiceType = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}ServiceType/AddUpdateServiceType`,
    params
  );
  return res;
};
