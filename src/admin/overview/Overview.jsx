import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@mantine/core";
import {
  FaMapMarkerAlt,
  FaUserTie,
  FaUsers,
  FaUserCheck,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

function Overview() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const user = auth?.user;

  // Fetch dashboard stats
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await axios.get("/dashboard/overview");
      return res.data;
    },
  });

  const stats = statsData?.data;
  const metrics = stats?.metrics;
  const recentMembers = stats?.recentMembers || [];

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="md" color="amber" />
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ledger Dashboard Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Welcome back, {user?.userName}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Members */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 rounded-xl w-fit mb-4">
            <FaUsers className="w-6 h-6" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Total Members
          </p>
          <h3 className="text-2xl font-black text-gray-905 dark:text-white mt-1">
            {metrics?.membersCount || 0}
          </h3>
        </div>

        {/* Active Members */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl w-fit mb-4">
            <FaUserCheck className="w-6 h-6" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Active Members
          </p>
          <h3 className="text-2xl font-black text-gray-905 dark:text-white mt-1">
            {metrics?.activeMembersCount || 0}
          </h3>
        </div>

        {/* Pending Members */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-750 dark:text-blue-400 rounded-xl w-fit mb-4">
            <FaClock className="w-6 h-6" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Pending / Review
          </p>
          <h3 className="text-2xl font-black text-gray-905 dark:text-white mt-1">
            {metrics?.pendingMembersCount || 0}
          </h3>
        </div>

        {/* Lodge Locations */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-750 dark:text-indigo-400 rounded-xl w-fit mb-4">
            <FaMapMarkerAlt className="w-6 h-6" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Lodges Defined
          </p>
          <h3 className="text-2xl font-black text-gray-905 dark:text-white mt-1">
            {metrics?.lodgesCount || 0}
          </h3>
        </div>

        {/* Grandmasters */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-750 dark:text-purple-400 rounded-xl w-fit mb-4">
            <FaUserTie className="w-6 h-6" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Grandmasters
          </p>
          <h3 className="text-2xl font-black text-gray-905 dark:text-white mt-1">
            {metrics?.grandmastersCount || 0}
          </h3>
        </div>
      </div>

      {/* Lists Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-150 dark:border-gray-755 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/40">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaClipboardList className="text-amber-700" />
            Recently Registered Members
          </h3>
          <Link
            to="/dashboard/members"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Go to Members Ledger
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Lodge Name</th>
                <th className="px-6 py-4">Membership ID</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 dark:divide-gray-750 text-gray-700 dark:text-gray-300">
              {recentMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No recent members registered in ledger.
                  </td>
                </tr>
              ) : (
                recentMembers.map((member) => (
                  <tr
                    key={member._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-905 dark:text-white">
                      {member.firstName} {member.lastName}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium">
                      {member.email}
                    </td>
                    <td className="px-6 py-4">
                      {member.lodgeLocation?.lodgeName || "-"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-xs text-primary font-mono">
                      #{member.membershipId || member.lodgeNumber || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          member.status === "Active"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200/30"
                            : member.status === "Pending Payment"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-200/30"
                            : member.status === "Pending"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200/30"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200/30"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Overview;
