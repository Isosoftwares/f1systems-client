import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "@mantine/core";
import { toast } from "react-toastify";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaFilePdf, FaFileImage, FaGlobe, FaCertificate, FaUserTie, FaMapMarkerAlt, FaCheckCircle, FaUserEdit, FaLink } from "react-icons/fa";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { BASE_API_URL } from "../../api/axios";

function ViewMember() {
  const { id } = useParams();
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleCopyLink = (lookupId) => {
    if (!lookupId) {
      toast.error("Membership ID is missing for this member");
      return;
    }
    const publicLink = `${window.location.origin}/registry/${lookupId}`;
    navigator.clipboard.writeText(publicLink);
    toast.success("Public verification link copied to clipboard!");
  };

  // Mutation to remove a certificate file
  const removeCertMutation = useMutation({
    mutationFn: async (type) => {
      const res = await axios.delete(`/members/${id}/certificate/${type}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Certificate removed successfully");
      queryClient.invalidateQueries({ queryKey: ["member-detail", id] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to remove certificate");
    }
  });

  // Mutation to upload single certificate file
  const uploadCertsMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(`/members/${id}/certificates`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Certificate uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["member-detail", id] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to upload certificate");
    }
  });

  const { data: memberData, isLoading, error } = useQuery({
    queryKey: ["member-detail", id],
    queryFn: async () => {
      const res = await axios.get(`/members/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader size="lg" color="amber" />
      </div>
    );
  }

  if (error || !memberData?.member) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-6 rounded-2xl text-center max-w-lg mx-auto my-12">
        <h2 className="text-xl font-bold text-red-750 dark:text-red-400 mb-2">Member Record Not Found</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          The requested member could not be loaded or does not exist.
        </p>
        <Link to="/dashboard/members" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700">
          <FaArrowLeft /> Back to Ledger
        </Link>
      </div>
    );
  }

  const member = memberData.member;
  const currentYear = new Date().getFullYear();
  const age = member.yearOfBirth ? currentYear - member.yearOfBirth : null;

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <button
            onClick={() => navigate("/dashboard/members")}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            <FaArrowLeft /> Back to Ledger List
          </button>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white uppercase font-serif mt-2">
            Member Profile
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleCopyLink(member.membershipId || member.lodgeNumber)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-amber-700 dark:text-amber-400 border border-amber-200/50 rounded-xl text-sm font-bold shadow-sm transition"
          >
            <FaLink /> Copy Portal Link
          </button>
          <button
            onClick={() => navigate(`/dashboard/members/edit/${member._id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-md shadow-amber-650/10 transition"
          >
            <FaUserEdit /> Edit Record
          </button>
        </div>
      </div>

      {/* Main Profile Info Panel */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-md overflow-hidden">
        {/* Card Header Banner */}
        <div className="bg-[#3B4A35] p-6 flex flex-col sm:flex-row gap-6 items-center text-center sm:text-left text-white border-b border-[#B9975B]/30">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-wide uppercase font-serif">
              {member.firstName} {member.lastName}
            </h3>
            <p className="text-xs text-[#B9975B] font-semibold tracking-widest uppercase font-mono">
              Membership ID: #{member.membershipId || member.lodgeNumber}
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B9975B]/20 text-[#F4F0E8] border border-[#B9975B]/40">
                {member.status}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid Container */}
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
              Identity & Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-semibold text-gray-500">Year of Birth</p>
                <p className="text-gray-900 dark:text-white mt-0.5">{member.yearOfBirth || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-500">Gender</p>
                <p className="text-gray-900 dark:text-white mt-0.5">{member.gender || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-500">Email Address</p>
                <p className="text-gray-900 dark:text-white mt-0.5 truncate">{member.email}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-500">Phone Number</p>
                <p className="text-gray-900 dark:text-white mt-0.5">{member.phoneNumber || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-500">Occupation</p>
                <p className="text-gray-900 dark:text-white mt-0.5">{member.occupation || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-500">Marital Status</p>
                <p className="text-gray-900 dark:text-white mt-0.5">{member.maritalStatus || "-"}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
              Background & Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="font-semibold text-gray-500">Net Worth</p>
                <p className="text-gray-900 dark:text-white mt-0.5 font-semibold text-[#B9975B]">
                  {member.networth || "-"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-500">Official Join Date</p>
                <p className="text-gray-900 dark:text-white mt-0.5 font-semibold">
                  {member.officialJoinDate
                    ? new Date(member.officialJoinDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not Recorded"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-500">Country of Origin</p>
                <p className="text-gray-900 dark:text-white mt-0.5">{member.countryOfOrigin || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-500">City & Address</p>
                <p className="text-gray-900 dark:text-white mt-0.5">
                  {member.city ? `${member.city}, ` : ""}{member.currentAddress || "-"}
                </p>
              </div>
            </div>
          </div>

          {member.reasonToJoin && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                Reason to Join
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border border-gray-150 dark:border-gray-800">
                "{member.reasonToJoin}"
              </p>
            </div>
          )}

          {/* Affiliation Details (Lodge & Grandmaster) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assigned Lodge Location */}
            <div className="bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 uppercase tracking-wide">
                <FaMapMarkerAlt /> Lodge Affiliation
              </h4>
              {member.lodgeLocation ? (
                <div>
                  <h5 className="font-bold text-gray-900 dark:text-white text-base">
                    {member.lodgeLocation.lodgeName}
                  </h5>
                  <p className="text-xs text-gray-500 mt-1">Lodge No: #{member.lodgeLocation.lodgeNumber}</p>
                  <p className="text-xs text-gray-650 dark:text-gray-350 mt-2">
                    Location: {member.lodgeLocation.location}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No Lodge Location Assigned</p>
              )}
            </div>

            {/* Mentor / Grandmaster Details */}
            <div className="bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 uppercase tracking-wide">
                <FaUserTie /> Grandmaster / Mentor
              </h4>
              {member.grandmaster ? (
                <div className="flex gap-4 items-start">
                  {member.grandmaster.picture && (
                    <img
                      src={`${BASE_API_URL}/${member.grandmaster.picture}`}
                      alt={member.grandmaster.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                  )}
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-white text-base">
                      {member.grandmaster.name}
                    </h5>
                    <p className="text-xs text-gray-500 mt-0.5">Lodge No: {member.grandmaster.lodgeNo}</p>
                    {member.grandmaster.history && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed italic line-clamp-3">
                        "{member.grandmaster.history}"
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No Mentor/Grandmaster Assigned</p>
              )}
            </div>
          </div>

          {/* Credentials Download & Management */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Official Certificates
            </h4>

            {/* If no certs are present, show the requested indicator */}
            {!member.certPNG && !member.certPDF && (
              <div className="p-4 bg-amber-50 dark:bg-amber-955/20 border border-dashed border-amber-200/50 rounded-xl text-amber-800 dark:text-amber-400 text-xs font-semibold text-center">
                ⚠️ No certificates uploaded yet. Use the upload fields below to add credentials.
              </div>
            )}
            
            <div className="space-y-6 max-w-3xl">
              {/* Display PNG Certificate Image */}
              <div className="bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Official Certificate (PNG/JPG)</span>
                  {member.certPNG && (
                    <button
                      onClick={() => removeCertMutation.mutate("png")}
                      disabled={removeCertMutation.isPending}
                      className="text-[10px] bg-red-50 hover:bg-red-100 dark:bg-red-955/20 text-red-700 hover:text-red-805 border border-red-200/30 px-2 py-1 rounded-md font-bold transition"
                    >
                      Remove Certificate
                    </button>
                  )}
                </div>

                {member.certPNG ? (
                  <div className="flex justify-center border border-gray-200 dark:border-gray-700 rounded-xl p-2 bg-white dark:bg-gray-900">
                    <img
                      src={`${BASE_API_URL}/${member.certPNG}`}
                      alt="Certificate"
                      className="max-h-[500px] object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append("certPNG", file);
                          uploadCertsMutation.mutate(formData);
                        }
                      }}
                      className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* PDF Document */}
              <div className="bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">PDF Document</span>
                  {member.certPDF && (
                    <button
                      onClick={() => removeCertMutation.mutate("pdf")}
                      disabled={removeCertMutation.isPending}
                      className="text-[10px] bg-red-50 hover:bg-red-100 dark:bg-red-955/20 text-red-700 hover:text-red-850 border border-red-200/30 px-2 py-1 rounded-md font-bold transition"
                    >
                      Remove PDF
                    </button>
                  )}
                </div>

                {member.certPDF ? (
                  <a
                    href={`${BASE_API_URL}/${member.certPDF}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-905 border border-red-200/40 rounded-xl font-bold transition text-xs shadow-sm w-full"
                  >
                    <FaFilePdf /> Download PDF Certificate
                  </a>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append("certPDF", file);
                          uploadCertsMutation.mutate(formData);
                        }
                      }}
                      className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-800 hover:file:bg-red-100 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewMember;
