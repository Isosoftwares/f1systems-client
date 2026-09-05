import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { BASE_API_URL } from "./api/axios";
import { Loader } from "@mantine/core";
import {
  FaFilePdf,
  FaGlobe,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCalendarAlt,
  FaUserTie,
} from "react-icons/fa";
import MasonicEmblem from "./components/MasonicEmblem";
import masonicWatermark from "./assets/masonicWatermark.svg";

function MemberPortal() {
  const { membershipId, lodgeNumber } = useParams();
  const lookupId = membershipId || lodgeNumber;

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/members/public/member/${lookupId}`);
        setMember(res.data.member);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Member details could not be found.");
      } finally {
        setLoading(false);
      }
    };

    if (lookupId) {
      fetchMemberDetails();
    }
  }, [lookupId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2A2A28] flex flex-col items-center justify-center p-6 text-[#F4F0E8]">
        <Loader size="lg" color="yellow" />
        <p className="mt-4 text-xs font-bold tracking-widest text-[#B9975B] uppercase animate-pulse">
          VERIFYING BROTHERHOOD CREDENTIALS...
        </p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-[#2A2A28] flex items-center justify-center p-6 text-[#F4F0E8]">
        <div className="max-w-md w-full bg-[#1c221a] border border-[#B9975B]/30 rounded-3xl p-8 text-center shadow-2xl">
          <div className="flex justify-center mb-4">
            <MasonicEmblem className="w-16 h-16" color="#B9975B" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#F4F0E8] font-serif mb-2">
            Ledger Record Not Found
          </h2>
          <p className="text-xs text-[#F4F0E8]/70 mb-6 leading-relaxed">
            The requested membership identifier is invalid or could not be verified in the Official Registry Ledger.
          </p>
        </div>
      </div>
    );
  }

  const memberIdDisplay = member.membershipId || member.lodgeNumber;

  return (
    <div className="min-h-screen bg-[#2A2A28] flex flex-col items-center justify-center p-3 sm:p-6 text-[#2A2A28] font-sans relative overflow-hidden">
      {/* Background Watermark Decoration */}
      <div
        className="absolute -left-36 -top-24 w-[750px] h-[750px] opacity-[0.08] bg-no-repeat bg-contain pointer-events-none"
        style={{ backgroundImage: `url(${masonicWatermark})` }}
      />
      <div
        className="absolute -right-36 -bottom-24 w-[650px] h-[650px] opacity-[0.06] bg-no-repeat bg-contain pointer-events-none"
        style={{ backgroundImage: `url(${masonicWatermark})` }}
      />

      <div className="max-w-4xl w-full bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#B9975B]/40 overflow-hidden relative z-10 my-4">
        
        {/* 11. Public URL Certificate Header (Dark Masonic Banner) */}
        <div className="bg-[#1c221a] p-6 sm:p-8 text-center relative border-b border-[#B9975B]/40 text-[#F4F0E8]">
          {/* Verified Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B4A35] text-[#B9975B] text-xs font-bold border border-[#B9975B]/40 shadow-sm">
            <FaCheckCircle className="text-emerald-400" />
            <span className="tracking-wide">verified</span>
          </div>

          <div className="flex justify-center mb-2">
            <MasonicEmblem className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md" color="#B9975B" />
          </div>

          {/* 11. Replace FREEMASON LEDGER with OFFICIAL MEMBERSHIP CERTIFICATE (in Algerian font) */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-[0.14em] uppercase font-algerian text-[#F4F0E8] mt-1">
            OFFICIAL MEMBERSHIP CERTIFICATE
          </h1>
          <div className="w-24 h-[1.5px] bg-[#B9975B] mx-auto mt-2 opacity-80" />
        </div>

        {/* Member Profile Block */}
        <div className="p-6 sm:p-10 space-y-7">
          
          {/* 12. Member Name, Status, Membership ID, Lodge & Origin Layout (Left-Aligned) */}
          <div className="text-left pb-6 border-b border-[#B9975B]/20 space-y-2.5">
            {/* Full Name */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A2A28] font-serif tracking-tight">
              {member.firstName} {member.lastName}
            </h2>

            {/* Badges: Status & Membership ID */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="px-3.5 py-1 rounded-md text-xs font-bold tracking-wide bg-[#3B4A35] text-[#F4F0E8] border border-[#3B4A35]">
                {member.status || "Member"}
              </span>

              {/* 7. Membership ID (Unique Lookup Link ID) */}
              <span className="px-3.5 py-1 rounded-md text-xs font-bold tracking-wide bg-[#B9975B]/20 text-[#735823] border border-[#B9975B]/50 font-mono">
                Membership ID: {memberIdDisplay}
              </span>
            </div>

            {/* 12. Move Origin so it appears immediately after Lodge, both left aligned */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-[#44423e] pt-2">
              <span className="flex items-center gap-1.5 font-medium">
                <FaMapMarkerAlt className="text-[#B9975B] shrink-0 text-sm" />
                <span>
                  Lodge: <strong className="text-[#2A2A28] font-semibold">{member.lodgeLocation?.lodgeName || "N/A"}</strong>
                </span>
              </span>

              <span className="text-[#B9975B]/60 font-bold">•</span>

              <span className="flex items-center gap-1.5 font-medium">
                <FaGlobe className="text-[#B9975B] shrink-0 text-sm" />
                <span>
                  Origin: <strong className="text-[#2A2A28] font-semibold">{member.countryOfOrigin || "N/A"}</strong>
                </span>
              </span>

              {/* 6. Display Official Join Date on Member Public URL */}
              {member.officialJoinDate && (
                <>
                  <span className="text-[#B9975B]/60 font-bold">•</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <FaCalendarAlt className="text-[#B9975B] shrink-0 text-xs" />
                    <span>
                      Official Join Date:{" "}
                      <strong className="text-[#2A2A28] font-semibold">
                        {new Date(member.officialJoinDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </strong>
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Grandmaster / Mentor Details Box (matching reference image: deep green #3B4A35) */}
          {member.grandmaster && (
            <div className="bg-[#3B4A35] text-[#F4F0E8] border border-[#B9975B]/30 rounded-2xl p-5 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B9975B]">
                <FaUserTie />
                <span>GRANDMASTER / MENTOR INFO</span>
              </div>

              <div className="flex gap-4 items-center">
                {member.grandmaster.picture ? (
                  <img
                    src={`${BASE_API_URL}/${member.grandmaster.picture}`}
                    alt={member.grandmaster.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#B9975B]/60 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#1c221a] text-[#B9975B] border border-[#B9975B]/40 flex items-center justify-center font-bold text-sm shrink-0">
                    GM
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-[#F4F0E8] text-base font-serif">
                    {member.grandmaster.name}
                  </h4>
                  <p className="text-xs text-[#F4F0E8]/70 mt-0.5">
                    Lodge No: {member.grandmaster.lodgeNo}
                  </p>
                  {member.grandmaster.history && (
                    <p className="text-xs text-[#F4F0E8]/80 mt-1 italic leading-relaxed">
                      "{member.grandmaster.history}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 10. Credentials Display: Clean single heading with NO duplicate titles */}
          <div className="pt-4 space-y-4">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B9975B]">
                OFFICIAL CERTIFICATES
              </span>
              <div className="w-16 h-[1px] bg-[#B9975B]/40 mx-auto mt-1" />
            </div>

            {/* If no certs uploaded */}
            {!member.certPNG && !member.certPDF && (
              <div className="p-6 bg-[#FAF7F2] border border-dashed border-[#B9975B]/40 rounded-2xl text-center text-[#735823] text-xs font-semibold">
                Official certificates for this member record are pending registry archive.
              </div>
            )}

            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Certificate PNG Image (No duplicate heading) */}
              {member.certPNG && (
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-white rounded-2xl border border-[#B9975B]/40 shadow-lg w-full">
                    <img
                      src={`${BASE_API_URL}/${member.certPNG}`}
                      alt="Official Freemason Certificate"
                      className="w-full max-h-[650px] object-contain rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* PDF Download Button */}
              {member.certPDF && (
                <div className="flex justify-center pt-2">
                  <a
                    href={`${BASE_API_URL}/${member.certPDF}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 px-6 py-3 bg-[#B9975B] hover:bg-[#c9a769] text-[#1c221a] rounded-xl font-bold transition-all shadow-md text-xs sm:text-sm uppercase tracking-wider active:scale-[0.99]"
                  >
                    <FaFilePdf size={16} /> Download PDF Certificate
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-[#1c221a] py-3.5 px-6 text-center border-t border-[#B9975B]/30 text-[11px] text-[#F4F0E8]/60 uppercase tracking-widest">
          Secured & Verified by Freemason Ledger System
        </div>

      </div>
    </div>
  );
}

export default MemberPortal;
