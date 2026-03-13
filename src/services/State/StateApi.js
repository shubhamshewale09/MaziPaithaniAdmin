import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  postApiWithAuthorization,
  getApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetStateList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}State/GetStateList`,
    params
  );
  return res;
};

export const ChangeStateStatus = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}State/ChangeStateStatus?StateKeyID=${KeyID}`
  );
  return res;
};

export const AddUpdateState = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}State/AddUpdateState`,
    params
  );
  return res;
};

export const GetStateModel = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}State/GetStateModel?StateKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}State/GetStateModel?StateKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};
