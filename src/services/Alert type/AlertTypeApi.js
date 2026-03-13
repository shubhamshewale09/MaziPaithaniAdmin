import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetAlertTypeList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}AlertType/GetAlertTypeList`,
    params
  );
  return res;
};

export const AddUpdateAlertType = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}AlertType/AddUpdateAlertType`,
    params
  );
  return res;
};

export const GetAlertTypeModel = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}AlertType/GetAlertTypeModel?AlertTypeKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}AlertType/GetAlertTypeModel?AlertTypeKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};

export const ChangeAlertTypeStatus = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}AlertType/ChangeAlertStatus?AlertTypeKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}AlertType/ChangeAlertStatus?AlertTypeKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};
