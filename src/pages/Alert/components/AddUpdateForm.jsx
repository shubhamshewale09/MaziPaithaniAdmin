import { useState, useEffect } from "react";
import 'react-date-picker/dist/DatePicker.css';
import Select from "react-select";

import SuccessModal from "../../../components/custom/SuccessModal";
import { GetAllAlertTypeLookup, GetAreaLookupList } from "../../../services/List/AllLookupList";
import { AddUpdateAlert, GetAlertModel } from "../../../services/Alert/AlertApi";
import ErrorModal from "../../../components/custom/ErrorModel";
import { primarySelectStyles } from "../../../Utils/Utils";
import { Tooltip } from "@mui/material";
import AddUpdateAreaForm from "../../Area/components/AddUpdateForm";

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
        alertKeyID: null,
        areaID: null,
        alertMessage: null,
        alertTypeID: null,
    });
    const [errors, setErrors] = useState({});
    //========================useEffect==========================

    useEffect(() => {
        const fetchLookupData = async () => {
            try {
                const [
                    areaLookupList,
                    alertLookupList
                ] = await Promise.all([
                    GetAreaLookupList(),
                    GetAllAlertTypeLookup()
                ]);
                setLookupList({
                    areaLookupList: mapToSelectOptions(
                        areaLookupList?.responseData?.data || [],
                        "areaName",
                        "areaID"
                    ),
                    alertLookupList: mapToSelectOptions(
                        alertLookupList?.responseData?.data || [],
                        "alertType",
                        "alertTypeID"
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
                alertKeyID: null,
                areaID: null,
                alertMessage: null,
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
        if (!formData.alertMessage || !formData.alertMessage.trim()) {
            newErrors.alertMessage = "Alert is required";
        }

        // area 
        if (!formData.areaID) {
            newErrors.areaID = "Area is required";
        }

        // alert 
        if (!formData.alertTypeID) {
            newErrors.alertTypeID = "Alert type is required";
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            setIsSubmitting(true);
            const data = await AddUpdateAlert({ ...formData, userKeyID });
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
        const data = await GetAlertModel(KeyID);
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
                <div className="flex justify-between bg-background px-6 py-4 border-b border-gray-200 sticky top-0 z-10 rounded-t-2xl">
                    <h2 className="text-xl font-semibold">{modelRequestData?.Action == "Update" ? "Update Alert" : "Add Alert"}</h2>
                </div>
                {/* <div className="pt-2 pb-2 flex justify-end">
                    <Tooltip title="Add Area">
                        <button
                            onClick={openAddModal}
                            type="button"
                            className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition text-sm"
                        >
                            Add Area
                        </button>
                    </Tooltip>
                </div> */}


                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto px-6 py-4 grid grid-cols-1 gap-4"
                >

                    {/* Area */}
                    <div>
                        <label className="flex justify-between items-center font-medium">
                            <span>
                                Area <span className="text-red-500">*</span>
                            </span>

                            <span
                                onClick={openAddModal}
                                className="text-primary text-sm cursor-pointer"
                            >
                                + Add Area
                            </span>
                        </label>

                        <Select
                            //isMulti
                            className={`{w-full ${errors.areaID ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"}`}
                            options={lookupList?.areaLookupList}
                            onChange={(selectedOptions) => {
                                setFormData(prev => ({
                                    ...prev,
                                    areaID: selectedOptions?.value
                                }));

                                setErrors(prev => ({
                                    ...prev,
                                    areaID: ""
                                }));
                            }}

                            // styles={globalSelectStyles}
                            value={lookupList?.areaLookupList?.filter((item) => item.value === formData.areaID)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            menuShouldScrollIntoView={false}
                            closeMenuOnScroll={true}
                            maxMenuHeight={200}
                            styles={primarySelectStyles}
                            hasError={!!errors.areaID}
                        />
                        {errors.areaID && (
                            <p className="text-red-500 text-sm mt-1">{errors.areaID}</p>
                        )}

                    </div>

                    {/* Alert Type */}
                    <div>
                        <label className="block font-medium">
                            Alert Type <span className="text-red-500">*</span>
                        </label>
                        <Select
                            className="w-full"
                            options={lookupList?.alertLookupList}
                            onChange={(val) => {
                                setFormData(prev => ({
                                    ...prev,
                                    alertTypeID: val?.value || null,
                                }));

                                setErrors(prev => ({
                                    ...prev,
                                    alertTypeID: ""
                                }));
                            }}
                            value={
                                lookupList?.alertLookupList?.find(
                                    (option) => option.value === formData.alertTypeID
                                ) || null
                            }
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            menuShouldScrollIntoView={false}
                            closeMenuOnScroll={true}
                            maxMenuHeight={200}
                            styles={primarySelectStyles}
                            hasError={!!errors.alertTypeID}
                        />
                        {errors.alertTypeID && (
                            <p className="text-red-500 text-sm mt-1">{errors.alertTypeID}</p>
                        )}
                    </div>

                    {/* Alert Message */}
                    <div>
                        <label className="block font-medium">
                            Alert Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            type="text"
                            name="alertMessage"
                            placeholder="Enter message"
                            value={formData.alertMessage}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.alertMessage ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"}`}
                        />
                        {errors.alertMessage && <p className="text-red-500 text-sm mt-1">{errors.alertMessage}</p>}
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
                actionMessage={'Alert'}
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
