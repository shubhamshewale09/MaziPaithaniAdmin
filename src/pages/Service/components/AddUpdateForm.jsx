import { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import Select from "react-select";

import { GetServiceTypeLookupList } from "../../../services/List/AllLookupList";
import { handlePhoneNumberInput, primarySelectStyles } from "../../../Utils/Utils"
import { AddUpdateService, GetServiceModel } from "../../../services/Service/ServiceApi";
import SuccessModal from "../../../components/custom/SuccessModal";
import ErrorModal from "../../../components/custom/ErrorModel";
import MapLatLngPicker from "../../../components/custom/MapLatLngPicker";
import LocationMapModal from "../../../components/custom/LocationMapModal";

const AddUpdateForm = ({ onClose, modelRequestData }) => {
    const { userKeyID } = JSON.parse(localStorage.getItem('login'))
    //===================state=====================
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lookupList, setLookupList] = useState({
        serviceTypeLookupList: [],
    })
    const [showSuccessPopupModal, setShowSuccessPopupModal] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [formData, setFormData] = useState({
        //    userKeyID
        serviceName: null,
        serviceTypeID: null,
        ownerMoNo: null,
        latitude: null,
        longitude: null,
        address: null
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
                    serviceTypeLookupList,
                ] = await Promise.all([
                    GetServiceTypeLookupList(),
                ]);
                setLookupList({
                    serviceTypeLookupList: mapToSelectOptions(
                        serviceTypeLookupList?.responseData?.data || [],
                        "serviceType",
                        "serviceTypeID"
                    ),
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
                serviceName: "",
                serviceTypeID: "",
                ownerMoNo: "",
                address: "",
                latitude: "",
                longitude: ""
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

        // Service Name
        if (!formData.serviceName || !formData.serviceName.trim()) {
            newErrors.serviceName = "Service Name is required";
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

        // Mobile Number
        if (!formData.ownerMoNo || !formData.ownerMoNo.trim()) {
            newErrors.ownerMoNo = "Mobile number is required";
        } else if (formData.ownerMoNo.length !== 10) {
            newErrors.ownerMoNo = "Mobile number must be 10 digits";
        }

        // Services list
        if (!formData.serviceTypeID) {
            newErrors.serviceTypeID = "Service is required";
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
            const data = await AddUpdateService({ ...formData, userKeyID });
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
        const data = await GetServiceModel(KeyID);
        if (data.statusCode === 200) {
            const ModalData = data.responseData.data;
            setFormData({
                ...ModalData
            })
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl flex flex-col shadow-lg text-gray-700 text-base w-full sm:w-96 md:w-[500px] lg:w-[600px] xl:w-[700px] max-h-[90vh]">
                {/* Sticky Header */}
                <div className="bg-background px-6 py-4 border-b border-gray-200 sticky top-0 z-10 rounded-t-2xl">
                    <h2 className="text-xl font-semibold">{modelRequestData?.Action == "Update" ? "Edit Service" : "Add Service"}</h2>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    className="flex-1 overflow-y-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {/* Service Name */}
                    <div>
                        <label className="block font-medium">
                            Service Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="serviceName"
                            placeholder="Enter Service Name"
                            value={formData.serviceName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.serviceName ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.serviceName && <p className="text-red-500 text-sm mt-1">{errors.serviceName}</p>}
                    </div>

                    {/* Service */}
                    <div>
                        <label className="block font-medium">
                            Govt. Service Type <span className="text-red-500">*</span>
                        </label>
                        <Select
                            className="w-full"
                            options={lookupList?.serviceTypeLookupList}
                            onChange={(val) => {
                                setFormData(prev => ({
                                    ...prev,
                                    serviceTypeID: val?.value || null,
                                }));

                                setErrors(prev => ({
                                    ...prev,
                                    serviceTypeID: ""
                                }));
                            }}
                            value={
                                lookupList?.serviceTypeLookupList?.find(
                                    (option) => option.value === formData.serviceTypeID
                                ) || null
                            }
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            menuShouldScrollIntoView={false}
                            closeMenuOnScroll={true}
                            maxMenuHeight={200}
                            styles={primarySelectStyles}
                            hasError={!!errors.serviceTypeID}

                        />
                        {errors.serviceTypeID && (
                            <p className="text-red-500 text-sm mt-1">{errors.serviceTypeID}</p>
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

                    {/* Mobile Number */}
                    <div>
                        <label className="block font-medium">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.ownerMoNo ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                            placeholder="Enter Mobile Number"
                            value={formData.ownerMoNo || ""}
                            onChange={(e) => {
                                const result = handlePhoneNumberInput(e.target.value);

                                setFormData({
                                    ...formData,
                                    ownerMoNo: result.value,
                                });

                                setErrors(prev => ({
                                    ...prev,
                                    ownerMoNo: result.error || "",
                                }));
                            }}
                        />
                        {errors.ownerMoNo && <p className="text-red-500 text-sm mt-1">{errors.ownerMoNo}</p>}
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
                            <p className="text-red-500 text-sm">{errors.address}</p>
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
                actionMessage={'Service'}
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
        </div >
    );
};

export default AddUpdateForm;
