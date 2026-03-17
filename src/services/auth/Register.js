import { Base_Url } from "../../BaseURL/BaseUrl";
import { postApiWithoutAuthorization } from "./ApiMethod";

export const AuthRegister = async (params) => {
  const res = await postApiWithoutAuthorization(
    `${Base_Url}api/auth/register`,
    params
  );
  return res;
};