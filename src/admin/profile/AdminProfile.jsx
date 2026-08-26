import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import EditProfileModal from "./components/EditProfileModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  PencilIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/LoadingSpinner";

function AdminProfile() {
  const { auth } = useAuth();
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Fetch user profile
  const getUserProfile = async () => {
    return await axios.get(`/users/one/${auth.userId}`);
  };

  const {
    isLoading: loadingUser,
    data: userData,
    error: userError,
    isError: isUserError,
    refetch,
  } = useQuery({
    queryFn: getUserProfile,
    queryKey: ["own-profile"],
    retry: 0,
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch profile";
      toast.error(errorMessage);
    },
  });

  const user = userData?.data?.user;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get initials for avatar
  const getInitials = () => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    const email = user?.email || "";
    const userName = user?.userName || "";

    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (userName) {
      return userName.charAt(0)?.toUpperCase() || "U";
    }
    return email.charAt(0)?.toUpperCase() || "U";
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.userName) {
      return user.userName;
    }
    return user?.email || "User";
  };

  // Get role display
  const getRoleDisplay = (role) => {
    switch (role) {
      case "super_admin":
        return "Super Administrator";
      case "admin":
        return "Administrator";
      case "client":
        return "Client";
      default:
        return role || "User";
    }
  };

  // Get role color classes
  const getRoleColorClasses = (role) => {
    switch (role) {
      case "super_admin":
        return "bg-red-50 text-red-700 border border-red-200";
      case "admin":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "client":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  // Check if user is active
  const isUserActive = user?.status === "Active" || user?.isActive === true;

  if (loadingUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-primary">Getting your account!</p>
        <LoadingSpinner />
      </div>
    );
  }

  if (isUserError) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-dark mb-2">
            Failed to Load Profile
          </h3>
          <p className="text-red-600 mb-4">
            {userError?.response?.data?.message ||
              userError?.message ||
              "An unexpected error occurred"}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-light font-medium rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className=" ">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-xl font-bold text-dark">Profile Info</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <div className="bg-light rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="text-center">
                {/* Avatar */}
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-light">
                    {getInitials()}
                  </span>
                </div>

                {/* Name and Role */}
                <h2 className="text-xl font-bold text-dark mb-3">
                  {getDisplayName()}
                </h2>

                {user?.userName && (
                  <p className="text-gray-500 text-sm mb-3">@{user.userName}</p>
                )}

                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColorClasses(
                    user?.role
                  )}`}
                >
                  {getRoleDisplay(user?.role)}
                </span>

                {/* Status */}
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <div className="h-5 w-5 flex items-center justify-center">
                    {isUserActive ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isUserActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isUserActive ? "Active Account" : "Inactive Account"}
                  </span>
                </div>

                {/* Email Verification Status */}
                {/* {user?.isEmailVerified !== undefined && (
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 flex items-center justify-center">
                      {user?.isEmailVerified ? (
                        <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                      ) : (
                        <XCircleIcon className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        user?.isEmailVerified
                          ? "text-blue-600"
                          : "text-orange-600"
                      }`}
                    >
                      {user?.isEmailVerified
                        ? "Email Verified"
                        : "Email Not Verified"}
                    </span>
                  </div>
                )} */}

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {/* <button
                    onClick={() => setShowEditModal(true)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-primary hover:bg-primary/90 text-light font-medium rounded-lg transition-all duration-200"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Edit Profile
                  </button> */}
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    disabled={user?.email === "demo@ryzonplus.com"}
                    className="w-full disabled:bg-gray-700 disabled:cursor-not-allowed bg-primary flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-100 font-medium rounded-lg hover:bg-primary/80 transition-all duration-200"
                  >
                    <KeyIcon className="h-5 w-5 mr-2" />
                    Change Password
                  </button>
                  <button
                    onClick={() => navigate("/dashboard/security")}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <ShieldCheckIcon className="h-5 w-5 mr-2" />
                    Manage Sessions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-light rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-dark mb-6 flex items-center">
                <UserCircleIcon className="h-6 w-6 mr-3 text-primary" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <UserCircleIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </div>
                    <div className="text-dark">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : "Not provided"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <IdentificationIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Username
                    </div>
                    <div className="text-dark">
                      {user?.userName || "Not provided"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Email Address
                    </div>
                    <div className="text-dark flex items-center space-x-2">
                      <span>{user?.email || "Not available"}</span>
                      {user?.isEmailVerified && (
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Phone Number
                    </div>
                    <div className="text-dark">
                      {user?.phone || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-light rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-dark mb-6 flex items-center">
                <CalendarDaysIcon className="h-6 w-6 mr-3 text-tertiary" />
                Account Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Account Role
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColorClasses(
                        user?.role
                      )}`}
                    >
                      {getRoleDisplay(user?.role)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Account Status
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                        isUserActive
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {user?.status || (isUserActive ? "Active" : "Inactive")}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Account Created
                  </div>
                  <div className="text-dark">{formatDate(user?.createdAt)}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Last Updated
                  </div>
                  <div className="text-dark">{formatDate(user?.updatedAt)}</div>
                </div>

                {user?.lastLogin && (
                  <div className="md:col-span-2">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Last Login
                    </div>
                    <div className="text-dark">
                      {formatDate(user?.lastLogin)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      </div>
    </div>
  );
}

export default AdminProfile;
