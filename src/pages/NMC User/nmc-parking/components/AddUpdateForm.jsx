
import { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";

import { GetAllUserLookupList, GetRoleTypeLookupList } from "../../../../services/List/AllLookupList";
import { AddUpdateParking, GetParkingModel } from "../../../../services/Parking/ParkingApi";
import ImagePreview from "../../../../components/custom/ImagePreview";
import SuccessModal from "../../../../components/custom/SuccessModal";
import { UploadImage } from "../../../../services/Media/UploadFile";

const AddUpdateForm = ({ onClose, modelRequestData }) => {

    const { userKeyID } = JSON.parse(localStorage.getItem('login'))
    //===================state=====================
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [showSuccessPopupModal, setShowSuccessPopupModal] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [lookupList, setLookupList] = useState({
        roleTypeLookupList: [],
    })
    const [formData, setFormData] = useState({
        // userKeyID": "4B0C3AB8-849A-4A8E-9394-9F524B2C63C5",
        parkingKeyID: null,//add update
        parkingName: null,
        parkingOwnerID: modelRequestData?.userID,
        latitude: null,
        longitude: null,
        address: null,
        parkingOwnerLatitude: null,
        parkingOwnerLongitude: null,
        parkingCapacity: null,
        isPaidParking: false,
        isGovParking: false,
        parkingImageURLs: [],
    });
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [errors, setErrors] = useState({});
    //========================useEffect==========================
    useEffect(() => {
        const fetchLookupData = async () => {
            try {
                const [
                    roleTypeLookupList,
                    allUsersLookupList
                ] = await Promise.all([
                    GetRoleTypeLookupList('ParkingAdmin'),
                    GetAllUserLookupList(),
                ]);
                setLookupList({
                    roleTypeLookupList: mapToSelectOptions(
                        roleTypeLookupList?.responseData?.data || [],
                        "roleType",
                        "roleID"
                    ),
                    allUsersLookupList: mapToSelectOptions(
                        allUsersLookupList?.responseData?.data || [],
                        "name",
                        "userID"
                    ),
                });
            } catch (error) {
                console.log("Lookup fetch error:", error);
            } finally {

            }
        };
        // fetchLookupData();
    }, []);

    useEffect(() => {
        if (modelRequestData.Action === "Update" && modelRequestData.KeyID) {
            GetModelData(modelRequestData.KeyID);
        } else {
            setFormData({
                parkingName: "",
                latitude: "",
                longitude: "",
                parkingCapacity: "",
                parkingOwnerID: modelRequestData?.userID,
                parkingImageURLs: [],
            })
        }
    }, []);

    //==========================functions=============
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        try {
            setIsSubmitting(true);

            const uploadedUrls = [];
            const previewItems = [];

            for (const file of files) {
                const formDataObj = new FormData();
                formDataObj.append("projectName", "WowUatS3Bucket");
                formDataObj.append("moduleName", "Parking");
                formDataObj.append("userId", userKeyID);
                formDataObj.append("imageFile", file);

                const res = await UploadImage(formDataObj);

                //   Only if upload is successful
                if (res?.s3Url) {
                    uploadedUrls.push(res.s3Url);

                    previewItems.push({
                        file, // keep file reference if needed later
                        previewUrl: URL.createObjectURL(file),
                        s3Url: res.s3Url, // optional (useful for remove mapping)
                    });
                }
            }

            //   Update preview images ONCE
            setPreviewImages(prev => [...prev, ...previewItems]);

            //  Update payload URLs (unchanged behavior)
            setFormData(prev => ({
                ...prev,
                parkingImageURLs: [...prev.parkingImageURLs, ...uploadedUrls],
            }));

        } catch (error) {
            console.error("Image upload failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveImage = (index) => {
        setPreviewImages(prev => {
            URL.revokeObjectURL(prev[index].previewUrl); // prevent memory leak
            return prev.filter((_, i) => i !== index);
        });

        setFormData(prev => ({
            ...prev,
            parkingImageURLs: prev.parkingImageURLs.filter((_, i) => i !== index),
        }));
    };



    // const handleRemoveImage = (index) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         parkingImageURLs: prev.parkingImageURLs.filter((_, i) => i !== index),
    //     }));
    // };


    const mapToSelectOptions = (list = [], labelKey, valueKey) => {
        return list.map(item => ({
            label: item[labelKey],
            value: item[valueKey],
        }));
    };

    const validate = () => {
        const newErrors = {};

        // Parking Name
        if (!formData.parkingName || !formData.parkingName.trim()) {
            newErrors.parkingName = "Parking Name is required";
        }
        if (!formData.address || !formData.address.trim()) {
            newErrors.address = "Address is required";
        }
        if (!formData.parkingCapacity || !formData.parkingCapacity) {
            newErrors.parkingCapacity = "Parking Capacity is required";
        }

        if (!formData.latitude || !formData.latitude.trim()) {
            newErrors.latitude = "Latitude is required";
        }

        if (!formData.longitude || !formData.longitude.trim()) {
            newErrors.longitude = "Longitude is required";
        }
        if (!formData.parkingOwnerLongitude || !formData.parkingOwnerLongitude.trim()) {
            newErrors.parkingOwnerLongitude = "Latitude is required";
        }

        if (!formData.parkingOwnerLatitude || !formData.parkingOwnerLatitude.trim()) {
            newErrors.parkingOwnerLatitude = "Longitude is required";
        }

        //  Radio validation
        if (formData.isPaidParking === undefined || formData.isPaidParking === null) {
            newErrors.isPaidParking = "Please select any option";
        }

        if (
            formData.isGovParking === undefined ||
            formData.isGovParking === null
        ) {
            newErrors.isGovParking = "Please select any option";
        }

        // Images validation
        // if (!formData.parkingImageURLs || formData.parkingImageURLs.length === 0) {
        //     newErrors.parkingImageURLs = "Please upload at least one parking image";
        // }


        return newErrors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            // console.log("payload ==>>", { ...formData, userKeyID })
            const data = await AddUpdateParking({ ...formData, userKeyID, parkingImageURLs: [] });
            if (data?.statusCode === 200) {
                setShowSuccessPopupModal(true);
            } else {
                const errorMessage = data?.response?.data?.errorMessage;
                setErrorMessage(errorMessage);
            }
        } catch (error) {
            console.log("error ==>", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const GetModelData = async (KeyID) => {
        const data = await GetParkingModel(KeyID);
        if (data.statusCode === 200) {
            const ModalData = data.responseData.data;
            setFormData({
                ...ModalData,
                parkingImageURLs: ModalData.parkingImageURLs || [],
            })
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl flex flex-col shadow-lg text-gray-700 text-base w-full sm:w-96 md:w-[500px] lg:w-[600px] xl:w-[700px] max-h-[90vh]">
                {/* Sticky Header */}
                <div className="bg-background px-6 py-4 border-b border-gray-200 sticky top-0 z-10 rounded-t-2xl">
                    <h2 className="text-xl font-semibold">{modelRequestData?.Action == "Update" ? "Update Parking" : "Add Parking"}</h2>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    className="flex-1 overflow-y-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {/* Parking Name */}
                    <div>
                        <label className="block font-medium">
                            Parking Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="parkingName"
                            placeholder="Enter full name"
                            value={formData.parkingName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.parkingName ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.parkingName && <p className="text-red-500 text-sm mt-1">{errors.parkingName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block font-medium">
                            Parking Capacity <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="parkingCapacity"
                            placeholder="Enter Parking Capacity"
                            value={formData.parkingCapacity}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.parkingCapacity ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.parkingCapacity && <p className="text-red-500 text-sm mt-1">{errors.parkingCapacity}</p>}
                    </div>
                    {/* Latitude */}
                    <div>
                        <label className="block font-medium">
                            Latitude <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.latitude ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                            placeholder="Enter Latitude"
                            value={formData.latitude || ""}
                            onChange={(e) => {

                                setFormData({
                                    ...formData,
                                    latitude: e.target.value
                                });
                                setErrors(prev => ({ ...prev, latitude: "" }));
                            }}
                        />
                        {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
                    </div>

                    {/* longitude  */}
                    <div>
                        <label className="block font-medium">Longitude <span className="text-red-500">*</span></label>
                        <input
                            maxLength={40}
                            type="text"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            onBlur={() =>
                                setFormData(prev => ({
                                    ...prev,
                                    longitude: prev.longitude?.trim()
                                }))
                            }
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.longitude ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                            placeholder="Enter Longitude"
                        />
                        {errors.longitude && (
                            <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>
                        )}
                    </div>

                    {/*Owner Latitude */}
                    <div>
                        <label className="block font-medium">
                            Owner Latitude <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.latitude ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                            placeholder="Enter Owner Latitude"
                            value={formData.parkingOwnerLatitude || ""}
                            onChange={(e) => {

                                setFormData({
                                    ...formData,
                                    parkingOwnerLatitude: e.target.value
                                });
                                setErrors(prev => ({ ...prev, parkingOwnerLatitude: "" }));
                            }}
                        />
                        {errors.parkingOwnerLatitude && <p className="text-red-500 text-sm mt-1">{errors.parkingOwnerLatitude}</p>}
                    </div>

                    {/* Owner Longitude  */}
                    <div>
                        <label className="block font-medium">Owner Longitude <span className="text-red-500">*</span></label>
                        <input
                            maxLength={40}
                            type="text"
                            name="parkingOwnerLongitude"
                            value={formData.parkingOwnerLongitude}
                            onChange={handleChange}
                            onBlur={() =>
                                setFormData(prev => ({
                                    ...prev,
                                    parkingOwnerLongitude: prev.parkingOwnerLongitude?.trim()
                                }))
                            }
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.parkingOwnerLongitude ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                            placeholder="Enter Owner Longitude"
                        />
                        {errors.parkingOwnerLongitude && (
                            <p className="text-red-500 text-sm mt-1">{errors.parkingOwnerLongitude}</p>
                        )}
                    </div>



                    {/* Paid Parking */}
                    <div>
                        <label className="block font-medium mb-2">
                            Paid Parking <span className="text-red-500">*</span>
                        </label>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="isPaidParking"
                                    checked={formData.isPaidParking === true}
                                    onChange={() => {
                                        setFormData(prev => ({ ...prev, isPaidParking: true }));
                                        setErrors(prev => ({ ...prev, isPaidParking: "" }));
                                    }}
                                    className="accent-secondary"
                                />
                                Yes
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="isPaidParking"
                                    checked={formData.isPaidParking === false}
                                    onChange={() => {
                                        setFormData(prev => ({ ...prev, isPaidParking: false }));
                                        setErrors(prev => ({ ...prev, isPaidParking: "" }));
                                    }}
                                    className="accent-secondary"
                                />
                                No
                            </label>
                        </div>

                        {errors.isPaidParking && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.isPaidParking}
                            </p>
                        )}
                    </div>


                    {/* Government Parking */}
                    <div>
                        <label className="block font-medium mb-2">
                            Government Parking <span className="text-red-500">*</span>
                        </label>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="isGovParking"
                                    checked={formData.isGovParking === true}
                                    onChange={() => {
                                        setFormData(prev => ({ ...prev, isGovParking: true }));
                                        setErrors(prev => ({ ...prev, isGovParking: "" }));
                                    }}
                                    className="accent-secondary"
                                />
                                Yes
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="isGovParking"
                                    checked={formData.isGovParking === false}
                                    onChange={() => {
                                        setFormData(prev => ({ ...prev, isGovParking: false }));
                                        setErrors(prev => ({ ...prev, isGovParking: "" }));
                                    }}
                                    className="accent-secondary"
                                />
                                No
                            </label>
                        </div>

                        {errors.isGovParking && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.isGovParking}
                            </p>
                        )}
                    </div>


                    {/* Address */}
                    <div>
                        <label className="block font-medium">Address <span className="text-red-500">*</span></label>
                        <textarea
                            type="text"
                            name="address"
                            placeholder="Enter address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-secondary"
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                    </div>

                    {/* Upload Parking Images */}
                    {modelRequestData.Action == "Add" && (
                        <div>
                            <label className="block font-medium mb-2">
                                Parking Images <span className="text-red-500">*</span>
                            </label>

                            <div className="flex items-center gap-3">
                                <label
                                    className={`
                                                           inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition
                                                           ${isSubmitting
                                            ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                                            : errors.parkingImageURLs
                                                ? "border-red-500 bg-red-50 cursor-pointer"
                                                : "hover:bg-gray-50 cursor-pointer"
                                        }
                           `}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => {
                                            handleImageUpload(e);
                                            setErrors(prev => ({ ...prev, parkingImageURLs: "" }));
                                        }}
                                        className="hidden"
                                        disabled={isSubmitting}

                                    />
                                    {isSubmitting ? "Uploading..." : "📷 Upload Images"}
                                </label>

                                {/* Eye icon */}
                                {previewImages.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setShowImagePreview(true)}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                        title="View uploaded images"
                                    >
                                        <FiEye className="text-lg" />
                                        <span className="text-sm">
                                            {previewImages.length}
                                        </span>
                                    </button>
                                )}
                            </div>
                            {errors.parkingImageURLs && (
                                <p className="text-red-500 text-sm mt-1">{errors.parkingImageURLs}</p>
                            )}
                        </div>
                    )}
                </form>

                {/* Sticky Footer */}
                className="bg-background px-6 py-4 border-b border-gray-200 sticky top-0 z-10 rounded-t-2xl"
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-200 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting} // prevent multiple clicks
                    className={`px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition flex items-center justify-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                    {isSubmitting && (
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                    )}
                    {modelRequestData?.Action === "Update" ? "Update" : "Add"}
                </button>
            </div>

            <SuccessModal
                isOpen={showSuccessPopupModal}
                onClose={() => {
                    onClose();
                    setShowSuccessPopupModal(false);
                }}
                modelAction={modelRequestData?.Action}
                actionMessage={'Parking'}
            />

            {/* Image Preview Modal */}
            {
                showImagePreview && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[80vh] flex flex-col">
                            {/* Header */}
                            <div className="px-4 py-3 border-b flex justify-between items-center">
                                <h3 className="font-semibold text-lg">
                                    Uploaded Images ({formData.parkingImageURLs.length})
                                </h3>
                                <button
                                    onClick={() => setShowImagePreview(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-2 overflow-y-auto">
                                <ImagePreview
                                    images={previewImages}
                                    onRemove={handleRemoveImage}
                                />

                            </div>

                            {/* Footer */}
                            <div className="px-4 py-3 border-t flex justify-end">
                                <button
                                    onClick={() => setShowImagePreview(false)}
                                    className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
};

export default AddUpdateForm;


