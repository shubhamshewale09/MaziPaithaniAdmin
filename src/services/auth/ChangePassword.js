import { Base_Url } from "../../BaseURL/BaseUrl";
import { putApiWithAuthorization } from "./ApiMethod";

export const changePassword = async (payload) => {
  return await putApiWithAuthorization(`${Base_Url}api/auth/change-password`, payload);
};
