import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  postApiWithAuthorization,
  getApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetComplaintsList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Parking/GetParkingReportList`,
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

export const GetStateModel = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}State/GetStateModel?StateKeyID=${KeyID}`
  );
  return res;
};

export const UpdateComplaintStatus = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Parking/ChangeParkingReportStatus`,
    params
  );
  return res;
};
