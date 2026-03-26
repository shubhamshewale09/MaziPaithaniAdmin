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

  // userId goes in FormData body — NOT in query params
  formData.append("userId", String(params.userId));

  params.Files.forEach((file) => {
    formData.append("Files", file, file?.name || "product-image.jpg");
  });

  logFormDataEntries("UploadProductImages form-data", formData);

  // ProdcutId (note: typo is intentional per API spec) and imageId go as query params
  const url = `${Base_Url}api/Product/api/uploadimage?ProdcutId=${encodeURIComponent(params.ProductId)}&Taskid=0&imageId=0`;

  const response = await fetch(url, {
    method: "POST",
    headers: getAuthorizedMultipartHeaders(),
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");
    error.response = { data, status: response.status };
    throw error;
  }

  return data;
};

const extractImagePath = (url) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};

export const UpdateProductImage = async (params) => {
  const formData = new FormData();

  formData.append("userId", "0");
  formData.append("Files", params.file, params.file?.name || "product-image.jpg");

  logFormDataEntries("UpdateProductImage form-data", formData);

  const url = `${Base_Url}api/Product/api/uploadimage?ProdcutId=0&Taskid=1&imageId=${encodeURIComponent(params.imageId)}&fileUrl=${encodeURIComponent(extractImagePath(params.fileUrl || ""))}`;

  const response = await fetch(url, {
    method: "POST",
    headers: getAuthorizedMultipartHeaders(),
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");
    error.response = { data, status: response.status };
    throw error;
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
