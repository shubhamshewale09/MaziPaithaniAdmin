import { Base_Url } from "../../BaseURL/BaseUrl";
import { postApiWithAuthorization } from "../auth/ApiMethod";

export const GetDashboardDetails = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}DashBoard/GetDashboardCountList`,
    params
  );
  return res;
};
