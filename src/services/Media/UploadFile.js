import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  postApiWithAuthorization,
  getApiWithAuthorization,
} from "../auth/ApiMethod";

export const UploadImage = async (params) => {
  const res = await postApiWithAuthorization(
    `https://multipurpose.mkisan.com/uploadImage`,
    params
  ); //change base url later
  return res;
};

export const GetUploadedMedia = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Images/GetImageList`,
    params
  );
  return res;
};

export const AddUpdateImage = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Images/AddUpdateImages`,
    params
  );
  return res;
};

export const DeleteMedia = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}Images/DeleteImage?ImagesKeyID=${KeyID}`
  );
  return res;
};
