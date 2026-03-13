import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetUserList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}User/GetUserList`,
    params
  );
  return res;
};

export const GetAssignedStaffPreviewList = async (id) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}Parking/GetParkingStaffListByID?ParkingKeyID=${id}`
    // params
  );
  return res;
};

export const AddUpdateUser = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}User/AddUpdateUser`,
    params
  );
  return res;
};

export const GetUserModel = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}User/GetUserModel?UserKeyIDForUpdate=${KeyID}`
  );
  return res;
};

export const ChangeUserStatus = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}User/ChangeUserStatus?UserKeyIDForUpdate=${KeyID}`
  );
  return res;
};
