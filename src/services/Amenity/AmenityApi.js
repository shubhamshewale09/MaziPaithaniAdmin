import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  postApiWithAuthorization,
  getApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetAmenityList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Amenity/GetAmenityList`,
    params
  );
  return res;
};

export const ChangeAmenityStatus = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}Amenity/ChangeAmenityStatus?AmenityKeyID=${KeyID}`
    : `${Base_Url}Amenity/ChangeAmenityStatus?AmenityKeyID=${KeyID}&AppLangID=${appLangID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};

export const GetAmenityModel = async (KeyID, appLangID) => {
  const url = appLangID
    ? `${Base_Url}Amenity/GetAmenityModel?AmenityKeyID=${KeyID}&AppLangID=${appLangID}`
    : `${Base_Url}Amenity/GetAmenityModel?AmenityKeyID=${KeyID}`;
  const res = await getApiWithAuthorization(url);
  return res;
};

export const AddUpdateAmenity = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Amenity/AddUpdateAmenity`,
    params
  );
  return res;
};
