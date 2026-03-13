import { useState, useEffect } from "react";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import Select from "react-select";

import SuccessModal from "../../../../components/custom/SuccessModal";
import TextEditor from "../../../../components/custom/TextEditor";
import ImagePreview from "../../../../components/custom/ImagePreview";
import { UploadImage } from "../../../../services/Media/UploadFile";
import { AddUpdateEvent, GetEventModel } from "../../../../services/Event/EventApi";
import LocationMapModal from "../../../../components/custom/LocationMapModal";
import { GetAllLanguageLookUpList } from "../../../../services/List/AllLookupList";
import { primarySelectStyles } from "../../../../Utils/Utils";

const AddUpdateForm = ({ onClose, modelRequestData, existingLangIDs, keyID }) => {
    const { userKeyID } = JSON.parse(localStorage.getItem('login'))
    //===================state=====================
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [showSuccessPopupModal, setShowSuccessPopupModal] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [formData, setFormData] = useState({
        eventKeyID: keyID,
        eventTitle: null,
        eventDate: null,
        latitude: null,
        longitude: null,
        address: null,
        eventURL: [],
    });
    const [lookupList, setLookupList] = useState({
        languageLookupList: []
    })
    const [errors, setErrors] = useState({});
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
                    languageRes
                ] = await Promise.all([
                    GetAllLanguageLookUpList()
                ]);

                // Map Languages
                const mappedLanguages = mapToSelectOptions(
                    languageRes?.responseData?.data || [],
                    "languageName",
                    "appLangID"
                );

                // 🔥 Remove existing languages in update mode
                const cleanedExistingLangIDs =
                    modelRequestData?.Action === "Update"
                        ? existingLangIDs?.filter(
                            id => id !== modelRequestData?.appLangID
                        )
                        : existingLangIDs || [];

                const filteredLanguages = mappedLanguages.filter(
                    lang => !cleanedExistingLangIDs.includes(lang.value)
                );

                //   Update state ONCE
                setLookupList({
                    languageLookupList: filteredLanguages
                });

            } catch (error) {
                console.log("Lookup fetch error:", error);
            }
        };

        fetchLookupData();
    }, [existingLangIDs, modelRequestData]);

    useEffect(() => {
        if (modelRequestData.Action === "Update" && modelRequestData.KeyID) {
            GetModelData(modelRequestData.KeyID, modelRequestData.appLangID);
        } else {
            setFormData({
                eventKeyID: keyID,
                eventTitle: "",
                latitude: "",
                longitude: "",
                eventURL: [],
            })
        }
    }, []);

    //==========================functions=============
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleDateChange = (selectedDate) => {
        const fromDateUTC = new Date(Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
        ));
        const fromDateISO = fromDateUTC.toISOString();
        setFormData((prevState) => ({
            ...prevState,
            eventDate: fromDateISO
        }));

        setErrors({ ...errors, eventDate: "" });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        try {
            setIsSubmitting(true);

            const uploadedUrls = [];

            for (const file of files) {
                const formDataObj = new FormData();
                formDataObj.append("projectName", "WowUatS3Bucket");
                formDataObj.append("moduleName", "Event");
                formDataObj.append("userId", userKeyID);
                formDataObj.append("imageFile", file);

                const res = await UploadImage(formDataObj);

                if (res?.s3Url) {
                    uploadedUrls.push(res.s3Url); // push string only
                }
            }

            setFormData(prev => ({
                ...prev,
                eventURL: [...prev.eventURL, ...uploadedUrls], // array merge
            }));

        } catch (error) {
            console.error("Image upload failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            eventURL: prev.eventURL.filter((_, i) => i !== index),
        }));
    };

    const mapToSelectOptions = (list = [], labelKey, valueKey) => {
        return list.map(item => ({
            label: item[labelKey],
            value: item[valueKey],
        }));
    };

    const validate = () => {
        const newErrors = {};

        // Event Title
        if (!formData.eventTitle || !formData.eventTitle.trim()) {
            newErrors.eventTitle = "Event Title is required";
        }
        if (!formData.eventDate) {
            newErrors.eventDate = "Date is required";
        }
        if (!formData.latitude || !formData.latitude.trim()) {
            newErrors.latitude = "Latitude is required";
        }

        if (!formData.longitude || !formData.longitude.trim()) {
            newErrors.longitude = "Longitude is required";
        }

        if (!formData.address || !formData.address.trim()) {
            newErrors.address = "Address is required";
        }
        if (!formData.appLangID) {
            newErrors.appLangID = "Language is required";
        }
        // Images validation
        // if (!formData.eventURL || formData.eventURL.length === 0) {
        //     newErrors.eventURL = "Please upload at least one event image";
        // }

        //description
        if (!formData.description) {
            newErrors.description = "Description is required";
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
            console.log("payload ==>>", { ...formData, userKeyID })
            const data = await AddUpdateEvent({ ...formData, userKeyID });
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

    const GetModelData = async (KeyID, appLangID) => {
        const data = await GetEventModel(KeyID, appLangID);
        if (data.statusCode === 200) {
            const ModalData = data.responseData.data;
            setFormData({
                ...ModalData,
                eventURL: ModalData.eventURL || [],
            })
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl flex flex-col shadow-lg text-gray-700 text-base w-full sm:w-96 md:w-[500px] lg:w-[600px] xl:w-[700px] max-h-[90vh]">
                {/* Sticky Header */}
                <div className="bg-background px-6 py-4 border-b border-gray-200 sticky top-0 z-10 rounded-t-2xl">
                    <h2 className="text-xl font-semibold">{modelRequestData?.Action == "Update" ? "Update Event" : "Add Event"}</h2>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    className="flex-1 overflow-y-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >

                    {/* language lookup list  */}
                    <div>
                        <label className="block font-medium">
                            Language <span className="text-red-500">*</span>
                        </label>
                        <Select
                            className={`{w-full ${errors.appLangID ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"}`}
                            options={lookupList?.languageLookupList}
                            onChange={(selectedOptions) => {
                                setFormData(prev => ({
                                    ...prev,
                                    appLangID: selectedOptions?.value
                                }));

                                setErrors(prev => ({
                                    ...prev,
                                    appLangID: ""
                                }));
                            }}
                            value={lookupList?.languageLookupList?.filter((item) => item.value === formData.appLangID)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            menuShouldScrollIntoView={false}
                            closeMenuOnScroll={true}
                            maxMenuHeight={200}
                            styles={primarySelectStyles}
                            hasError={!!errors.appLangID}
                        />
                        {errors.appLangID && (
                            <p className="text-red-500 text-sm mt-1">{errors.appLangID}</p>
                        )}
                    </div>

                    {/* Event Title */}
                    <div>
                        <label className="block font-medium">
                            Event Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="eventTitle"
                            placeholder="Enter full name"
                            value={formData.eventTitle}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.eventTitle ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.eventTitle && <p className="text-red-500 text-sm mt-1">{errors.eventTitle}</p>}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block font-medium">
                            Event Date <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                            value={formData?.eventDate} // Use "selected" instead of "value"
                            onChange={handleDateChange}
                            label="From Date"
                            clearIcon={null}
                            popperPlacement="bottom-start"
                            className={`${errors.eventDate ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
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

                    {/* Address */}
                    <div>
                        <label className="block font-medium">Address <span className="text-red-500">*</span></label>
                        <textarea
                            type="text"
                            name="address"
                            placeholder="Enter address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.address ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                    </div>


                    {/* Upload Event Images */}
                    {/* <div>
                        <label className="block font-medium mb-2">
                            Event Images <span className="text-red-500">*</span>
                        </label>

                        <div className="flex items-center gap-3">
                            <label
                                className={`
                                        inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition
                                        ${isSubmitting
                                        ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                                        : errors.eventURL
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
                                        setErrors(prev => ({ ...prev, eventURL: "" }));
                                    }}
                                    className="hidden"
                                    disabled={isSubmitting}

                                />
                                {isSubmitting ? "Uploading..." : "📷 Upload Images"}
                            </label>

                            
                            {formData.eventURL?.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setShowImagePreview(true)}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                    title="View uploaded images"
                                >
                                    <FiEye className="text-lg" />
                                    <span className="text-sm">
                                        {formData.eventURL.length}
                                    </span>
                                </button>
                            )}
                        </div>
                        {errors.eventURL && (
                            <p className="text-red-500 text-sm mt-1">{errors.eventURL}</p>
                        )}
                    </div> */}

                    {/* Description editor */}
                    <div className="sm:col-span-2">
                        <label className="block font-medium">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <TextEditor
                            editorState={formData?.description}
                            handleContentChange={(htmlContent) => {
                                const strippedContent = htmlContent
                                    .replace(/<[^>]+>/g, "")
                                    .trim();
                                setFormData(prev => ({
                                    ...prev,
                                    description: strippedContent === "" ? null : htmlContent,
                                }));
                                setErrors(prev => ({ ...prev, description: "" }));
                            }}
                        />

                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description}
                            </p>
                        )}
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
                actionMessage={'Event'}
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
                                Uploaded Images ({formData.eventURL.length})
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
                                images={formData.eventURL}
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

