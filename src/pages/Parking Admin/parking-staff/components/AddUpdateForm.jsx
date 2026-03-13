import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { AddUpdateUser, GetUserModel } from "../../../../services/User/UserApi";
import { GetParkingLookupList } from "../../../../services/List/AllLookupList";
import { allowOnlyText, handlePhoneNumberInput, isValidEmail, primarySelectStyles, trimOnBlur } from "../../../../Utils/Utils"
import SuccessModal from "../../../../components/custom/SuccessModal";

const AddUpdateForm = ({ onClose, modelRequestData }) => {
    const { userKeyID } = JSON.parse(localStorage.getItem('login'))
    //===================state=====================
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [showSuccessPopupModal, setShowSuccessPopupModal] = useState(false);
    const [lookupList, setLookupList] = useState({
        parkingLookupList: [],
    })
    const [formData, setFormData] = useState({
        userKeyIDForUpdate: null,
        fullName: null,
        // parkingIDs: 6,
        parkingIDs: [],
        mobileNo: null,
        password: null,
        emailID: null,
        address: null,
        roleID: 6
    });
    const [errors, setErrors] = useState({});
    //========================useEffect==========================
    useEffect(() => {
        const fetchLookupData = async () => {
            try {
                const [
                    parkingLookupList,
                    // allUsersLookupList
                ] = await Promise.all([
                    GetParkingLookupList(modelRequestData?.userID),
                    // GetAllUserLookupList(),
                ]);
                setLookupList({
                    parkingLookupList: mapToSelectOptions(
                        parkingLookupList?.responseData?.data || [],
                        "parkingName",
                        "parkingID"
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
            GetUserModelData(modelRequestData.KeyID);
        } else {
            setFormData({
                fullName: "",
                roleID: 6,
                parkingIDs: [],
                mobileNo: "",
                password: "",
                emailID: ""
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
        if (!formData.fullName || !formData.fullName.trim()) {
            newErrors.fullName = "Full Name is required";
        }

        //address
        if (!formData.address || !formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        // Email
        // Email (optional)
        if (formData.emailID && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailID)) {
            newErrors.emailID = "Invalid email format";
        }

        // Mobile Number
        if (!formData.mobileNo || !formData.mobileNo.trim()) {
            newErrors.mobileNo = "Mobile number is required";
        }
        else if (formData.mobileNo.length !== 10) {
            newErrors.mobileNo = "Mobile number must be 10 digits";
        }
        else if (!/^[6-9]/.test(formData.mobileNo)) {
            newErrors.mobileNo = "Mobile number must start with 6, 7, 8, or 9";
        }

        // Parkings (multi-select)
        // if (!formData.parkingIDs || formData.parkingIDs.length === 0) {
        //     newErrors.parkingIDs = "At least one parking is required";
        // }


        // Password (optional on edit)
        if (!formData.password || !formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
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
            const data = await AddUpdateUser({
                ...formData,
                userKeyID,
                parkingOwnerKeyID: modelRequestData?.userKeyIDForUpdate
            });


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

    const mapToSelectOptions = (list = [], labelKey, valueKey) => {
        return list.map(item => ({
            label: item[labelKey],
            value: item[valueKey],
        }));
    };

    const GetUserModelData = async (KeyID) => {
        const data = await GetUserModel(KeyID);
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
                    <h2 className="text-xl font-semibold">{modelRequestData?.Action == "Update" ? "Edit Staff" : "Add Staff"}</h2>
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
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter full name"
                            value={formData.fullName}
                            onChange={(e) => {
                                const cleanedValue = allowOnlyText(e.target.value);
                                setFormData({ ...formData, fullName: cleanedValue });
                            }}
                            onBlur={(e) => {
                                const trimmedValue = trimOnBlur(e.target.value);
                                setFormData({ ...formData, fullName: trimmedValue });
                            }}

                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.fullName ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block font-medium">
                            Email
                            {/* <span className="text-red-500">*</span> */}
                        </label>
                        <input
                            type="email"
                            name="emailID"
                            maxLength={40}
                            placeholder="Enter email"
                            value={formData.emailID}
                            onKeyDown={(e) => {
                                if (e.key === " ") {
                                    e.preventDefault(); // blocks space at start, middle, and end
                                }
                            }}

                            onChange={(e) => {
                                const result = isValidEmail(e.target.value);
                                setFormData({
                                    ...formData,
                                    emailID: result.value, // <-- stores cleaned email only
                                });

                                // Real-time validation error handling
                                setErrors((prev) => ({
                                    ...prev,
                                    emailID:
                                        result.value === ""
                                            ? ""
                                            : !result.isValid
                                                ? "Please enter a valid email"
                                                : "",
                                }));
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.emailID ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.emailID && <p className="text-red-500 text-sm mt-1">{errors.emailID}</p>}
                    </div>
                    {/* Mobile */}
                    <div>
                        <label className="block font-medium">
                            Mobile <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.mobileNo ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                            placeholder="Enter Mobile Number"
                            value={formData.mobileNo || ""}
                            onChange={(e) => {
                                const result = handlePhoneNumberInput(e.target.value);

                                setFormData({
                                    ...formData,
                                    mobileNo: result.value,
                                });

                                setErrors(prev => ({
                                    ...prev,
                                    mobileNo: result.error || "",
                                }));
                            }}
                        />
                        {errors.mobileNo && <p className="text-red-500 text-sm mt-1">{errors.mobileNo}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block font-medium">
                            Password <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <input
                                maxLength={6}
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={() =>
                                    setFormData(prev => ({
                                        ...prev,
                                        password: prev.password?.trim()
                                    }))
                                }
                                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-1 ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"}                                `}
                                placeholder="Enter Password"
                                autoComplete="new-password"
                            />

                            {/* Eye Icon */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                tabIndex={-1}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Parking */}
                    <div>
                        <label className="block font-medium">
                            Parkings
                            {/* <span className="text-red-500">*</span> */}
                        </label>
                        <Select
                            isMulti
                            className="w-full"
                            options={lookupList?.parkingLookupList}
                            onChange={(selectedOptions) => {
                                setFormData(prev => ({
                                    ...prev,
                                    parkingIDs: selectedOptions ? selectedOptions.map((opt) => opt?.value) : []
                                }));

                                setErrors(prev => ({
                                    ...prev,
                                    parkingIDs: ""
                                }));
                            }}

                            // styles={globalSelectStyles}
                            value={
                                lookupList?.parkingLookupList?.filter(
                                    (option) => formData.parkingIDs?.includes(option?.value)
                                ) || null
                            }
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            menuShouldScrollIntoView={false}
                            closeMenuOnScroll={true}
                            maxMenuHeight={200}
                            styles={primarySelectStyles}
                        // hasError={!!errors.roleID}
                        />
                        {/* {errors.parkingIDs && (
                            <p className="text-red-500 text-sm mt-1">{errors.parkingIDs}</p>
                        )} */}
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
                actionMessage={'Staff'}
            />
        </div>
    );
};

export default AddUpdateForm;

