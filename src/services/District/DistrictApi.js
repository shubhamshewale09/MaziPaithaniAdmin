import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  postApiWithAuthorization,
  getApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetDistrictList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}District/GetDistrictList`,
    params
  );
  return res;
};

export const ChangeDistrictStatus = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}District/ChangeDistrictStatus?DistrictKeyID=${KeyID}`
  );
  return res;
};

export const AddUpdateDistrict = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}District/AddUpdateDistrict`,
    params
  );
  return res;
};

export const GetDistrictModel = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}District/GetDistrictModel?DistrictKeyID=${KeyID}&ApplangID=${appLangID}`
    : `${Base_Url}District/GetDistrictModel?DistrictKeyID=${KeyID}`;
  const res = await getApiWithAuthorization();
  return res;
};
