import React, { useState, useEffect, use } from "react";
import { AddUpdateUser, GetUserModel } from "../../../services/User/UserApi";
import Select from "react-select";
import { GetAllUserLookupList, GetParkingLookupList, GetRoleTypeLookupList } from "../../../services/List/AllLookupList";
import { handleNumericInput, handlePhoneNumberInput } from "../../../Utils/Utils"
import { AddUpdateVehicleType, GetVehicleTypeModel } from "../../../services/Vehicle Type/VehicleType";
import SuccessModal from "../../../components/custom/SuccessModal";
import ErrorModal from "../../../components/custom/ErrorModel";

const AddUpdateForm = ({ onClose, modelRequestData }) => {
    const { userKeyID } = JSON.parse(localStorage.getItem('login'))
    //===================state=====================
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false)
    const [showSuccessPopupModal, setShowSuccessPopupModal] = useState(false);
    const [formData, setFormData] = useState({
        vehicalTypeKeyID: null,
        vehicalType: null,
        dailyCharges: null,
        hourlyCharges: null,
    });
    const [errors, setErrors] = useState({});
    //========================useEffect==========================
    useEffect(() => {
        if (modelRequestData.Action === "Update" && modelRequestData.KeyID) {
            GetCustomModelData(modelRequestData.KeyID);
        } else {
            setFormData({
                vehicalTypeKeyID: null,
                vehicalType: "",
                dailyCharges: "",
                hourlyCharges: ""
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

        // Full Name
        if (!formData.vehicalType || !formData?.vehicalType?.trim()) {
            newErrors.vehicalType = "This field is required";
        }

        if (
            formData.hourlyCharges === null ||
            formData.hourlyCharges === "" ||
            Number(formData.hourlyCharges) <= 0
        ) {
            newErrors.hourlyCharges = "Hourly charges are required";
        }

        // Daily Charges (number)
        if (
            formData.dailyCharges === null ||
            formData.dailyCharges === "" ||
            Number(formData.dailyCharges) <= 0
        ) {
            newErrors.dailyCharges = "Daily charges are required";
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
            const data = await AddUpdateVehicleType({
                ...formData,
                userKeyID,

            });
            if (data?.statusCode === 200) {
                setShowSuccessPopupModal(true);
            } else {
                const errorMessage = data?.response?.data?.errorMessage;
                setErrorMessage(errorMessage);
                setIsErrorOpen(true)

            }
        } catch (error) {
            console.log("error ==>", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const GetCustomModelData = async (KeyID) => {
        const data = await GetVehicleTypeModel(KeyID);
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
                    <h2 className="text-xl font-semibold">{modelRequestData?.Action == "Update" ? "Edit Vehicle Type" : "Add Vehicle Type"}</h2>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    className="flex-1 overflow-y-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {/* Full Name */}
                    <div>
                        <label className="block font-medium">
                            Vehicle Type <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="vehicalType"
                            placeholder="Enter Vehicle type"
                            value={formData.vehicalType}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.vehicalType ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.vehicalType && <p className="text-red-500 text-sm mt-1">{errors.vehicalType}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block font-medium">
                            Hourly Charges <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="phone"
                            name="hourlyCharges"
                            placeholder="Enter hourly charges"
                            value={formData.hourlyCharges}
                            onChange={(e) => {
                                const numericValue = handleNumericInput(e.target.value, 7);

                                setFormData({
                                    ...formData,
                                    hourlyCharges: numericValue,
                                });

                                setErrors(prev => ({ ...prev, hourlyCharges: "" }));
                            }}
                            maxLength={7}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.hourlyCharges ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.hourlyCharges && <p className="text-red-500 text-sm mt-1">{errors.hourlyCharges}</p>}
                    </div>

                    {/* Daily Charges */}
                    <div>
                        <label className="block font-medium">
                            Daily Charges <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.dailyCharges ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                            placeholder="Enter Daily Charges"
                            value={formData.dailyCharges || ""}
                            onChange={(e) => {
                                const numericValue = handleNumericInput(e.target.value, 7);

                                setFormData({
                                    ...formData,
                                    dailyCharges: numericValue,
                                });

                                setErrors(prev => ({ ...prev, dailyCharges: "" }));
                            }}


                            maxLength={7}
                        />
                        {errors.dailyCharges && <p className="text-red-500 text-sm mt-1">{errors.dailyCharges}</p>}
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
                actionMessage={'Vehicle type'}
            />
            <ErrorModal
                isOpen={isErrorOpen}
                onClose={() => setIsErrorOpen(false)}
                errorMessage={errorMessage}
            />
        </div>
    );
};

export default AddUpdateForm;

