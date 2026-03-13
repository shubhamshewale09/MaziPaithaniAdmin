import { Base_Url } from "../../BaseURL/BaseUrl";
import { getApiWithAuthorization } from "../auth/ApiMethod";

export const GetAllUserLookupList = async () => {
  const res = await getApiWithAuthorization(
    `${Base_Url}User/GetUserLookupList`
  );
  return res;
};

export const GetRoleTypeLookupList = async (name) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}User/GetRoleLookupList?ModuleName=${name || ""}`
  );
  return res;
};

export const GetParkingStatusLookupList = async (id) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}Parking/GetParkingLookupList?ParkingOwnerID=${id}`
  );
  return res;
};

export const GetServiceTypeLookupList = async () => {
  const res = await getApiWithAuthorization(
    `${Base_Url}ServiceType/GetServiceTypeLookupList`
  );
  return res;
};

export const GetServiceAggregatorLookupList = async () => {
  const res = await getApiWithAuthorization(
    `${Base_Url}ServiceAggregatorType/GetServiceAggrigatorTypeLookupList`
  );
  return res;
};
export const GetParkingLookupList = async (id) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}Parking/GetParkingLookupList?ParkingOwnerID=${id}`
  );
  return res;
};

export const GetStateLookupList = async (id) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}State/GetStateLookupList`
  );
  return res;
};

export const GetDistrictLookupList = async (id) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}District/GetDistrictLookupList?StateID=${id}`
  );
  return res;
};

export const GetAreaLookupList = async (id) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}Area/GetAreaLookupList`
  );
  return res;
};

export const GetComplaintCategories = async (id) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}ComplaintCategory/GetComplaintCategoryLookupList?ComplaintTypeID=${id}`
  );
  return res;
};

export const GetAllAlertTypeLookup = async () => {
  const res = await getApiWithAuthorization(
    `${Base_Url}AlertType/GetAlertTypeLookupList`
  );
  return res;
};

export const GetAmenityLookupList = async () => {
  const res = await getApiWithAuthorization(
    `${Base_Url}Amenity/GetAmenityLookupList`
  );
  return res;
};

export const GetAlertTypeLookUpList = async () => {
  const res = await getApiWithAuthorization(
    `${Base_Url}AlertType/GetAlertTypeLookupList`
  );
  return res;
};

export const GetAllLanguageLookUpList = async () => {
  const res = await getApiWithAuthorization(
    `${Base_Url}AppLanguage/GetAppLanguageLookupList`
  );
  return res;
};
