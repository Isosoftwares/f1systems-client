import React, { useState } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaShoppingBag,
  FaStore,
  FaCheckCircle,
  FaShieldAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaComments,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import axios from "./api/axios";
import useAuth from "./hooks/useAuth";

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const signUp = (signupData) => {
    return axios.post("/buyers/register", signupData, {
      withCredentials: true,
    });
  };

  const { mutate: signupMutate, isPending: loadingSignup } = useMutation({
    mutationFn: signUp,
    onSuccess: (response) => {
      const token = response?.data?.token;
      const buyer = response?.data?.buyer;

      // Set auth context
      setAuth({
        accessToken: token,
        user: buyer,
        userType: "buyer",
        isAuthenticated: true,
      });

      // Clear form and error messages
      reset();
      setErrMsg("");

      const message =
        response?.data?.message ||
        `Welcome ${
          buyer?.fullName || buyer?.email
        }! Account created successfully.`;
      toast.success(message);

      // Navigate to dashboard or products page
      navigate("/products", { replace: true });
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrMsg(message);
      setTimeout(() => setErrMsg(""), 8000);
      toast.error(message);
    },
  });

  const onSubmit = async (data) => {
    try {
      signupMutate(data);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Sign Up - DASOPS | Kenya's Marketplace</title>
        <meta
          name="description"
          content="Join DASOPS marketplace and start buying or selling products across Kenya. Create your account in minutes."
        />
      </Helmet>

      <NavBar />

      {/* Main Content */}
      <div className=" pt-[150px] lg:pt-[100px] pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="">
            {/* Header Section */}
            <div className="text-center ">
              <div className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-2xl text-sm font-semibold mb-6 border border-primary/20">
                <div className="w-3 h-3 bg-primary rounded-full mr-3 animate-pulse"></div>
                Join Kenya's Leading Marketplace
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column - Signup Form */}
              <div className="lg:col-span-7">
                <div className="bg-light rounded-3xl shadow-md border border-gray-100 p-8 lg:p-10 relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-full translate-y-12 -translate-x-12"></div>

                  <div className="relative z-10">
                    {/* Form Header */}
                    <div className="text-center mb-4 border-b-2 border-b-primary/50">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FaShoppingBag className="text-primary text-2xl" />
                      </div>
                      <h2 className="text-2xl font-bold text-dark mb-2">
                        Create Account
                      </h2>
                      <p className="text-gray-600">
                        Perfect for purchasing products and services
                      </p>
                    </div>

                    {/* Error Message */}
                    {errMsg && (
                      <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-light text-xs font-bold">
                                !
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-red-700 text-sm font-medium">
                              {errMsg}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Form */}
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* Name Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* <div>
                          <label className="block text-sm font-semibold text-dark mb-3">
                            First Name
                          </label>
                          <div className="relative group">
                            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-primary transition-colors" />
                            <input
                              type="text"
                              placeholder="Your first name"
                              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-light  ${
                                errors.firstName
                                  ? "border-red-500 focus:border-red-500 bg-red-50"
                                  : "border-gray-200 focus:border-primary focus:bg-light"
                              }`}
                              disabled={loadingSignup}
                              {...register("firstName", {
                                maxLength: {
                                  value: 50,
                                  message:
                                    "First name must be less than 50 characters",
                                },
                              })}
                            />
                          </div>
                          {errors.firstName && (
                            <p className="text-red-500 text-xs mt-2 flex items-center">
                              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                              {errors.firstName.message}
                            </p>
                          )}
                        </div> */}

                        {/* <div>
                          <label className="block text-sm font-semibold text-dark mb-3">
                            Last Name
                          </label>
                          <div className="relative group">
                            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-primary transition-colors" />
                            <input
                              type="text"
                              placeholder="Your last name"
                              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-light  ${
                                errors.lastName
                                  ? "border-red-500 focus:border-red-500 bg-red-50"
                                  : "border-gray-200 focus:border-primary focus:bg-light"
                              }`}
                              disabled={loadingSignup}
                              {...register("lastName", {
                                maxLength: {
                                  value: 50,
                                  message:
                                    "Last name must be less than 50 characters",
                                },
                              })}
                            />
                          </div>
                          {errors.lastName && (
                            <p className="text-red-500 text-xs mt-2 flex items-center">
                              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                              {errors.lastName.message}
                            </p>
                          )}
                        </div> */}
                      </div>

                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-semibold text-dark mb-3">
                          Email Address *
                        </label>
                        <div className="relative group">
                          <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-primary transition-colors" />
                          <input
                            type="email"
                            placeholder="Enter your email address"
                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-light  ${
                              errors.email
                                ? "border-red-500 focus:border-red-500 bg-red-50"
                                : "border-gray-200 focus:border-primary focus:bg-light"
                            }`}
                            disabled={loadingSignup}
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                message: "Please enter a valid email address",
                              },
                            })}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-2 flex items-center">
                            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Phone Field */}
                      {/* <div>
                        <label className="block text-sm font-semibold text-dark mb-3">
                          Phone Number
                        </label>
                        <div className="relative group">
                          <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-primary transition-colors" />
                          <input
                            type="tel"
                            placeholder="07XX XXX XXX"
                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-light  ${
                              errors.phone
                                ? "border-red-500 focus:border-red-500 bg-red-50"
                                : "border-gray-200 focus:border-primary focus:bg-light"
                            }`}
                            disabled={loadingSignup}
                            {...register("phone", {
                              pattern: {
                                value: /^[\+]?[0-9]{10,15}$/,
                                message: "Please enter a valid phone number",
                              },
                            })}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-2 flex items-center">
                            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                            {errors.phone.message}
                          </p>
                        )}
                      </div> */}

                      {/* Password Field */}
                      <div>
                        <label className="block text-sm font-semibold text-dark mb-3">
                          Password *
                        </label>
                        <div className="relative group">
                          <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-primary transition-colors" />
                          <input
                            type={visiblePassword ? "text" : "password"}
                            placeholder="Create a secure password"
                            className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-light  ${
                              errors.password
                                ? "border-red-500 focus:border-red-500 bg-red-50"
                                : "border-gray-200 focus:border-primary focus:bg-light"
                            }`}
                            disabled={loadingSignup}
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 6,
                                message:
                                  "Password must be at least 6 characters",
                              },
                            })}
                          />
                          <button
                            type="button"
                            onClick={() => setVisiblePassword(!visiblePassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                            disabled={loadingSignup}
                          >
                            {visiblePassword ? (
                              <AiOutlineEyeInvisible size={20} />
                            ) : (
                              <AiOutlineEye size={20} />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-2 flex items-center">
                            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      {/* Terms Agreement */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <div className="text-sm text-blue-800">
                            <p className="text-blue-700">
                              By creating an account, you agree to our{" "}
                              <Link
                                to="/terms"
                                className="font-semibold hover:underline"
                              >
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link
                                to="/privacy"
                                className="font-semibold hover:underline"
                              >
                                Privacy Policy
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loadingSignup}
                        className="w-full bg-primary text-light py-4 font-bold rounded-xl transition-all duration-300 hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg"
                      >
                        {loadingSignup ? (
                          <>
                            <div className="w-6 h-6 border-2 border-light border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <FaShoppingBag className="text-lg" />
                            <span>Create Buyer Account</span>
                            <FaArrowRight className="text-sm" />
                          </>
                        )}
                      </button>

                      {/* Already have account */}
                      <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-gray-600">
                          Already have an account?{" "}
                          <Link
                            to="/login"
                            className="text-primary hover:text-blue-700 font-semibold hover:underline"
                          >
                            Sign in here
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right Column - Account Types & Benefits */}
              <div className="lg:col-span-5 space-y-8">
                {/* Seller Account CTA */}
                <div className="bg-green-600 rounded-3xl p-8 text-light shadow-md relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-light/10 rounded-full -translate-y-20 translate-x-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-light/5 rounded-full translate-y-16 -translate-x-16"></div>

                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-light/20 rounded-2xl flex items-center justify-center">
                          <FaStore className="text-light text-3xl" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold mb-3">
                          Ready to Start Selling?
                        </h3>
                        <p className="text-light/90 mb-6 text-lg leading-relaxed">
                          Join thousands of successful sellers on DASOPS.
                          Create your seller account and start earning money by
                          listing your products to millions of potential buyers
                          across Kenya.
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <Link
                            to="/signup/seller"
                            className="inline-flex items-center space-x-3 bg-light text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
                          >
                            <FaStore className="text-lg" />
                            <span>Create Seller Account</span>
                            <FaArrowRight className="text-sm" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SignUp;
