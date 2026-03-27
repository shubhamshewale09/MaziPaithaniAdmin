import { Base_Url } from "../../BaseURL/BaseUrl";
import { getApiWithoutAuthorization } from "./ApiMethod";

export const getDropdownByTaskId = async (taskId) => {
  return await getApiWithoutAuthorization(`${Base_Url}api/Dropdown?taskId=${taskId}`);
};
