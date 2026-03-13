import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
  postApiWithoutAuthorization,
} from "../auth/ApiMethod";

export const GetServiceAggregatorTypeList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}ServiceAggregatorType/GetServiceAggregatorTypeList`,
    params
  );
  return res;
};

export const GetServiceAggregatorTypeModel = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}ServiceAggregatorType/GetServiceAggregatorTypeModel?ServiceAggregatorTypeKeyID=${KeyID}`
  );
  return res;
};

export const ChangeServiceAggregatorTypeStatus = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}ServiceAggregatorType/ChangeServiceAggregatorTypeStatus?ServiceAggregatorTypeKeyID=${KeyID}`
  );
  return res;
};

export const AddUpdateServiceAggregatorType = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}ServiceAggregatorType/AddUpdateServiceAggregatorType`,
    params
  );
  return res;
};
