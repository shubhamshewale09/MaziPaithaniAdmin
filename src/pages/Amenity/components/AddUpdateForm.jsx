import { useState, useEffect } from "react";
import 'react-date-picker/dist/DatePicker.css';

import SuccessModal from "../../../components/custom/SuccessModal";
import { GetAllAlertTypeLookup, GetAreaLookupList } from "../../../services/List/AllLookupList";
import ErrorModal from "../../../components/custom/ErrorModel";
import { truncateText } from "../../../Utils/Utils";
import AddUpdateAreaForm from "../../Area/components/AddUpdateForm";
import { UploadImage } from "../../../services/Media/UploadFile";
import { AddUpdateAmenity, GetAmenityModel } from "../../../services/Amenity/AmenityApi";

const AddUpdateForm = ({ onClose, modelRequestData }) => {
    const { userKeyID } = JSON.parse(localStorage.getItem('login'))
    //===================state=====================
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [showSuccessPopupModal, setShowSuccessPopupModal] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modelRequest, setModelRequest] = useState({
        KeyID: null,
        Action: null,
        Status: null,
        Name: null,
    })
    const [lookupList, setLookupList] = useState({
        areaLookupList: [],
        alertLookupList: [],
    })
    const [formData, setFormData] = useState({
        amenityName: null,
        iconClass: null,
    });
    const [errors, setErrors] = useState({});
    const [selectedFileName, setSelectedFileName] = useState("");
    const [localPreview, setLocalPreview] = useState(null);

    //========================useEffect==========================

    useEffect(() => {
        if (modelRequestData.Action === "Update" && modelRequestData.KeyID) {
            GetModelData(modelRequestData.KeyID);
        } else {
            setFormData({
                amenityName: null,
                iconClass: null,
            })
        }
    }, []);

    //==========================functions=============
    const mapToSelectOptions = (list = [], labelKey, valueKey) => {
        return list.map(item => ({
            label: item[labelKey],
            value: item[valueKey],
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        // Alert Message
        if (!formData.amenityName || !formData.amenityName.trim()) {
            newErrors.amenityName = "Amenity name is required";
        }


        //icon class
        if (!formData.iconClass) {
            newErrors.iconClass = "Icon is required";
        }

        return newErrors;
    };

    const openAddModal = () => {
        setModelRequest({
            ...modelRequest,
            KeyID: null,
            Action: "Add",
        })
        setModalOpen(true);
    };

    const getBaseS3Url = (url) => {
        if (!url) return url;
        return url.split("?")[0]; // remove everything after ?
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
            const data = await AddUpdateAmenity({
                ...formData,
                userKeyID,
            });
            if (data?.statusCode === 200) {
                setShowSuccessPopupModal(true);
            } else {
                const errorMessage = data?.response?.data?.errors;
                debugger
                setErrorMessage(errorMessage);
                setIsErrorOpen(true)
            }
        } catch (error) {
            console.log("error ==>", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const GetModelData = async (KeyID) => {
        const data = await GetAmenityModel(KeyID);
        if (data.statusCode === 200) {
            const ModalData = data.responseData.data;
            setFormData({
                ...ModalData,
                iconClass: getBaseS3Url(ModalData?.iconClass)
            })
            setLocalPreview(ModalData.iconClass);
        }
    };


    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const localPreview = URL.createObjectURL(file);
        if (!file) return;

        // ---------- Validations ----------
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                iconClass: "Only JPG, JPEG, PNG allowed"
            }));
            return;
        }

        // if (file.size > 2 * 1024 * 1024) {
        //     setErrors(prev => ({
        //         ...prev,
        //         iconClass: "Max size 2MB allowed"
        //     }));
        //     return;
        // }

        try {
            setIsSubmitting(true);

            // Store file name for UI tick (if you're using it)
            setSelectedFileName(file.name);

            // ---------- Call Upload API ----------
            const formDataObj = new FormData();
            formDataObj.append("projectName", "WowUatS3Bucket");
            formDataObj.append("moduleName", "Amenity");
            formDataObj.append("userId", userKeyID);
            formDataObj.append("imageFile", file);

            const res = await UploadImage(formDataObj);

            if (res?.s3Url) {
                // Save SINGLE string in iconClass
                setFormData(prev => ({
                    ...prev,
                    iconClass: res.s3Url
                    // iconClass: localPreview
                }));
                setLocalPreview(localPreview);
                setErrors(prev => ({ ...prev, iconClass: "" }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    iconClass: "Image upload failed"
                }));
            }

        } catch (error) {
            console.error("Image upload failed", error);
            setErrors(prev => ({
                ...prev,
                iconClass: "Image upload failed"
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, iconClass: null }));
        setLocalPreview(null);
        setSelectedFileName("");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl flex flex-col shadow-lg text-gray-700 text-base w-full sm:w-80 md:w-96 lg:w-96 xl:w-96 max-h-[90vh]">

                {/* Sticky Header */}
                <div className="flex justify-between bg-background px-6 py-4 border-b border-gray-200 sticky top-0 z-10 rounded-t-2xl">
                    <h2 className="text-xl font-semibold">{modelRequestData?.Action == "Update" ? "Update Amenity" : "Add Amenity"}</h2>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto px-6 py-4 grid grid-cols-1 gap-4"
                >

                    {/* Aminety Name */}
                    <div>
                        <label className="block font-medium">
                            Aminety Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="amenityName"
                            placeholder="Enter Aminety Name"
                            value={formData.amenityName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.amenityName ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.amenityName && <p className="text-red-500 text-sm mt-1">{errors.amenityName}</p>}
                    </div>

                    {/* icon upload image  */}
                    <div className="col">
                        <label>
                            Icon <span style={{ color: 'red' }}>*</span>
                        </label>

                        <div className="mb-2 flex items-center gap-3">
                            <label
                                htmlFor="iconClass"
                                className="px-4 py-2 border text-black rounded-lg cursor-pointer hover:opacity-90"
                            >
                                Choose File
                            </label>

                            <input
                                id="iconClass"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />

                            {selectedFileName && (
                                <span className="text-sm text-green-600 flex items-center gap-1">
                                    {truncateText(selectedFileName, 20)} ✅
                                </span>
                            )}
                        </div>

                        <small className="text-gray-500">
                            Supported file types: JPG, JPEG, PNG (Max size 2 MB)
                        </small>
                        <div>
                            {errors.iconClass && (
                                <small className="text-red-500 d-block mt-1">
                                    {errors.iconClass}
                                </small>
                            )}
                        </div>
                        <div className="d-flex gap-3 mt-2">
                            {localPreview && (
                                <div style={{ position: "relative", width: 120, height: 120 }}>
                                    <img
                                        src={localPreview}
                                        alt="preview"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            border: "1px solid #ddd"
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        style={{
                                            position: "absolute",
                                            top: 5,
                                            right: 5,
                                            borderRadius: "50%",
                                            background: "red",
                                            color: "white",
                                            border: "none",
                                            padding: "2px 6px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

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
                actionMessage={'Amenity'}
            />

            {/* error modal  */}
            <ErrorModal
                isOpen={isErrorOpen}
                onClose={() => setIsErrorOpen(false)}
                errorMessage={errorMessage}
            />

            {/* User Form Modal */}
            {
                modalOpen && (
                    <AddUpdateAreaForm
                        onClose={async () => {
                            setModalOpen(false);
                            // setAppliedFilter({ ...appliedFilter });
                            const alertRes = await GetAreaLookupList()

                            if (alertRes.statusCode == 200) {
                                setLookupList({
                                    ...lookupList,
                                    areaLookupList: mapToSelectOptions(
                                        alertRes?.responseData?.data || [],
                                        "areaName",
                                        "areaNameID"
                                    )
                                })
                            }
                        }}
                        modelRequestData={modelRequest}
                    />
                )
            }
        </div>
    );
};

export default AddUpdateForm;

