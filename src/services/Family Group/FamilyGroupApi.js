import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  postApiWithAuthorization,
  getApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetFamilyGroupList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}FamilyGroup/GetFamilyGroupList`,
    params
  );
  return res;
};

export const GetGroupMembersList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}FamilyMembers/GetFamilyMembersList`,
    params
  );
  return res;
};

export const GetLocationLatLongList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}FMLocationTracking/GetFMLocationTrackingList`,
    params
  );
  return res;
};

export const GetUserVisitedLocations = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}FMLocationTracking/GetFMLocationTrackingList`,
    params
  );
  return res;
};

export const ChangeGroupStatus = async (id) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}FamilyGroup/ChangeFamilyGroupStatus?FamilyGroupKeyID=${id}`
  );
  return res;
};
