import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { Modal, ScrollArea } from "@mantine/core";
import {
  ExclamationCircleIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import useLogout from "../../../hooks/useLogout";
import { useNavigate } from "react-router-dom";

function ChangePasswordModal({ isOpen, onClose }) {
  const axios = useAxiosPrivate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const logout = useLogout();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  // Change password mutation - updated to match backend API
  const changePasswordMutation = useMutation({
    mutationFn: (data) => {
      return axios.post("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: (response) => {
      const message =
        response?.data?.message || "Password changed successfully";
      toast.success(message);
      handleClose();
      logout(); // Log out user after password change
      navigate("/", { replace: true });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to change password";
      toast.error(errorMessage);
    },
  });

  const onSubmitting = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      if (data.currentPassword === data.newPassword) {
        toast.error("New password must be different from current password");
        return;
      }

      changePasswordMutation.mutate(data);
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Password change error:", error);
    }
  };

  const handleClose = () => {
    reset();
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) {
      errors.push("At least 6 characters");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("One lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("One uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("One number");
    }
    return errors;
  };

  const passwordErrors = newPassword ? validatePassword(newPassword) : [];

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      size="md"
      padding={0}
      radius="md"
      centered
      closeOnClickOutside={!changePasswordMutation.isPending}
      closeOnEscape={!changePasswordMutation.isPending}
      scrollAreaComponent={ScrollArea.Autosize}
      styles={{
        body: { padding: 0 },
        content: { maxHeight: "90vh" },
      }}
    >
      <div className="bg-white dark:bg-dark-lighter">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sticky top-0 bg-white dark:bg-dark-lighter z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <KeyIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                Change Password
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Update your account password
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <ScrollArea.Autosize maxHeight="calc(90vh - 180px)">
          <form
            onSubmit={handleSubmit(onSubmitting)}
            className="p-4 sm:p-6 space-y-4 sm:space-y-6"
          >
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  {...register("currentPassword", {
                    required: "Current password is required",
                  })}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border rounded-lg bg-white dark:bg-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm sm:text-base text-gray-900 dark:text-white ${
                    errors?.currentPassword
                      ? "border-red-300 dark:border-red-800"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors?.currentPassword && (
                <div className="mt-2 flex items-center text-xs sm:text-sm text-red-600">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="break-words">
                    {errors.currentPassword.message}
                  </span>
                </div>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword", {
                    required: "New password is required",
                    validate: (value) => {
                      const errors = validatePassword(value);
                      return (
                        errors.length === 0 ||
                        `Password must contain: ${errors.join(", ")}`
                      );
                    },
                  })}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border rounded-lg bg-white dark:bg-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm sm:text-base text-gray-900 dark:text-white ${
                    errors?.newPassword
                      ? "border-red-300 dark:border-red-800"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors?.newPassword && (
                <div className="mt-2 flex items-start text-xs sm:text-sm text-red-600">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                  <span className="break-words">
                    {errors.newPassword.message}
                  </span>
                </div>
              )}

              {/* Password Requirements */}
              {newPassword && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-dark border border-gray-100 dark:border-gray-700 rounded-lg">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password Requirements:
                  </div>
                  <div className="space-y-1">
                    {[
                      {
                        text: "At least 6 characters",
                        valid: newPassword.length >= 6,
                      },
                      {
                        text: "One lowercase letter",
                        valid: /(?=.*[a-z])/.test(newPassword),
                      },
                      {
                        text: "One uppercase letter",
                        valid: /(?=.*[A-Z])/.test(newPassword),
                      },
                      {
                        text: "One number",
                        valid: /(?=.*\d)/.test(newPassword),
                      },
                    ].map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            req.valid ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            req.valid ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border rounded-lg bg-white dark:bg-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm sm:text-base text-gray-900 dark:text-white ${
                    errors?.confirmPassword
                      ? "border-red-300 dark:border-red-800"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors?.confirmPassword && (
                <div className="mt-2 flex items-center text-xs sm:text-sm text-red-600">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="break-words">
                    {errors.confirmPassword.message}
                  </span>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-3">
              <div className="flex">
                <ExclamationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                    <strong>Security Notice:</strong> After changing your
                    password, you'll need to log in again with your new
                    credentials.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea.Autosize>

        {/* Sticky Footer with Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-dark-lighter sticky bottom-0">
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={changePasswordMutation.isPending}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit(onSubmitting)}
              disabled={
                changePasswordMutation.isPending || passwordErrors.length > 0
              }
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none text-sm sm:text-base"
            >
              {changePasswordMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Changing...
                </div>
              ) : (
                "Change Password"
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ChangePasswordModal;
