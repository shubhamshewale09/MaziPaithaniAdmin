import { useState, useEffect } from "react";
import 'react-date-picker/dist/DatePicker.css';
import Select from "react-select";

import SuccessModal from "../../../../components/custom/SuccessModal";
import { AddUpdateState, GetStateModel } from "../../../../services/State/StateApi";
import ErrorModal from "../../../../components/custom/ErrorModel";
import { allowOnlyText, primarySelectStyles, trimOnBlur } from "../../../../Utils/Utils";
import { GetAllLanguageLookUpList } from "../../../../services/List/AllLookupList";


const AddUpdateForm = ({ onClose, modelRequestData, existingLangIDs }) => {
    const { userKeyID } = JSON.parse(localStorage.getItem('login'))

    //===================state=====================
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [showSuccessPopupModal, setShowSuccessPopupModal] = useState(false);
    const [formData, setFormData] = useState({
        stateKeyID: null,
        stateName: null,
    });
    const [lookupList, setLookupList] = useState({
        languageLookupList: []
    })
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [errors, setErrors] = useState({});
    //========================useEffect==========================

    useEffect(() => {
        if (modelRequestData.Action === "Update" && modelRequestData.KeyID) {
            GetModelData(modelRequestData.KeyID, modelRequestData.appLangID);
        } else {
            setFormData({
                stateKeyID: null,
                stateName: "",
            })
        }
    }, []);

    useEffect(() => {
        const fetchLookupData = async () => {
            try {
                const [
                    // areaRes,
                    // alertTypeRes,
                    languageRes
                ] = await Promise.all([
                    // GetAreaLookupList(),
                    // GetAllAlertTypeLookup(),
                    GetAllLanguageLookUpList()
                ]);

                // Map Area
                // const mappedAreas = mapToSelectOptions(
                //     areaRes?.responseData?.data || [],
                //     "areaName",
                //     "areaID"
                // );

                // // Map Alert Types
                // const mappedAlertTypes = mapToSelectOptions(
                //     alertTypeRes?.responseData?.data || [],
                //     "alertType",
                //     "alertTypeID"
                // );

                // Map Languages
                const mappedLanguages = mapToSelectOptions(
                    languageRes?.responseData?.data || [],
                    "languageName",
                    "appLangID"
                );

                //   Remove existing languages in update mode
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
                    // areaLookupList: mappedAreas,
                    // alertLookupList: mappedAlertTypes,
                    lookupList: filteredLanguages
                });

            } catch (error) {
                console.log("Lookup fetch error:", error);
            }
        };

        fetchLookupData();
    }, [existingLangIDs, modelRequestData]);
    //==========================functions=============
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const mapToSelectOptions = (list = [], labelKey, valueKey) => {
        return list.map(item => ({
            label: item[labelKey],
            value: item[valueKey],
        }));
    };

    const validate = () => {
        const newErrors = {};
        // State Name
        if (!formData.stateName || !formData.stateName.trim()) {
            newErrors.stateName = "State Name is required";
        }

        //language id
        if (!formData.appLangID) {
            newErrors.appLangID = "Language is required";
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
            const data = await AddUpdateState({ ...formData, userKeyID });
            if (data?.statusCode === 200) {
                setShowSuccessPopupModal(true);
            } else {
                setIsErrorOpen(true)
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
        const data = await GetStateModel(KeyID, appLangID);
        if (data.statusCode === 200) {
            const ModalData = data.responseData.data;
            setFormData({
                ...ModalData,
            })
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl flex flex-col shadow-lg text-gray-700 text-base w-full sm:w-80 md:w-96 lg:w-96 xl:w-96 max-h-[90vh]">

                {/* Sticky Header */}
                <div className="bg-background px-6 py-4 border-b border-gray-200 sticky top-0 z-10 rounded-t-2xl">
                    <h2 className="text-xl font-semibold">{modelRequestData?.Action == "Update" ? "Update State" : "Add State"}</h2>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto px-6 py-4 grid grid-cols-1 gap-4"
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
                    {/* State Name */}
                    <div>
                        <label className="block font-medium">
                            State Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="stateName"
                            placeholder="Enter state name"
                            value={formData.stateName}
                            onChange={(e) => {
                                const cleanedValue = allowOnlyText(e.target.value);
                                setFormData({ ...formData, stateName: cleanedValue });
                            }}
                            onBlur={(e) => {
                                const trimmedValue = trimOnBlur(e.target.value);
                                setFormData({ ...formData, stateName: trimmedValue });
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.stateName ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.stateName && <p className="text-red-500 text-sm mt-1">{errors.stateName}</p>}
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
                actionMessage={'State'}
            />
            {/* error modal  */}
            <ErrorModal
                isOpen={isErrorOpen}
                onClose={() => setIsErrorOpen(false)}
                errorMessage={errorMessage}
            />

        </div>
    );
};

export default AddUpdateForm;