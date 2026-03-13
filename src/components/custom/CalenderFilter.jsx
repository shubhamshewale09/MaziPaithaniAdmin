import React, { useState, useEffect } from "react";
import Select from "react-select";
import dayjs from "dayjs";

// import { globalSelectStyles } from "../../middleware/enum";
import { CalenderFilter, CalenderFilterEnum, primarySelectStyles } from "../../Utils/Utils";

const CalendarFilter = ({
  mt,
  onDateChange,
  toDate,
  setToDate,
  fromDate,
  setFromDate,
  defaultSelectedOption, // ✅ Add this prop
  hideAllOption = false, // ✅ add this
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (defaultSelectedOption && !selectedOption) {
      setSelectedOption(defaultSelectedOption);
      handleCalenderFilterChange(defaultSelectedOption);
    }
  }, [defaultSelectedOption, selectedOption]);

  useEffect(() => {
    const defaultOption = CalenderFilter.find(
      (option) => option.value === CalenderFilterEnum.This_Week
    );
    setSelectedOption(defaultOption);
  }, []);

  const handleCalenderFilterChange = async (selectedOption) => {
    setSelectedOption(selectedOption);
    setToDate(null);
    setFromDate(null);
    setShowDatePicker(false);

    let startDate;
    let endDate;

    switch (selectedOption.value) {
      case CalenderFilterEnum.All:
        startDate = null;
        endDate = null;
        break;
      case CalenderFilterEnum.This_Week:
        startDate = dayjs().startOf("week");
        endDate = dayjs().endOf("week");
        break;
      case CalenderFilterEnum.Last_Week:
        startDate = dayjs().subtract(1, "week").startOf("week");
        endDate = dayjs().subtract(1, "week").endOf("week");
        break;
      case CalenderFilterEnum.This_Month:
        startDate = dayjs().startOf("month");
        endDate = dayjs().endOf("month");
        break;
      case CalenderFilterEnum.Last_Month:
        startDate = dayjs().subtract(1, "month").startOf("month");
        endDate = dayjs().subtract(1, "month").endOf("month");
        break;
      case CalenderFilterEnum.This_Quarter:
        startDate = dayjs().startOf("quarter");
        endDate = dayjs().endOf("quarter");
        break;
      case CalenderFilterEnum.Last_Quarter:
        startDate = dayjs().subtract(1, "quarter").startOf("quarter");
        endDate = dayjs().subtract(1, "quarter").endOf("quarter");
        break;
      case CalenderFilterEnum.This_6_Months:
        startDate = dayjs().subtract(5, "months").startOf("month");
        endDate = dayjs().endOf("month");
        break;
      case CalenderFilterEnum.Last_6_Months:
        startDate = dayjs().subtract(11, "months").startOf("month");
        endDate = dayjs().subtract(6, "months").endOf("month");
        break;
      case CalenderFilterEnum.This_Year:
        startDate = dayjs().startOf("year");
        endDate = dayjs().endOf("year");
        break;
      case CalenderFilterEnum.Last_Year:
        startDate = dayjs().subtract(1, "year").startOf("year");
        endDate = dayjs().subtract(1, "year").endOf("year");
        break;
      case CalenderFilterEnum.Todays: // Handle today's filter
        startDate = dayjs().startOf("day");
        endDate = dayjs().endOf("day");
        break;
      case CalenderFilterEnum.Custom_Date_Range:
        setShowDatePicker(true);
        return;
      default:
        return;
    }

    const formattedStartDate = startDate
      ? dayjs(startDate).format("YYYY-MM-DD")
      : null;
    const formattedEndDate = endDate
      ? dayjs(endDate).format("YYYY-MM-DD")
      : null;

    setFromDate(formattedStartDate);
    setToDate(formattedEndDate);

    onDateChange(formattedStartDate, formattedEndDate);
  };

  const handleFromDateChange = (value) => {
    setFromDate(value);
    onDateChange(value, toDate);
  };

  const handleToDateChange = (value) => {
    setToDate(value);
    onDateChange(fromDate, value); // Pass the updated toDate
  };

  const clearDate = () => {
    setFromDate(null);
    setToDate(null);
    onDateChange(null, null);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full" style={{ marginTop: mt ? '30px' : null }}>
      {/* Calendar Filter Select */}
      <div className="relative min-w-[140px]  text-12  w-full md:w-[200px]">
        <Select
          className="text-12"
          options={
            hideAllOption
              ? CalenderFilter?.filter(
                (option) => option.value !== CalenderFilterEnum.All
              )
              : CalenderFilter
          }
          // menuPortalTarget={document.body}
          // styles={globalSelectStyles}
          onChange={handleCalenderFilterChange}
          value={selectedOption}
          placeholder="Select Filter"
          menuPortalTarget={document.body}
          menuPosition="fixed"
          menuShouldScrollIntoView={false}
          closeMenuOnScroll={true}
          maxMenuHeight={200}
          styles={primarySelectStyles}
        />
      </div>

      {showDatePicker && (
        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
          <input
            type="date"
            placeholder="Select From Date"
            className="w-full md:w-48 text-12 border rounded-md px-2 py-2 focus:ring-2 focus:ring-blue-500"
            value={fromDate || ""}
            onChange={(e) => handleFromDateChange(e.target.value)}
          />

          <input
            type="date"
            placeholder="Select To Date"
            className="w-full md:w-48 text-12 border rounded-md px-2 py-2 focus:ring-2 focus:ring-blue-500"
            value={toDate || ""}
            onChange={(e) => handleToDateChange(e.target.value)}
          />

          {(fromDate || toDate) && (
            <button
              type="button"
              onClick={clearDate}
              className="w-full md:w-auto bg-[#E86B1B] text-white rounded-md px-4 py-2 text-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarFilter;
