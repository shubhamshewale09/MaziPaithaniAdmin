import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetAlertList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Alert/GetAlertList`,
    params
  );
  return res;
};

export const AddUpdateAlert = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Alert/AddUpdateAlert`,
    params
  );
  return res;
};

export const GetAlertModel = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}Alert/GetAlertModel?AlertKeyID=${KeyID}&ApplangID=${appLangID}`
    : `${Base_Url}Alert/GetAlertModel?AlertKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};

export const ChangeAlertStatus = async (KeyID, ApplangID) => {
  const url = ApplangID
    ? `${Base_Url}Alert/ChangeAlertStatus?AlertKeyID=${KeyID}&ApplangID=${ApplangID}`
    : `${Base_Url}Alert/ChangeAlertStatus?AlertKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};
