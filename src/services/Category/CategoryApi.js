import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  postApiWithAuthorization,
  getApiWithAuthorization,
} from "../auth/ApiMethod";

export const ChangeCategoryStatus = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}ComplaintCategory/ChangeComplaintCategoryStatus?CCKeyID=${KeyID}`
  );
  return res;
};

export const GetCategoryList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}ComplaintCategory/GetComplaintCategoryList`,
    params
  );
  return res;
};

export const GetCategoryModel = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}ComplaintCategory/GetComplaintCategoryModel?CCKeyID=${KeyID}`
  );
  return res;
};

export const AddUpdateComplaintCategory = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}ComplaintCategory/AddUpdateComplaintCategory`,
    params
  );
  return res;
};
