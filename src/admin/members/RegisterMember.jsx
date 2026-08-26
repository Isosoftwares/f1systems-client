import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Select } from "@mantine/core";
import { toast } from "react-toastify";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaUsers, FaFilePdf, FaFileImage, FaSave } from "react-icons/fa";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function RegisterMember() {
  const { id } = useParams();
  const isEditing = !!id;
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [occupation, setOccupation] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [reasonToJoin, setReasonToJoin] = useState("");
  const [gender, setGender] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [networth, setNetworth] = useState("");
  const [lodgeNumber, setLodgeNumber] = useState("");
  const [lodgeLocation, setLodgeLocation] = useState("");
  const [grandmaster, setGrandmaster] = useState("");
  const [status, setStatus] = useState("Pending");

  // File uploads
  const [photoFile, setPhotoFile] = useState(null);
  const [certPNGFile, setCertPNGFile] = useState(null);
  const [certPDFFile, setCertPDFFile] = useState(null);

  // Dropdown lists
  const { data: lodgesData } = useQuery({
    queryKey: ["lodges-select"],
    queryFn: async () => {
      const res = await axios.get("/lodges");
      return res.data;
    },
  });

  const { data: gmData } = useQuery({
    queryKey: ["grandmasters-select"],
    queryFn: async () => {
      const res = await axios.get("/grandmasters");
      return res.data;
    },
  });

  // Query to fetch member if editing
  const { data: memberData, isLoading: isLoadingMember } = useQuery({
    queryKey: ["member-detail", id],
    queryFn: async () => {
      const res = await axios.get(`/members/${id}`);
      return res.data;
    },
    enabled: isEditing,
  });

  // Initialize form state when editing
  useEffect(() => {
    if (isEditing && memberData?.member) {
      const m = memberData.member;
      setFirstName(m.firstName || "");
      setLastName(m.lastName || "");
      setYearOfBirth(m.yearOfBirth || "");
      setOccupation(m.occupation || "");
      setMaritalStatus(m.maritalStatus || "");
      setReasonToJoin(m.reasonToJoin || "");
      setGender(m.gender || "");
      setCountryOfOrigin(m.countryOfOrigin || "");
      setCurrentAddress(m.currentAddress || "");
      setPhoneNumber(m.phoneNumber || "");
      setEmail(m.email || "");
      setCity(m.city || "");
      setNetworth(m.networth || "");
      setLodgeNumber(m.lodgeNumber || "");
      setLodgeLocation(m.lodgeLocation?._id || m.lodgeLocation || "");
      setGrandmaster(m.grandmaster?._id || m.grandmaster || "");
      setStatus(m.status || "Pending");
    }
  }, [isEditing, memberData]);

  // Mutation to create member
  const { mutate: createMemberMutate, isPending: isCreating } = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post("/members", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Member registered in ledger successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      navigate("/dashboard/members");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to add member");
    },
  });

  // Mutation to update member
  const { mutate: updateMemberMutate, isPending: isUpdating } = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.put(`/members/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Member record updated successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      navigate("/dashboard/members");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update member");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !yearOfBirth || !email) {
      toast.error("Required fields: First Name, Last Name, Year of Birth, and Email");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("yearOfBirth", yearOfBirth);
    formData.append("occupation", occupation);
    formData.append("maritalStatus", maritalStatus);
    formData.append("reasonToJoin", reasonToJoin);
    formData.append("gender", gender);
    formData.append("countryOfOrigin", countryOfOrigin);
    formData.append("currentAddress", currentAddress);
    formData.append("phoneNumber", phoneNumber);
    formData.append("email", email);
    formData.append("city", city);
    formData.append("networth", networth);
    formData.append("lodgeNumber", lodgeNumber);
    formData.append("lodgeLocation", lodgeLocation);
    formData.append("grandmaster", grandmaster);
    formData.append("status", status);

    if (photoFile) formData.append("passportPhoto", photoFile);
    if (certPNGFile) formData.append("certPNG", certPNGFile);
    if (certPDFFile) formData.append("certPDF", certPDFFile);

    if (isEditing) {
      updateMemberMutate(formData);
    } else {
      createMemberMutate(formData);
    }
  };

  const lodges = lodgesData?.lodges || [];
  const grandmasters = gmData?.grandmasters || [];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  
  const networthRanges = [
    "$0 - $1,000",
    "$1,001 - $10,000",
    "$10,001 - $50,000",
    "$50,001 - $100,000",
    "$100,001 - $250,000",
    "$250,001 - $500,000",
    "$500,001 - $1,000,000",
    "Over $1,000,000"
  ];

  if (isEditing && isLoadingMember) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="md" color="amber" />
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/dashboard/members"
          className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl text-gray-500 hover:text-primary transition-all shadow-sm"
        >
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaUsers className="text-primary" /> {isEditing ? "Edit Member Record" : "Register Member"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? "Modify existing ledger information and certificates." : "Enter personal details and upload certificates to record member."}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Select
                label={
                  <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Year of Birth
                  </span>
                }
                placeholder="Select Year"
                data={years.map((yr) => yr.toString())}
                value={yearOfBirth ? yearOfBirth.toString() : ""}
                onChange={(val) => setYearOfBirth(val)}
                searchable
                required
                maxDropdownHeight={280}
                styles={{
                  input: {
                    borderRadius: "0.75rem",
                    border: "1px solid #d1d5db",
                    fontSize: "0.875rem",
                    height: "2.5rem",
                  },
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@email.com"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Occupation
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Attorney"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Marital Status
              </label>
              <input
                type="text"
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                placeholder="e.g. Married"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Country of Origin
              </label>
              <input
                type="text"
                value={countryOfOrigin}
                onChange={(e) => setCountryOfOrigin(e.target.value)}
                placeholder="e.g. Kenya"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Nairobi"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Current Address
              </label>
              <input
                type="text"
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                placeholder="Physical address"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Select
                label={
                  <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Net Worth Range
                  </span>
                }
                placeholder="Select net worth range"
                data={networthRanges}
                value={networth || ""}
                onChange={(val) => setNetworth(val)}
                searchable
                styles={{
                  input: {
                    borderRadius: "0.75rem",
                    border: "1px solid #d1d5db",
                    fontSize: "0.875rem",
                    height: "2.5rem",
                  },
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Lodge Number (Unique Lookup Link ID)
              </label>
              <input
                type="text"
                value={lodgeNumber}
                onChange={(e) => setLodgeNumber(e.target.value)}
                placeholder="e.g. 104"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Assign Lodge Location
              </label>
              <select
                value={lodgeLocation}
                onChange={(e) => setLodgeLocation(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
              >
                <option value="">Select Lodge Location</option>
                {lodges.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.lodgeName} (#{l.lodgeNumber})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Assign Grandmaster
              </label>
              <select
                value={grandmaster}
                onChange={(e) => setGrandmaster(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
              >
                <option value="">Select Grandmaster</option>
                {grandmasters.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Membership Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm font-semibold"
              >
                <option value="Pending">Pending</option>
                <option value="Pending Payment">Pending Payment</option>
                <option value="Active">Active</option>
                <option value="Rejected">Rejected</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Reason to Join
            </label>
            <textarea
              value={reasonToJoin}
              onChange={(e) => setReasonToJoin(e.target.value)}
              placeholder="State reason to join"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-primary dark:bg-gray-900 dark:text-white text-sm"
              rows={3}
            />
          </div>

          {/* Uploads Section */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-4 uppercase tracking-wider">
              Verification Files & Photo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800 text-center">
                <FaFileImage className="text-gray-400 mx-auto mb-2 text-xl" />
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Passport Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                  className="text-xs w-full"
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800 text-center">
                <FaFileImage className="text-gray-400 mx-auto mb-2 text-xl" />
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Certificate PNG Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCertPNGFile(e.target.files[0])}
                  className="text-xs w-full"
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800 text-center">
                <FaFilePdf className="text-gray-400 mx-auto mb-2 text-xl" />
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Certificate PDF File
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setCertPDFFile(e.target.files[0])}
                  className="text-xs w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
            <Link
              to="/dashboard/members"
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <FaSave /> {isCreating || isUpdating ? "Saving member..." : "Save member to ledger"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterMember;
