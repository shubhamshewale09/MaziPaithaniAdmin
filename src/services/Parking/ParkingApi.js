import { Base_Url } from "../../BaseURL/BaseUrl";
import {
  getApiWithAuthorization,
  postApiWithAuthorization,
} from "../auth/ApiMethod";

export const GetParkingList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Parking/GetParkingList`,
    params
  );
  return res;
};

export const GetPreviewParkingList = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Parking/GetParkingList`,
    params
  );
  return res;
};
export const GetAvailableParkingList = async (params) => {
  try {
    const res = await postApiWithAuthorization(
      `${Base_Url}ParkingBooking/GetParkingBookingList`,
      params
    );
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetParkingModel = async (KeyID) => {
  const res = await getApiWithAuthorization(
    `${Base_Url}Parking/GetParkingModel?ParkingKeyID=${KeyID}`
  );
  return res;
};

export const AddUpdateParking = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Parking/AddUpdateParking`,
    params
  );
  return res;
};

export const ChangeParkingStatus = async (params) => {
  const res = await postApiWithAuthorization(
    `${Base_Url}Parking/ApproveParkingByAdmin`,
    params
  );
  return res;
};
