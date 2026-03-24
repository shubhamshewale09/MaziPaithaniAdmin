import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  deleteApiWithAuthorization,
  getApiWithAuthorization,
  postApiWithAuthorization,
  putApiWithAuthorization,
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

export const GetAllProductData = async (userId) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}api/Product/GetAllProductdata?userId=${userId}`
  );
  return res;
};

export const UpdateProductDetails = async (params) => {
  const res = await putApiWithAuthorization(
    `${Base_Url}api/savedata/UpdateProductdeatils`,
    params
  );
  return res;
};

const getAuthorizedMultipartHeaders = () => {
  const loginData = JSON.parse(localStorage.getItem("login") || "{}");
  const userId = localStorage.getItem("UserId") || loginData?.userId || "";
  const roleId = localStorage.getItem("RoleId") || loginData?.roleId || "";
  const token = loginData?.token || "";
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (userId) {
    headers.UserId = String(userId);
  }

  if (roleId) {
    headers.RoleId = String(roleId);
  }

  return headers;
};

const logFormDataEntries = (label, formData) => {
  const entries = [];

  formData.forEach((value, key) => {
    if (value instanceof File) {
      entries.push({
        key,
        name: value.name,
        size: value.size,
        type: value.type,
      });
      return;
    }

    entries.push({ key, value });
  });

  console.log(label, entries);
};

export const UploadProductImages = async (params) => {
  const formData = new FormData();

  formData.append("ProdcutId", String(params.ProductId));
  formData.append("userId", String(params.userId));

  params.Files.forEach((file) => {
    formData.append("Files", file, file?.name || "product-image.jpg");
  });

  logFormDataEntries("UploadProductImages form-data", formData);

  const response = await fetch(`${Base_Url}api/Product/api/uploadimage`, {
    method: "POST",
    headers: getAuthorizedMultipartHeaders(),
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw { response: { data, status: response.status } };
  }

  return data;
};

export const UpdateProductImage = async (params) => {
  const formData = new FormData();

  formData.append("fileUrl", params.file, params.file?.name || "product-image.jpg");

  logFormDataEntries("UpdateProductImage form-data", formData);

  const response = await fetch(
    `${Base_Url}api/Product/updateproductimage?imageId=${encodeURIComponent(
      params.imageId
    )}`,
    {
      method: "PUT",
      headers: getAuthorizedMultipartHeaders(),
      body: formData,
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw { response: { data, status: response.status } };
  }

  return data;
};

export const DeleteProductDetails = async (productId) => {
  const res = await deleteApiWithAuthorization(
    `${Base_Url}api/savedata/DeleteProductdeatils/${productId}`
  );
  return res;
};

export const clearProductCategoriesCache = () => {
  productCategoriesCache = null;
  productCategoriesRequest = null;
};
