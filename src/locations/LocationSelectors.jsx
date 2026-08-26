import React, { useState } from "react";
import Select from "react-select";
import useLocations from "./useLocations";

const LocationSelector = ({
  onLocationChange,
  onCountyChange,
  onConstituencyChange,
  onWardChange,
  className = "",
  showWards = true,
  defaults = { county: "", constituency: "", ward: "" },
}) => {
  // Internal state
  const [selectedCounty, setSelectedCounty] = useState(defaults.county || "");
  const [selectedConstituency, setSelectedConstituency] = useState(
    defaults.constituency || ""
  );
  const [selectedWard, setSelectedWard] = useState(defaults.ward || "");

  const {
    counties,
    constituencies,
    wards,
    getConstituenciesByCounty,
    getWardsByConstituency,
  } = useLocations();

  // Helper function to notify parent
  const notifyParent = (county, constituency, ward) => {
    const values = { county, constituency, ward };

    // Call callbacks only if they exist
    onLocationChange?.(values);
    onCountyChange?.(county);
    onConstituencyChange?.(constituency);
    onWardChange?.(ward);
  };

  // Get filtered data based on selections
  const availableConstituencies = selectedCounty
    ? getConstituenciesByCounty(selectedCounty)
    : [];

  const availableWards = selectedConstituency
    ? getWardsByConstituency(selectedConstituency)
    : [];

  // Transform data for react-select format
  const countyOptions = counties.map((county) => ({
    label: county.name,
    value: county.name,
  }));

  const constituencyOptions = availableConstituencies.map((constituency) => ({
    label: constituency.name,
    value: constituency.name,
  }));

  const wardOptions = availableWards.map((ward) => ({
    label: ward.name,
    value: ward.name,
  }));

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#FE7A36" : "#cdc7ecea",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(254, 122, 54, 0.1)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#FE7A36" : "#cdc7ecea",
      },
      minHeight: "48px",
      fontSize: "14px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#FE7A36"
        : state.isFocused
        ? "rgba(254, 122, 54, 0.1)"
        : "white",
      color: state.isSelected ? "white" : "#343a40",
      "&:hover": {
        backgroundColor: state.isSelected
          ? "#FE7A36"
          : "rgba(254, 122, 54, 0.1)",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#6b7280",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#343a40",
    }),
  };

  const handleCountyChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setSelectedCounty(value);
    setSelectedConstituency(""); // Reset
    setSelectedWard(""); // Reset

    // Notify parent immediately with new values
    notifyParent(value, "", "");
  };

  const handleConstituencyChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setSelectedConstituency(value);
    setSelectedWard(""); // Reset ward

    // Notify parent immediately with new values
    notifyParent(selectedCounty, value, "");
  };

  const handleWardChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setSelectedWard(value);

    // Notify parent immediately with new values
    notifyParent(selectedCounty, selectedConstituency, value);
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedCounty("");
    setSelectedConstituency("");
    setSelectedWard("");

    // Notify parent of cleared state
    notifyParent("", "", "");
  };

  // Get current selected options for react-select
  const selectedCountyOption =
    countyOptions.find((option) => option.value === selectedCounty) || null;
  const selectedConstituencyOption =
    constituencyOptions.find(
      (option) => option.value === selectedConstituency
    ) || null;
  const selectedWardOption =
    wardOptions.find((option) => option.value === selectedWard) || null;

  return (
    <div className={`bg-white rounded-xl  ${className}`}>
      <div className="p-3">
        <div
          className={` ${
            showWards
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 "
              : "grid grid-cols-1 md:grid-cols-2"
          }  gap-6`}
        >
          {/* County Selector */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-2">
              County
            </label>
            <Select
              value={selectedCountyOption}
              onChange={handleCountyChange}
              options={countyOptions}
              styles={customStyles}
              placeholder="Search and select county..."
              isClearable
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Constituency Selector */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-2">
              Constituency
            </label>
            <Select
              value={selectedConstituencyOption}
              onChange={handleConstituencyChange}
              options={constituencyOptions}
              styles={customStyles}
              placeholder={
                selectedCounty
                  ? "Search and select constituency..."
                  : "Select county first"
              }
              isClearable
              isSearchable
              isDisabled={!selectedCounty}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Ward Selector */}
          {showWards && (
            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Ward
              </label>
              <Select
                value={selectedWardOption}
                onChange={handleWardChange}
                options={wardOptions}
                styles={customStyles}
                placeholder={
                  selectedConstituency
                    ? "Search and select ward..."
                    : "Select constituency first"
                }
                isClearable
                isSearchable
                isDisabled={!selectedConstituency}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          )}
        </div>

        {/* Built-in clear button */}
        {/* {(selectedCounty || selectedConstituency || selectedWard) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              Clear Locations
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default LocationSelector;
