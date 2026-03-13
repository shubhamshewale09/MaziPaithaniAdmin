import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  postApiWithAuthorization,
  getApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetServiceAggregatorList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}ServiceAggregator/GetServiceAggregatorList`,
    params
  );
  return res;
};

export const ChangeServiceAggregatorStatus = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}ServiceAggregator/ChangeServiceAggregatorStatus?ServiceAggregatorKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}ServiceAggregator/ChangeServiceAggregatorStatus?ServiceAggregatorKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};

export const AddUpdateServiceAggregator = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}ServiceAggregator/AddUpdateServiceAggregator`,
    params
  );
  return res;
};

export const GetServiceAggregatorModel = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}ServiceAggregator/GetServiceAggregatorModel?ServiceAggregatorKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}ServiceAggregator/GetServiceAggregatorModel?ServiceAggregatorKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};

export const AssignAmenityToAggregator = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}ServiceAggregator/AddUpdateServiceAggregatorAmenity`,
    params
  );
  return res;
};
