import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import {
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaDollarSign,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "./api/axios";
import logo from "./assets/graphics/l3.jpeg";

const INDUSTRIES = [
  { value: "salon", label: "Salon & Beauty" },
  { value: "spa", label: "Spa & Wellness" },
  { value: "barbershop", label: "Barbershop" },
  { value: "fitness", label: "Fitness & Gym" },
  { value: "healthcare", label: "Healthcare" },
  { value: "dental", label: "Dental Clinic" },
  { value: "retail", label: "Retail Store" },
  { value: "restaurant", label: "Restaurant & Cafe" },
  { value: "automotive", label: "Automotive Services" },
  { value: "consulting", label: "Consulting" },
  { value: "education", label: "Education & Training" },
  { value: "pet_services", label: "Pet Services" },
  { value: "home_services", label: "Home Services" },
  { value: "other", label: "Other" },
];

const CURRENCIES = [
  { value: "KES", label: "KES - Kenyan Shilling" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "ZAR", label: "ZAR - South African Rand" },
  { value: "NGN", label: "NGN - Nigerian Naira" },
  { value: "GHS", label: "GHS - Ghanaian Cedi" },
  { value: "TZS", label: "TZS - Tanzanian Shilling" },
  { value: "UGX", label: "UGX - Ugandan Shilling" },
];

const BUSINESS_TYPES = [
  { value: "services", label: "Services" },
  { value: "retail", label: "Retail" },
  { value: "both", label: "Both Services & Retail" },
];

// Default pricing types suggestions
const SUGGESTED_PRICING = [
  "Retail Price",
  "Wholesale Price",
  "VIP Price",
  "Member Price",
  "Walk-in Price",
  "Online Price",
];

function RegisterBusiness() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pricingTypes, setPricingTypes] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const steps = [
    { number: 1, title: "Business Info", icon: FaBuilding },
    { number: 2, title: "Admin User", icon: FaUser },
    { number: 3, title: "Pricing Types", icon: FaDollarSign },
    { number: 4, title: "Location", icon: FaMapMarkerAlt },
    { number: 5, title: "Review", icon: FaCheck },
  ];

  const registerBusinessMutation = useMutation({
    mutationFn: (data) => axios.post("/auth/register-business", data),
    onSuccess: (response) => {
      setIsSuccess(true);
      toast.success("Business registered successfully!");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    },
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) || "Invalid email format";
  };

  // Pricing Types Functions
  const addPricingType = (name = "") => {
    setPricingTypes([...pricingTypes, { name }]);
  };

  const removePricingType = (index) => {
    setPricingTypes(pricingTypes.filter((_, i) => i !== index));
  };

  const updatePricingType = (index, value) => {
    const updated = [...pricingTypes];
    updated[index].name = value;
    setPricingTypes(updated);
  };

  const addSuggestedPricing = (name) => {
    if (!pricingTypes.find((p) => p.name === name)) {
      setPricingTypes([...pricingTypes, { name }]);
    }
  };

  const onStepSubmit = (data) => {
    setFormData({ ...formData, ...data });

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Final submission
      const finalData = {
        ...formData,
        ...data,
        pricing: pricingTypes
          .filter((p) => p.name && p.name.trim() !== "")
          .map((p) => p.name),
      };
      registerBusinessMutation.mutate(finalData);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const skipLocation = () => {
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const skipPricing = () => {
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-xl border-2 border-primary/10 p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-4xl text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-8">
            Your business has been registered successfully. You can now login to
            access your dashboard.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg "
          >
            <span>Go to Login</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8 text-center">
          <img
            src={logo}
            alt="RyzonPlus"
            className="h-[45px] rounded-md shadow-md shadow-gold w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create Your Business Account
          </h1>
          <p className="text-gray-600 mt-2">
            Get started with your 14-days free trial
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2  ${
                      currentStep >= step.number
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    <step.icon className="text-base sm:text-lg" />
                  </div>
                  <span
                    className={`text-xs sm:text-sm mt-2 font-medium hidden sm:block ${
                      currentStep >= step.number
                        ? "text-primary"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      currentStep > step.number ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit(onStepSubmit)}>
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Business Information
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    {...register("businessName", {
                      required: "Business name is required",
                    })}
                    defaultValue={formData.businessName}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                    placeholder="My Beauty Salon"
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      {...register("businessEmail", {
                        required: "Business email is required",
                        validate: validateEmail,
                      })}
                      defaultValue={formData.businessEmail}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                      placeholder="info@business.com"
                    />
                    {errors.businessEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.businessEmail.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Business Phone
                    </label>
                    <input
                      type="tel"
                      {...register("businessPhone")}
                      defaultValue={formData.businessPhone}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Business Type
                    </label>
                    <Select
                      options={BUSINESS_TYPES}
                      defaultValue={BUSINESS_TYPES.find(
                        (t) => t.value === formData.businessType
                      )}
                      onChange={(option) =>
                        setValue("businessType", option.value)
                      }
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select business type"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Industry
                    </label>
                    <Select
                      options={INDUSTRIES}
                      defaultValue={INDUSTRIES.find(
                        (i) => i.value === formData.industry
                      )}
                      onChange={(option) => setValue("industry", option.value)}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Search or select industry"
                      isSearchable
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    {...register("address.street")}
                    defaultValue={formData.address?.street}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      {...register("address.city")}
                      defaultValue={formData.address?.city}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                      placeholder="Nairobi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      State/County
                    </label>
                    <input
                      type="text"
                      {...register("address.state")}
                      defaultValue={formData.address?.state}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                      placeholder="Nairobi County"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Zip/Postal Code
                    </label>
                    <input
                      type="text"
                      {...register("address.zipCode")}
                      defaultValue={formData.address?.zipCode}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                      placeholder="00100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      {...register("address.country")}
                      defaultValue={formData.address?.country}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                      placeholder="Kenya"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Currency
                    </label>
                    <Select
                      options={CURRENCIES}
                      defaultValue={CURRENCIES.find(
                        (c) => c.value === formData.currency
                      )}
                      onChange={(option) => setValue("currency", option.value)}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select currency"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("taxRate")}
                      defaultValue={formData.taxRate}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                      placeholder="16"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Admin User Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Admin User Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      {...register("adminFirstName", {
                        required: "First name is required",
                      })}
                      defaultValue={formData.adminFirstName}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                      placeholder="John"
                    />
                    {errors.adminFirstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.adminFirstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      {...register("adminLastName", {
                        required: "Last name is required",
                      })}
                      defaultValue={formData.adminLastName}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                      placeholder="Doe"
                    />
                    {errors.adminLastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.adminLastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register("adminEmail", {
                      required: "Email is required",
                      validate: validateEmail,
                    })}
                    defaultValue={formData.adminEmail}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                    placeholder="john@business.com"
                  />
                  {errors.adminEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.adminEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("adminPhone")}
                    defaultValue={formData.adminPhone}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                    placeholder="+1234567891"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("adminPassword", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      defaultValue={formData.adminPassword}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                      placeholder="Enter secure password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.adminPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.adminPassword.message}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Minimum 6 characters
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Pricing Types (Optional) */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Standard Pricing Types (Optional)
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Define pricing categories for your products (e.g., Retail,
                      Wholesale, VIP)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={skipPricing}
                    className="text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    Skip this step
                  </button>
                </div>

                {/* Suggested Pricing Types */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-3">
                    Quick Add - Common Pricing Types:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_PRICING.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => addSuggestedPricing(name)}
                        className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors"
                        disabled={pricingTypes.find((p) => p.name === name)}
                      >
                        <FaPlus className="inline mr-1 text-xs" />
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Pricing Types */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-900">
                      Your Pricing Types
                    </label>
                    <button
                      type="button"
                      onClick={() => addPricingType()}
                      className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      <FaPlus className="h-3 w-3" />
                      Add Custom Type
                    </button>
                  </div>

                  {pricingTypes.length > 0 ? (
                    <div className="space-y-3">
                      {pricingTypes.map((pricing, index) => (
                        <div
                          key={index}
                          className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex-1">
                            <input
                              type="text"
                              value={pricing.name}
                              onChange={(e) =>
                                updatePricingType(index, e.target.value)
                              }
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                              placeholder="e.g., Wholesale Price, VIP Price"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removePricingType(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <FaDollarSign className="text-4xl text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm mb-2">
                        No pricing types added yet
                      </p>
                      <p className="text-gray-500 text-xs">
                        Use quick add buttons above or add custom types
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> These pricing types will be available
                    when adding products. You can always add or modify them
                    later in settings.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Location (Optional) */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Initial Location (Optional)
                  </h2>
                  <button
                    type="button"
                    onClick={skipLocation}
                    className="text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    Skip this step
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Location Name
                  </label>
                  <input
                    type="text"
                    {...register("locationName")}
                    defaultValue={formData.locationName}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                    placeholder="Main Branch"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Location Address
                  </label>
                  <input
                    type="text"
                    {...register("locationAddress")}
                    defaultValue={formData.locationAddress}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Location Phone
                  </label>
                  <input
                    type="tel"
                    {...register("locationPhone")}
                    defaultValue={formData.locationPhone}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary "
                    placeholder="+1234567890"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Review Your Information
                </h2>

                <div className="space-y-6">
                  {/* Business Info */}
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900">
                        Business Information
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Business Name:</span>{" "}
                        {formData.businessName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {formData.businessEmail}
                      </p>
                      {formData.businessPhone && (
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {formData.businessPhone}
                        </p>
                      )}
                      {formData.businessType && (
                        <p>
                          <span className="font-medium">Type:</span>{" "}
                          {
                            BUSINESS_TYPES.find(
                              (t) => t.value === formData.businessType
                            )?.label
                          }
                        </p>
                      )}
                      {formData.industry && (
                        <p>
                          <span className="font-medium">Industry:</span>{" "}
                          {
                            INDUSTRIES.find(
                              (i) => i.value === formData.industry
                            )?.label
                          }
                        </p>
                      )}
                      {formData.currency && (
                        <p>
                          <span className="font-medium">Currency:</span>{" "}
                          {formData.currency}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Admin Info */}
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900">
                        Admin User
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {formData.adminFirstName} {formData.adminLastName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {formData.adminEmail}
                      </p>
                      {formData.adminPhone && (
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {formData.adminPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing Types Info */}
                  {pricingTypes.length > 0 && (
                    <div className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">
                          Pricing Types
                        </h3>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pricingTypes
                          .filter((p) => p.name && p.name.trim() !== "")
                          .map((pricing, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                            >
                              {pricing.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Location Info */}
                  {formData.locationName && (
                    <div className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">
                          Initial Location
                        </h3>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(4)}
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Location:</span>{" "}
                          {formData.locationName}
                        </p>
                        {formData.locationAddress && (
                          <p>
                            <span className="font-medium">Address:</span>{" "}
                            {formData.locationAddress}
                          </p>
                        )}
                        {formData.locationPhone && (
                          <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {formData.locationPhone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-800">
                    By registering, you agree to our Terms of Service and
                    Privacy Policy. You'll get a 30-day free trial to explore
                    all features.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 "
                >
                  <FaArrowLeft />
                  <span>Previous</span>
                </button>
              )}

              <button
                type="submit"
                disabled={registerBusinessMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerBusinessMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {currentStep === 5 ? "Create Business" : "Next Step"}
                    </span>
                    <FaArrowRight />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Already have account */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterBusiness;
