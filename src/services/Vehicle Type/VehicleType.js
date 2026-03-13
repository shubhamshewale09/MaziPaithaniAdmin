import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
  postApiWithoutAuthorization,
} from "../auth/ApiMethod";

export const GetVehicleTypeList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}VehicalType/GetVehicalTypeList`,
    params
  );
  return res;
};

export const GetVehicleTypeModel = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}VehicalType/GetVehicalTypeModel?VehicalTypeKeyID=${KeyID}`
  );
  return res;
};

export const ChangeVehicleTypeStatus = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}VehicalType/ChangeVehicalTypeStatus?VehicalTypeKeyID=${KeyID}`
  );
  return res;
};

export const AddUpdateVehicleType = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}VehicalType/AddUpdateVehicalType`,
    params
  );
  return res;
};
