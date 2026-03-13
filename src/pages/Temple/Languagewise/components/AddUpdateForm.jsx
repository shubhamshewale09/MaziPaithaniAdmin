import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Select from "react-select";

import { GetAllLanguageLookUpList, GetDistrictLookupList, GetStateLookupList } from "../../../../services/List/AllLookupList";
import SuccessModal from "../../../../components/custom/SuccessModal";
import ErrorModal from "../../../../components/custom/ErrorModel";
import { AddUpdateTemple, GetTempleModel } from "../../../../services/Temple/TempleApi";
import TextEditor from "../../../../components/custom/TextEditor";
import { primarySelectStyles } from "../../../../Utils/Utils";
import LocationMapModal from "../../../../components/custom/LocationMapModal";

const AddUpdateForm = ({ onClose, modelRequestData, existingLangIDs }) => {
    const { userKeyID } = JSON.parse(localStorage.getItem('login'))
    //===================state=====================
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopupModal, setShowSuccessPopupModal] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false);
    const [lookupList, setLookupList] = useState({
        stateLookupList: [],
        districtLookupList: [],
        languageLookupList: [],
    })
    const [formData, setFormData] = useState({
        templeKeyID: null,
        templeName: null,
        deityName: null,
        stateID: null,
        districtID: null,
        templeAddress: null,
        latitude: null,
        longitude: null,
        templeDetails: null,
        templeTimings: null,
        byAir: null,
        byTrain: null,
        byRoad: null,
        templeRules: null,
        templeOpenDays: [],
    });
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
                    // roleTypeLookupList,
                    stateLookupList,
                    // districtLookupList,
                ] = await Promise.all([
                    // GetRoleTypeLookupList('ParkingAdmin'),
                    GetStateLookupList(),
                    // GetDistrictLookupList(), fetch agains selected state
                ]);
                setLookupList({
                    // roleTypeLookupList: mapToSelectOptions(
                    //     roleTypeLookupList?.responseData?.data || [],
                    //     "roleType",
                    //     "roleID"
                    // ),
                    stateLookupList: mapToSelectOptions(
                        stateLookupList?.responseData?.data || [],
                        "stateName",
                        "stateID"
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
            GetModelData(modelRequestData.KeyID, modelRequestData.appLangID);
        } else {
            setFormData({
                templeName: "",
                deityName: "",
                stateID: "",
                districtID: '',
                templeAddress: '',
                latitude: '',
                longitude: '',
                templeDetails: '',
                templeTimings: '',
                byAir: '',
                byTrain: '',
                byRoad: '',
                templeRules: '',
                templeOpenDays: [],
                templeImageURLs: []
            })
        }
    }, []);



    useEffect(() => {
        const fetchLookupData = async () => {
            try {
                const languageLookupList = await GetAllLanguageLookUpList();

                const mappedLanguages = mapToSelectOptions(
                    languageLookupList?.responseData?.data || [],
                    "languageName",
                    "appLangID"
                );

                // 🔥 Remove current language from existingLangIDs in update mode
                const cleanedExistingLangIDs =
                    modelRequestData?.Action === "Update"
                        ? existingLangIDs.filter(
                            id => id !== modelRequestData?.appLangID
                        )
                        : existingLangIDs;

                const filteredLanguages = mappedLanguages.filter(
                    lang => !cleanedExistingLangIDs.includes(lang.value)
                );

                setLookupList(prev => ({
                    ...prev,
                    languageLookupList: filteredLanguages,
                }));

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

    const handleDayChange = (day) => {
        setFormData((prev) => {
            const exists = prev.templeOpenDays.includes(day);
            return {
                ...prev,
                templeOpenDays: exists
                    ? prev.templeOpenDays.filter(d => d !== day) // remove
                    : [...prev.templeOpenDays, day],             // add
            };
        });
        setErrors(prev => ({ ...prev, templeOpenDays: "" }));
    };

    const validate = () => {
        const newErrors = {};

        //add validation at last
        // Temple Name
        if (!formData.templeName || !formData.templeName.trim()) {
            newErrors.templeName = "Temple Name is required";
        }

        // Deity Name
        if (!formData.deityName || !formData.deityName.trim()) {
            newErrors.deityName = "Deity Name is required";
        }

        // State 
        if (!formData.stateID) {
            newErrors.stateID = "State is required";
        }

        // District  
        if (!formData.districtID) {
            newErrors.districtID = "District is required";
        }

        // Latitude 
        if (!formData.latitude || !formData.latitude.trim()) {
            newErrors.latitude = "Latitude is required";
        }

        // Longitude  
        if (!formData.longitude || !formData.longitude.trim()) {
            newErrors.longitude = "Longitude is required";
        }

        //Temple Address
        if (!formData.templeAddress || !formData.templeAddress.trim()) {
            newErrors.templeAddress = "Temple Address is required";
        }
        //Temple Open Days
        if (!formData.templeOpenDays || !formData.templeOpenDays.length) {
            newErrors.templeOpenDays = "Temple Day is required";
        }

        // Temple Timing
        if (!formData.templeTimings || !formData.templeTimings.trim()) {
            newErrors.templeTimings = "Temple Timing is required";
        }

        // Temple Details 
        if (!formData.templeDetails || !formData.templeDetails.trim()) {
            newErrors.templeDetails = "Temple Details is required";
        }

        // By Air 
        if (!formData.byAir || !formData.byAir.trim()) {
            newErrors.byAir = "By Air is required";
        }

        // By Train  
        if (!formData.byTrain || !formData.byTrain.trim()) {
            newErrors.byTrain = "By Train  is required";
        }

        // By Road  
        if (!formData.byRoad || !formData.byRoad.trim()) {
            newErrors.byRoad = "By Road is required";
        }

        // Temple Rules  
        if (!formData.templeRules || !formData.templeRules.trim()) {
            newErrors.templeRules = "Temple Rules is required";
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
            const data = await AddUpdateTemple({ ...formData, userKeyID });
            if (data?.statusCode === 200) {
                setShowSuccessPopupModal(true);
            } else {
                const errorMessage = data?.response?.data?.errorMessage;
                setErrorMessage(errorMessage);
                toast.error(errorMessage)
                setIsErrorOpen(true)
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

    const GetModelData = async (KeyID, appLangID) => {
        const data = await GetTempleModel(KeyID, appLangID);
        if (data.statusCode === 200) {
            const res = await GetDistrictLookupList(data?.responseData?.data?.stateID);

            if (res) {

                const ModalData = data.responseData.data;
                setLookupList(prev => ({
                    ...prev,
                    districtLookupList: mapToSelectOptions(
                        res?.responseData?.data || [],
                        "districtName",
                        "districtID"
                    ),
                }));
                setFormData({
                    ...ModalData
                })
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl flex flex-col shadow-lg text-gray-700 text-base w-full sm:w-96 md:w-[500px] lg:w-[600px] xl:w-[700px] max-h-[90vh]">
                {/* Sticky Header */}
                <div className="bg-background px-6 py-4 border-b border-gray-200 sticky top-0 z-10 rounded-t-2xl">
                    <h2 className="text-xl font-semibold">{modelRequestData?.Action == "Update" ? "Update Temple" : "Add Temple"}</h2>
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

                    {/* Temple Name */}
                    <div>
                        <label className="block font-medium">
                            Temple Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="templeName"
                            placeholder="Enter temple name"
                            value={formData.templeName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.templeName ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.templeName && <p className="text-red-500 text-sm mt-1">{errors.templeName}</p>}
                    </div>


                    {/* Deity Name */}
                    <div>
                        <label className="block font-medium">
                            Deity Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="deityName"
                            placeholder="Enter deity name"
                            value={formData.deityName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.deityName ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"
                                }`}
                        />
                        {errors.deityName && <p className="text-red-500 text-sm mt-1">{errors.deityName}</p>}
                    </div>


                    {/* State */}
                    <div>
                        <label className="block font-medium">
                            State <span className="text-red-500">*</span>
                        </label>
                        <Select
                            //isMulti
                            className={`{w-full ${errors.stateID ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"}`}
                            options={lookupList?.stateLookupList}
                            onChange={async (selectedOptions) => {
                                setFormData(prev => ({
                                    ...prev,
                                    stateID: selectedOptions?.value
                                }));

                                setErrors(prev => ({
                                    ...prev,
                                    stateID: ""
                                }));
                                if (selectedOptions) {
                                    const res = await GetDistrictLookupList(selectedOptions.value)
                                    setLookupList({
                                        ...lookupList,
                                        districtLookupList: mapToSelectOptions(
                                            res?.responseData?.data || [],
                                            "districtName",
                                            "districtID"
                                        ),
                                    })
                                }
                            }}
                            value={lookupList?.stateLookupList?.filter((item) => item.value === formData.stateID)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            menuShouldScrollIntoView={false}
                            closeMenuOnScroll={true}
                            maxMenuHeight={200}
                            styles={primarySelectStyles}
                            hasError={!!errors.stateID}
                        />
                        {errors.stateID && (
                            <p className="text-red-500 text-sm mt-1">{errors.stateID}</p>
                        )}
                    </div>

                    {/* District */}
                    <div>
                        <label className="block font-medium">
                            District <span className="text-red-500">*</span>
                        </label>
                        <Select
                            //isMulti
                            className={`{w-full ${errors.districtID ? "border-red-500 focus:ring-red-500" : "focus:ring-secondary"}`}
                            options={lookupList?.districtLookupList}
                            onChange={(selectedOptions) => {
                                setFormData(prev => ({
                                    ...prev,
                                    districtID: selectedOptions?.value
                                }));

                                setErrors(prev => ({
                                    ...prev,
                                    districtID: ""
                                }));
                            }}
                            value={lookupList?.districtLookupList?.filter((item) => item.value === formData.districtID)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            menuShouldScrollIntoView={false}
                            closeMenuOnScroll={true}
                            maxMenuHeight={200}
                            styles={primarySelectStyles}
                            hasError={!!errors.districtID}
                        />
                        {errors.districtID && (
                            <p className="text-red-500 text-sm mt-1">{errors.districtID}</p>
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


                    {/* Address */}
                    <div>
                        <label className="block font-medium">Temple Address <span className="text-red-500">*</span></label>
                        <textarea
                            type="text"
                            name="templeAddress"
                            placeholder="Enter temple address"
                            value={formData.templeAddress}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-secondary"
                        />
                        {errors.templeAddress && (
                            <p className="text-red-500 text-sm mt-1">{errors.templeAddress}</p>
                        )}
                    </div>

                    {/* Temple Open Days */}
                    <div className="sm:col-span-2">
                        <label className="block font-medium mb-2">
                            Temple Open Days <span className="text-red-500">*</span>
                        </label>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {/* Select All */}
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-secondary-dark focus:ring-secondary"
                                    checked={formData.templeOpenDays.length === WEEK_DAYS.length}
                                    onChange={() => {
                                        if (formData.templeOpenDays.length === WEEK_DAYS.length) {
                                            setFormData(prev => ({ ...prev, templeOpenDays: [] })); // uncheck all
                                        } else {
                                            setFormData(prev => ({
                                                ...prev,
                                                templeOpenDays: WEEK_DAYS.map(d => d.value) // check all
                                            }));
                                        }
                                        setErrors(prev => ({ ...prev, templeOpenDays: "" }));
                                    }}
                                />
                                <span className="text-sm text-gray-700 font-medium">Select All</span>
                            </label>

                            {/* Individual Days */}
                            {WEEK_DAYS.map(day => (
                                <label
                                    key={day.value}
                                    className="flex items-center gap-2 cursor-pointer select-none"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.templeOpenDays.includes(day.value)}
                                        onChange={() => {
                                            const exists = formData.templeOpenDays.includes(day.value);
                                            setFormData(prev => ({
                                                ...prev,
                                                templeOpenDays: exists
                                                    ? prev.templeOpenDays.filter(d => d !== day.value)
                                                    : [...prev.templeOpenDays, day.value]
                                            }));
                                            setErrors(prev => ({ ...prev, templeOpenDays: "" }));
                                        }}
                                        className="h-4 w-4 rounded border-gray-300 text-secondary-dark focus:ring-secondary"
                                    />
                                    <span className="text-sm text-gray-700">{day.label}</span>
                                </label>
                            ))}
                        </div>

                        {errors.templeOpenDays && (
                            <p className="text-red-500 text-sm mt-1">{errors.templeOpenDays}</p>
                        )}
                    </div>



                    {/* <div className="sm:col-span-2">
                        <label className="block font-medium mb-2">
                            Temple Open Days <span className="text-red-500">*</span>
                        </label>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {WEEK_DAYS.map(day => (
                                <label
                                    key={day.value}
                                    className="flex items-center gap-2 cursor-pointer select-none"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.templeOpenDays.includes(day.value)}
                                        onChange={() => handleDayChange(day.value)}
                                        className="h-4 w-4 rounded border-gray-300 text-secondary-dark focus:ring-secondary"
                                    />
                                    <span className="text-sm text-gray-700">{day.label}</span>
                                </label>
                            ))}
                        </div>

                        {errors.templeOpenDays && (
                            <p className="text-red-500 text-sm mt-1">{errors.templeOpenDays}</p>
                        )}
                    </div> */}


                    {/* Temple Timings */}
                    <div className="sm:col-span-2">
                        <label className="block font-medium mb-2">
                            Temple Timing <span className="text-red-500">*</span>
                        </label>

                        <div className="border rounded-md overflow-hidden">
                            <TextEditor
                                editorState={formData?.templeTimings}
                                handleContentChange={(htmlContent) => {
                                    const strippedContent = htmlContent
                                        .replace(/<[^>]+>/g, "")
                                        .trim();

                                    setFormData(prev => ({
                                        ...prev,
                                        templeTimings: strippedContent === "" ? null : htmlContent,
                                    }));

                                    setErrors(prev => ({ ...prev, templeTimings: "" }));
                                }}
                            />
                        </div>

                        {errors.templeTimings && (
                            <p className="text-red-500 text-sm mt-1">{errors.templeTimings}</p>
                        )}
                    </div>

                    {/* Temple Details */}
                    <div className="sm:col-span-2">
                        <label className="block font-medium mb-2">
                            Temple Details <span className="text-red-500">*</span>
                        </label>

                        <div className="border rounded-md overflow-hidden">
                            <TextEditor
                                editorState={formData?.templeDetails}
                                handleContentChange={(htmlContent) => {
                                    const strippedContent = htmlContent
                                        .replace(/<[^>]+>/g, "")
                                        .trim();

                                    setFormData(prev => ({
                                        ...prev,
                                        templeDetails: strippedContent === "" ? null : htmlContent,
                                    }));

                                    setErrors(prev => ({ ...prev, templeDetails: "" }));
                                }}
                            />
                        </div>

                        {errors.templeDetails && (
                            <p className="text-red-500 text-sm mt-1">{errors.templeDetails}</p>
                        )}
                    </div>

                    {/* By Air  */}
                    <div className="sm:col-span-2">
                        <label className="block font-medium mb-2">
                            By Air <span className="text-red-500">*</span>
                        </label>

                        <div className="border rounded-md overflow-hidden">
                            <TextEditor
                                editorState={formData?.byAir}
                                handleContentChange={(htmlContent) => {
                                    const strippedContent = htmlContent
                                        .replace(/<[^>]+>/g, "")
                                        .trim();

                                    setFormData(prev => ({
                                        ...prev,
                                        byAir: strippedContent === "" ? null : htmlContent,
                                    }));

                                    setErrors(prev => ({ ...prev, byAir: "" }));
                                }}
                            />
                        </div>

                        {errors.byAir && (
                            <p className="text-red-500 text-sm mt-1">{errors.byAir}</p>
                        )}
                    </div>

                    {/* By Train  */}
                    <div className="sm:col-span-2">
                        <label className="block font-medium mb-2">
                            By Train <span className="text-red-500">*</span>
                        </label>

                        <div className="border rounded-md overflow-hidden">
                            <TextEditor
                                editorState={formData?.byTrain}
                                handleContentChange={(htmlContent) => {
                                    const strippedContent = htmlContent
                                        .replace(/<[^>]+>/g, "")
                                        .trim();

                                    setFormData(prev => ({
                                        ...prev,
                                        byTrain: strippedContent === "" ? null : htmlContent,
                                    }));

                                    setErrors(prev => ({ ...prev, byTrain: "" }));
                                }}
                            />
                        </div>

                        {errors.byTrain && (
                            <p className="text-red-500 text-sm mt-1">{errors.byTrain}</p>
                        )}
                    </div>

                    {/* By Road  */}
                    <div className="sm:col-span-2">
                        <label className="block font-medium mb-2">
                            By Road <span className="text-red-500">*</span>
                        </label>
                        <div className="border rounded-md overflow-hidden">
                            <TextEditor
                                editorState={formData?.byRoad}
                                handleContentChange={(htmlContent) => {
                                    const strippedContent = htmlContent
                                        .replace(/<[^>]+>/g, "")
                                        .trim();
                                    setFormData(prev => ({
                                        ...prev,
                                        byRoad: strippedContent === "" ? null : htmlContent,
                                    }));
                                    setErrors(prev => ({ ...prev, byRoad: "" }));
                                }}
                            />
                        </div>

                        {errors.byRoad && (
                            <p className="text-red-500 text-sm mt-1">{errors.byRoad}</p>
                        )}
                    </div>

                    {/* Temple Rules */}
                    <div className="sm:col-span-2">
                        <label className="block font-medium mb-2">
                            Temple Rules <span className="text-red-500">*</span>
                        </label>
                        <div className="border rounded-md overflow-hidden">
                            <TextEditor
                                editorState={formData?.templeRules}
                                handleContentChange={(htmlContent) => {
                                    const strippedContent = htmlContent
                                        .replace(/<[^>]+>/g, "")
                                        .trim();
                                    setFormData(prev => ({
                                        ...prev,
                                        templeRules: strippedContent === "" ? null : htmlContent,
                                    }));
                                    setErrors(prev => ({ ...prev, templeRules: "" }));
                                }}
                            />
                        </div>

                        {errors.templeRules && (
                            <p className="text-red-500 text-sm mt-1">{errors.templeRules}</p>
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
                actionMessage={'Temple'}
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
                        // address: loc.address || prev.address,
                    }));
                }}
            />

        </div>
    );
};
const WEEK_DAYS = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
];
export default AddUpdateForm;

