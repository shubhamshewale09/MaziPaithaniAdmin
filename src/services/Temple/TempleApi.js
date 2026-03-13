import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetTempleList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Temple/GetTempleList`,
    params
  );
  return res;
};

export const AddUpdateTemple = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Temple/AddUpdateTemple`,
    params
  );
  return res;
};

export const GetTempleModel = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}Temple/GetTempleModel?TempleKeyID=${KeyID}&ApplangID=${appLangID}`
    : `${Base_Url}Temple/GetTempleModel?TempleKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};

export const ChangeTempleStatus = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}Temple/ChangeTempleStatus?TempleKeyID=${KeyID}&ApplangID=${appLangID}`
    : `${Base_Url}Temple/ChangeTempleStatus?TempleKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};
