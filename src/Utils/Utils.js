import { showGlobalError, showGlobalSuccess } from "./feedbackModal";
//default values
export const pageSize = 10;
export const pagesArray = [10, 15, 20, 40];
export const MIN_LOADING_TIME = 400;

//default value arrays
export const CalenderFilter = [
  // {
  //   value: 0,
  //   label: "All",
  // },
  {
    value: 1,
    label: "This Week",
  },
  {
    value: 2,
    label: "Last Week",
  },
  {
    value: 3,
    label: "This Month",
  },
  {
    value: 4,
    label: "Last Month",
  },
  {
    value: 5,
    label: "This Quarter",
  },
  {
    value: 6,
    label: "Last Quarter",
  },
  {
    value: 7,
    label: "This 6 Months",
  },
  {
    value: 8,
    label: "Last 6 Months",
  },
  {
    value: 9,
    label: "This Year",
  },
  {
    value: 10,
    label: "Last Year",
  },
  {
    value: 11,
    label: "Custom Date Range",
  },
  {
    value: 12,
    label: "Todays",
  },
];

export const CalenderFilterEnum = {
  All: 0,
  This_Week: 1,
  Last_Week: 2,
  This_Month: 3,
  Last_Month: 4,
  This_Quarter: 5,
  Last_Quarter: 6,
  This_6_Months: 7,
  Last_6_Months: 8,
  This_Year: 9,
  Last_Year: 10,
  Custom_Date_Range: 11,
  Todays: 12, // <-- Add this new value
};

export const statusOptions = [
  { label: "Approved", value: true },
  { label: "Rejected", value: false },
];

//=================functions==================
export const showApiError = (errorOrRes) => {
  showGlobalError(errorOrRes, "Something went wrong. Please try again.");
};

export const showApiSuccess = (successOrRes) => {
  showGlobalSuccess(successOrRes, "Action completed successfully.");
};

//10 digits value using eplise
// export const handlePhoneNumberInput = (value) => {
//   // Remove non-numeric characters
//   const cleanedValue = value.replace(/\D/g, "");

//   // Limit to 10 digits
//   return cleanedValue.slice(0, 10);
// };
export const handlePhoneNumberInput = (value) => {
  const cleanedValue = value.replace(/\D/g, ""); // remove non-numeric

  if (cleanedValue.length > 0) {
    const firstDigit = cleanedValue.charAt(0);
    if (!["6", "7", "8", "9"].includes(firstDigit)) {
      return {
        value: cleanedValue.slice(0, 10),
        error: "Mobile number must start with 6, 7, 8, or 9",
      };
    }
  }

  return { value: cleanedValue.slice(0, 10), error: "" };
};

//truncate html value using eplise
export const truncateHtml = (htmlString, maxLength = 20) => {
  // Create a temporary DOM element to extract text content
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  const textContent = tempDiv.textContent || tempDiv.innerText || "";

  // Truncate and add ellipsis
  const truncated =
    textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent;

  return truncated;
};
//truncate value using eplise
export const truncateText = (text = "", maxLength = 20) => {
  if (!text) return "";

  return text.length > maxLength
    ? text.slice(0, maxLength).trim() + "..."
    : text;
};

//prevent white space and numbers value
export const allowOnlyText = (value) => {
  return value
    .replace(/[^a-zA-Z\s]/g, "") // remove numbers & special chars
    .replace(/\s{2,}/g, " ") // collapse multiple spaces
    .replace(/^\s+/g, "") // trim start space
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

//remove white space start and end
export const trimOnBlur = (value) => {
  return value.trim();
};

//email validation regex
export const isValidEmail = (email = "") => {
  const hasSpace = /\s/.test(email); // true if any space exists

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return {
    value: email, // <-- keep exactly what user typed
    hasSpace, // <-- new flag
    isValid: !hasSpace && emailRegex.test(email),
  };
};

//nuemric field for number and amount fields
export const handleNumericInput = (value, maxLength = 7) => {
  // Remove anything that is not a digit
  const onlyNumbers = value.replace(/\D/g, "");

  // Limit to max length
  return onlyNumbers.slice(0, maxLength);
};

//select field css
export const primarySelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    borderRadius: "0.375rem",
    borderColor: state.selectProps.hasError
      ? "#ef4444" // red if error
      : state.isFocused
      ? "#721111" // green on focus
      : "#d1d5db", // standard gray border

    boxShadow: state.isFocused ? "0 0 0 1px #721111" : "none",
    backgroundColor: "white",

    "&:hover": {
      borderColor: "#721111", // darker gray on hover
    },

    opacity: state.isDisabled ? 1 : undefined,
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "0.375rem",
    overflow: "hidden",
    marginTop: "4px",
  }),

  menuList: (base) => ({
    ...base,
    padding: 0,
    borderRadius: "0.375rem",
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#721111"
      : state.isFocused
      ? "#8f2a2a"
      : "white",

    color: state.isSelected || state.isFocused ? "white" : "#111827",
    cursor: "pointer",
    transition: "background-color 0.2s ease",

    marginBottom: "2px",

    "&:last-child": {
      marginBottom: 0,
    },
  }),

  singleValue: (base) => ({
    ...base,
    color: "#111827", // standard text
  }),

  placeholder: (base) => ({
    ...base,
    color: "#9ca3af", // standard placeholder gray
  }),

  input: (base) => ({
    ...base,
    color: "#111827",
    backgroundColor: "transparent",
    boxShadow: "none",
  }),
};
