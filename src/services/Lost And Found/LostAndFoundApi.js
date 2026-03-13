import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetLostAndFoundList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}LostAndFound/GetLostAndFoundList`,
    params
  );
  return res;
};

export const AddUpdateLostPost = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}LostAndFound/AddUpdateLostAndFound`,
    params
  );
  return res;
};

export const GetLostAndFoundModel = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}LostAndFound/GetLostAndFoundModel?LoastAndFoundKeyID=${KeyID}`
  );
  return res;
};

export const ChangeLostAndFoundStatus = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}LostAndFound/ChangeLostAndFoundStatus?LoastAndFoundKeyID=${KeyID}`
  );
  return res;
};

export const GetLostAndFoundComments = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}LoastAndFoundComments/GetLoastAndFoundCommentsList`,
    params
  );
  return res;
};
