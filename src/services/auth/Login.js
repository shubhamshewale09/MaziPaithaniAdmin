import { Base_Url } from "../../BaseURL/BaseUrl";
import { postApiWithoutAuthorization } from "./ApiMethod";

export const AuthLogin = async (params) => {
  const res = await postApiWithoutAuthorization(
    `${Base_Url}Login/Authenticate`,
    params
  );
  return res;
};
