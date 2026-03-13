import { useState, useEffect } from "react";
import Select from "react-select";
import { FiEye } from "react-icons/fi";

import { GetComplaintCategories } from "../../../services/List/AllLookupList";
import { allowOnlyText, handlePhoneNumberInput, primarySelectStyles, trimOnBlur } from "../../../Utils/Utils"
import SuccessModal from "../../../components/custom/SuccessModal";
import ErrorModal from "../../../components/custom/ErrorModel";
import { AddUpdateLostPost, GetLostAndFoundModel } from "../../../services/Lost And Found/LostAndFoundApi";
import { UploadImage } from "../../../services/Media/UploadFile";
import ImagePreview from "../../../components/custom/ImagePreview";
import LocationMapModal from "../../../components/custom/LocationMapModal";

const AddUpdateForm = ({ onClose, modelRequestData }) => {
    const { userKeyID } = JSON.parse(localStorage.getItem('login'))
    //===================state=====================
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [lookupList, setLookupList] = useState({
        categoryComplaintLookupList: [],
    })
    const [showSuccessPopupModal, setShowSuccessPopupModal] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [formData, setFormData] = useState({
        //    userKeyID
        contactPersonName: null,
        complaintCategoryID: null,
        contactPersonNo: null,
        latitude: null,
        longitude: null,
        address: null,
        isItemLost: false,
        complaintTypeID: 2,
        imageURL: []
    });
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState(false);
    const [locationMode, setLocationMode] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState({
        lat: null,
        lng: null,
    });
    const [showMap, setShowMap] = useState(false);
    //========================useEffect==========================
    useEffect(() => {
        const fetchLookupData = async () => {
            try {
                const [
                    categoryComplaintLookupList,
                    // allUsersLookupList
                ] = await Promise.all([
                    GetComplaintCategories(1),
                    // GetServiceTypeLookupList(),
                    // GetAllUserLookupList(),
                ]);
                setLookupList({
                    categoryComplaintLookupList: mapToSelectOptions(
                        categoryComplaintLookupList?.responseData?.data || [],
                        "complaintCategory",
                        "ccid"
                    ),
                    // allUsersLookupList: mapToSelectOptions(
                    //     allUsersLookupList?.responseData?.data || [],
                    //     "name",
                    //     "userID"
                    // ),
                });
            } catch (error) {
                console.log("Lookup fetch error:", error);
            } finally {

            }
        };
        fetchLookupData();
    }, []);

    useEffect(() => {
        if (modelRequestData.Action === "Update" && modelRequestData.KeyID) {
            GetModelData(modelRequestData.KeyID);
        } else {
            setFormData({
                contactPersonName: "",
                complaintCategoryID: "",
                contactPersonNo: "",
                address: "",
                latitude: "",
                longitude: "",
                complaintTypeID: 2,
                imageURL: [],
            })
        }
    }, []);

    //==========================functions=============
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};

        // Contact Person Name
        if (!formData.contactPersonName || !formData.contactPersonName.trim()) {
            newErrors.contactPersonName = "Contact Person Name is required";
        }
        // Latitude
        if (!formData.latitude || !formData.latitude.trim()) {
            newErrors.latitude = "Latitude is required";
        }
        // Longitude
        if (!formData.longitude || !formData.longitude.trim()) {
            newErrors.longitude = "Longitude is required";
        }
        //address
        if (!formData.address || !formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        //description
        if (!formData.description || !formData.description.trim()) {
            newErrors.description = "Description is required";
        }

        // Mobile Number 
        if (!formData.contactPersonNo || !formData.contactPersonNo.trim()) {
            newErrors.contactPersonNo = "Mobile number is required";
        } else if (formData.contactPersonNo.length !== 10) {
            newErrors.contactPersonNo = "Mobile number must be 10 digits";
        }

        // Services list
        if (!formData.complaintCategoryID) {
            newErrors.complaintCategoryID = "Complaint category is required";
        }

        if (
            formData.isItemLost === undefined ||
            formData.isItemLost === null
        ) {
            newErrors.isItemLost = "Please select any option";
        }
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
            const data = await AddUpdateLostPost({ ...formData, userKeyID });
            if (data?.statusCode === 200) {
                setShowSuccessPopupModal(true);
            } else {
                setIsErrorOpen(true);
                // setConfirmationModal(false);
                const errorMessage = data?.response?.data?.errorMessage;
                setErrorMessage(errorMessage);
            }
        } catch (error) {
            console.log("error ==>", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const mapToSelectOptions = (list = [], labelKey, valueKey) => {
        return list.map(item => ({
            label: item[labelKey],
            value: item[valueKey],
        }));
    };

    const GetModelData = async (KeyID) => {
        const data = await GetLostAndFoundModel(KeyID);
        if (data.statusCode === 200) {
            const ModalData = data.responseData.data;
            setFormData({
                ...ModalData
            })
        }
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
                formDataObj.append("moduleName", "LostAndFound");
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
                imageURL: [...prev.imageURL, ...uploadedUrls],
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
            imageURL: prev.imageURL.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl flex flex-col shadow-lg text-gray-700 text-base w-full sm:w-96 md:w-[500px] lg:w-[600px] xl:w-[700px] max-h-[90vh]">
                {/* Sticky Header */}
                <div className="bg-background px-6 py-4 border-b border-gray-200 sticky top-0 z-10 rounded-t-2xl">
                    <h2 className="text-xl font-semibold">{modelRequestData?.Action == "Update" ? "Edit Complaint" : "Add Complaint"}</h2>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    className="flex-1 overflow-y-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {/* Contact Person Name */}
                    <div>
                        <label className="block font-medium">
                            Contact Person Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="contactPersonName"
                            placeholder="Enter Contact Person Name"
                            value={formData.contactPersonName}
                            onChange={(e) => {
                                const cleanedValue = allowOnlyText(e.target.value);
                                setFormData({ ...formData, contactPersonName: cleanedValue });
                            }}
                            onBlur={(e) => {
                                const trimmedValue = trimOnBlur(e.target.value);
                                setFormData({ ...formData, contactPersonName: trimmedValue });
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.contactPersonName ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.contactPersonName && <p className="text-red-500 text-sm mt-1">{errors.contactPersonName}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="block font-medium">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.contactPersonNo ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                            placeholder="Enter Mobile Number"
                            value={formData.contactPersonNo || ""}
                            onChange={(e) => {
                                const result = handlePhoneNumberInput(e.target.value);

                                setFormData({
                                    ...formData,
                                    contactPersonNo: result.value,
                                });

                                setErrors(prev => ({
                                    ...prev,
                                    contactPersonNo: result.error || "",
                                }));
                            }}
                        />
                        {errors.contactPersonNo && <p className="text-red-500 text-sm mt-1">{errors.contactPersonNo}</p>}
                    </div>

                    {/* Service */}
                    <div>
                        <label className="block font-medium">
                            Complaint Category <span className="text-red-500">*</span>
                        </label>
                        <Select
                            className="w-full"
                            options={lookupList?.categoryComplaintLookupList}
                            onChange={(val) => {
                                setFormData(prev => ({
                                    ...prev,
                                    complaintCategoryID: val?.value || null,
                                }));

                                setErrors(prev => ({
                                    ...prev,
                                    complaintCategoryID: ""
                                }));
                            }}
                            value={
                                lookupList?.categoryComplaintLookupList?.find(
                                    (option) => option.value === formData.complaintCategoryID
                                ) || null
                            }
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            menuShouldScrollIntoView={false}
                            closeMenuOnScroll={true}
                            maxMenuHeight={200}
                            styles={primarySelectStyles}
                            hasError={!!errors.complaintCategoryID}
                        />
                        {errors.complaintCategoryID && (
                            <p className="text-red-500 text-sm mt-1">{errors.complaintCategoryID}</p>
                        )}
                    </div>

                    {/* Government Parking */}
                    <div>
                        <label className="block font-medium mb-2">
                            Item Lost <span className="text-red-500">*</span>
                        </label>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="isItemLost"
                                    checked={formData.isItemLost === true}
                                    onChange={() => {
                                        setFormData(prev => ({ ...prev, isItemLost: true }));
                                        setErrors(prev => ({ ...prev, isItemLost: "" }));
                                    }}
                                    className="accent-secondary"
                                />
                                Yes
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="isItemLost"
                                    checked={formData.isItemLost === false}
                                    onChange={() => {
                                        setFormData(prev => ({ ...prev, isItemLost: false }));
                                        setErrors(prev => ({ ...prev, isItemLost: "" }));
                                    }}
                                    className="accent-secondary"
                                />
                                No
                            </label>
                        </div>

                        {errors.isItemLost && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.isItemLost}
                            </p>
                        )}
                    </div>


                    {/* Latitude */}
                    <div>
                        <label className="flex justify-between items-center font-medium">
                            <span className="flex items-center gap-1">
                                Latitude <span className="text-red-500">*</span>

                                <span
                                    className="text-blue-600 underline cursor-pointer hover:underline text-sm ml-1"
                                    onClick={() => setShowMap(true)}
                                >
                                    (Pick location)
                                </span>
                            </span>


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
                                    latitude: e.target.value,
                                });
                                setErrors(prev => ({ ...prev, latitude: "" }));
                            }}
                        />
                        {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
                    </div>

                    {/* Longitude  */}
                    <div>
                        <label className="flex justify-between items-center font-medium">
                            <span className="flex items-center gap-1">
                                Longitude <span className="text-red-500">*</span>

                                <span
                                    className="text-blue-600 underline cursor-pointer hover:underline text-sm ml-1"
                                    onClick={() => setShowMap(true)}
                                >
                                    (Pick location)
                                </span>
                            </span>
                        </label>

                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.longitude ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                            placeholder="Enter Longitude"
                            value={formData.longitude || ""}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    longitude: e.target.value,
                                });
                                setErrors(prev => ({ ...prev, longitude: "" }));
                            }}
                        />
                        {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-medium">Description <span className="text-red-500">*</span></label>
                        <textarea
                            type="text"
                            name="description"
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.description
                                ? "border-red-500 focus:ring-red-500"
                                : "focus:ring-secondary"
                                }`}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description}</p>
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
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.address
                                ? "border-red-500 focus:ring-red-500"
                                : "focus:ring-secondary"
                                }`}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm">{errors.address}</p>
                        )}
                    </div>

                    {/* Upload Images */}
                    {modelRequestData.Action == "Add" && (
                        <div>
                            <label className="block font-medium mb-2">
                                Upload Image
                            </label>

                            <div className="flex items-center gap-3">
                                <label
                                    className={`
                                                           inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition
                                                           ${isSubmitting
                                            ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                                            : errors.imageURL
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
                                            setErrors(prev => ({ ...prev, imageURL: "" }));
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
                            {errors.imageURL && (
                                <p className="text-red-500 text-sm mt-1">{errors.imageURL}</p>
                            )}
                        </div>
                    )}
                </form>

                {/* Sticky Footer */}
                <div className="bg-background px-6 py-4 border-t border-gray-200 sticky bottom-0 flex justify-end gap-2 z-10 rounded-b-2xl">
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
            </div>
            <SuccessModal
                isOpen={showSuccessPopupModal}
                onClose={() => {
                    onClose();
                    setShowSuccessPopupModal(false);
                }}
                modelAction={modelRequestData?.Action}
                actionMessage={'Lost and found post'}
            />
            {/* error modal  */}
            <ErrorModal
                isOpen={isErrorOpen}
                onClose={() => setIsErrorOpen(false)}
                errorMessage={errorMessage}
            />

            <LocationMapModal
                show={showMap}
                formData={formData}
                setFormData={setFormData}
                setSelectedLocation={setSelectedLocation}
                onClose={() => setShowMap(false)}
                onSubmit={() => setShowMap(false)}
                onLocationSelect={(loc) => {
                    // SIMPLE: directly store in service form
                    setFormData(prev => ({
                        ...prev,
                        latitude: loc.lat.toString(),
                        longitude: loc.lng.toString(),
                         address: loc.address || prev.address,
                    }));
                }}
            />
            {/* Image Preview Modal */}
            {showImagePreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[80vh] flex flex-col">
                        {/* Header */}
                        <div className="px-4 py-3 border-b flex justify-between items-center">
                            <h3 className="font-semibold text-lg">
                                Uploaded Images ({formData.imageURL.length})
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
            )}
        </div>
    );
};

export default AddUpdateForm;
