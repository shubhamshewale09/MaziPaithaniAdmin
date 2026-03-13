import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
  postApiWithoutAuthorization,
} from "../auth/ApiMethod";

export const GetFAQList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}FAQ/GetFAQList`,
    params
  );
  return res;
};

export const ChangeFAQStatus = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}FAQ/ChangeFAQStatus?FAQKeyID=${KeyID}`
  );
  return res;
};

export const GetFAQModel = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}FAQ/GetFAQModel?FAQKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}FAQ/GetFAQModel?FAQKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};

export const AddUpdateFAQ = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}FAQ/AddUpdateFAQ`,
    params
  );
  return res;
};
