import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { BASE_API_URL } from "./api/axios";
import { Loader } from "@mantine/core";
import { FaFilePdf, FaFileImage, FaGlobe, FaCertificate, FaUserTie, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

function MemberPortal() {
  const { lodgeNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        setLoading(true);
        // Call the public API route to lookup by lodge number.
        // It detects the host header automatically or falls back.
        const res = await axios.get(`/members/public/member/${lodgeNumber}`);
        setMember(res.data.member);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Member details could not be found.");
      } finally {
        setLoading(false);
      }
    };

    if (lodgeNumber) {
      fetchMemberDetails();
    }
  }, [lodgeNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-55 dark:bg-gray-950 flex flex-col items-center justify-center p-6 text-gray-800 dark:text-gray-200">
        <Loader size="lg" color="amber" />
        <p className="mt-4 text-sm font-semibold tracking-wider animate-pulse">
          VERIFYING LEDGER CREDENTIALS...
        </p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gray-55 dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-red-200/40 dark:border-red-950/40 rounded-2xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-650 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200/20">
            <FaCertificate className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ledger Record Not Found</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            The requested lodge reference number is invalid or could not be verified in the Ledger.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-955 flex flex-col items-center justify-center p-4 sm:p-6 text-gray-800 dark:text-gray-200 font-sans">
      <div className="max-w-5xl w-full bg-white dark:bg-gray-900 border border-amber-250/20 dark:border-amber-900/10 rounded-3xl shadow-xl overflow-hidden">
        {/* Certificate / Verification Header */}
        <div className="bg-amber-900 p-8 text-center relative border-b border-amber-855/20 text-white">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-green-300 text-xs font-bold border border-white">
            <FaCheckCircle /> verified
          </div>
          
          <FaCertificate className="w-14 h-14 text-amber-300 mx-auto mb-3 drop-shadow" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase font-serif">
           Freemason Ledger
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1 uppercase tracking-widest font-semibold">
            {member.site?.name || "Official Member Registry"}
          </p>
        </div>

        {/* Member Profile Block */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="space-y-2 flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {member.firstName} {member.lastName}
              </h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200/30">
                  {member.status} Member
                </span>
                <span className="px-3 py-1 rounded-full font-bold bg-amber-100 dark:bg-amber-955/20 text-amber-800 dark:text-amber-400 border border-amber-200/30">
                  Lodge Number: {member.lodgeNumber}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm pt-2 text-gray-600 dark:text-gray-400">
                <p className="flex items-center justify-center sm:justify-start gap-2">
                  <FaMapMarkerAlt className="text-amber-600 shrink-0" />
                  <span>Lodge: <strong className="text-gray-800 dark:text-gray-200">{member.lodgeLocation?.lodgeName || "N/A"}</strong></span>
                </p>
                <p className="flex items-center justify-center sm:justify-start gap-2">
                  <FaGlobe className="text-amber-600 shrink-0" />
                  <span>Origin: <strong className="text-gray-800 dark:text-gray-200">{member.countryOfOrigin || "N/A"}</strong></span>
                </p>
              </div>
            </div>
          </div>



          {/* Mentor / Grandmaster Details */}
          {member.grandmaster && (
            <div className="bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 uppercase tracking-wide">
                <FaUserTie /> Grandmaster / Mentor Info
              </h3>
              <div className="flex gap-4 items-start">
                {member.grandmaster.picture && (
                  <img
                    src={`${BASE_API_URL}/${member.grandmaster.picture}`}
                    alt={member.grandmaster.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                )}
                <div>
                  <h4 className="font-bold text-gray-950 dark:text-white text-sm">{member.grandmaster.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-450 mt-0.5">Lodge No: {member.grandmaster.lodgeNo}</p>
                  {member.grandmaster.history && (
                    <p className="text-xs text-gray-650 dark:text-gray-300 mt-2 leading-relaxed italic">
                      "{member.grandmaster.history}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Credentials Display */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 text-center">Official Certificates</h3>
            
            {/* If no certs are present, show a clear indicator */}
            {!member.certPNG && !member.certPDF && (
              <div className="p-4 bg-amber-50 dark:bg-amber-955/20 border border-dashed border-amber-200/50 rounded-xl text-amber-800 dark:text-amber-400 text-xs font-semibold text-center">
                ⚠️ No certificates uploaded yet.
              </div>
            )}

            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Display PNG Certificate Image */}
              {member.certPNG && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Official Certificate</span>
                  <img
                    src={`${BASE_API_URL}/${member.certPNG}`}
                    alt="Certificate"
                    className="w-full max-h-[600px] object-contain rounded-xl border border-gray-200 dark:border-gray-800 shadow-md"
                  />
                </div>
              )}

              {/* PDF Download Button */}
              {member.certPDF && (
                <div className="flex justify-center pt-2">
                  <a
                    href={`${BASE_API_URL}/${member.certPDF}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-905 border border-red-200/50 rounded-xl font-bold transition-all shadow-sm text-sm w-full sm:w-auto"
                  >
                    <FaFilePdf /> Download PDF Certificate
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberPortal;
