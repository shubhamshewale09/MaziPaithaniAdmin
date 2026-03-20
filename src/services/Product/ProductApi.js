import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
} from "../auth/ApiMethod";

let productCategoriesCache = null;
let productCategoriesRequest = null;

export const GetProductCategories = async () => {
  if (productCategoriesCache) {
    return productCategoriesCache;
  }

  if (productCategoriesRequest) {
    return productCategoriesRequest;
  }

  productCategoriesRequest = getApiWithAuthorization(
    `${Base_Url}api/Dropdown?taskId=2`
  )
    .then((res) => {
      productCategoriesCache = res;
      return res;
    })
    .finally(() => {
      productCategoriesRequest = null;
    });

  return productCategoriesRequest;
};

export const SaveProductDetails = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}api/savedata/AddProductdeatils`,
    params
  );
  return res;
};

export const clearProductCategoriesCache = () => {
  productCategoriesCache = null;
  productCategoriesRequest = null;
};
