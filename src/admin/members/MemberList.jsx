import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Modal, Button, Group, Text } from "@mantine/core";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaUserPlus,
  FaTrash,
  FaEdit,
  FaUsers,
  FaFilePdf,
  FaFileImage,
  FaSearch,
  FaEye,
  FaCopy,
  FaLink,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { BASE_API_URL } from "../../api/axios";

function MemberList() {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  // Query to fetch members
  const { data: membersData, isLoading } = useQuery({
    queryKey: ["members", page, searchTerm],
    queryFn: async () => {
      const res = await axios.get("/members", {
        params: { page, perPage: 10, searchTerm },
      });
      return res.data;
    },
  });

  // Mutation to delete member
  const { mutate: deleteMemberMutate } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/members/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Member removed from ledger");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete member");
    },
  });

  const openDetailView = (member) => {
    navigate(`/dashboard/members/view/${member._id}`);
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      deleteMemberMutate(memberToDelete._id);
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
    }
  };

  const handleCopyLink = (lookupId) => {
    if (!lookupId) {
      toast.error("Membership ID is missing for this member");
      return;
    }
    const publicLink = `${window.location.origin}/registry/${lookupId}`;
    navigator.clipboard.writeText(publicLink);
    toast.success("Public verification link copied to clipboard!");
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Active Member":
      case "Active":
      case "Membership Completed":
      case "Funding Completed":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-300/40";
      case "Initiated":
      case "Initiation Scheduled":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300/40";
      case "Application Received":
      case "Application Under Review":
      case "Waiting for Next Phase":
      case "Waiting for Initiation":
      case "Waiting for Funding":
      case "Waiting for New Grand Master":
      case "Pending":
      case "Pending Payment":
      case "Awaiting Documentation":
      case "Awaiting Payment":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300/40";
      case "Temporarily Inactive":
      case "Inactive":
      case "Suspended":
      case "Resigned":
      case "Rejected":
      default:
        return "bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300/40";
    }
  };

  const members = membersData?.members || [];
  const totalCount = membersData?.count || 0;
  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="p-1 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaUsers className="text-primary" /> Members Ledger
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Official ledger of your brotherhood chapter members, status, and credentials.
          </p>
        </div>
        <Link
          to="/dashboard/members/create"
          className="flex items-center gap-2 bg-primary hover:bg-[#c9a769] text-[#1c221a] px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98]"
        >
          <FaUserPlus /> Register New Member
        </Link>
      </div>

      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          placeholder="Search members by name, email, or membership ID..."
          className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder:text-gray-500"
        />
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader size="md" color="amber" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Photo</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Lodge Name & No</th>
                  <th className="px-6 py-4">Membership ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Public Link</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                {members.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                      No members registered in the ledger database.
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4">
                        {member.passportPhoto ? (
                          <img
                            src={`${BASE_API_URL}/${member.passportPhoto}`}
                            alt="Passport"
                            className="w-10 h-10 object-cover rounded-full border border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                            {member.firstName?.[0]}
                            {member.lastName?.[0]}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        {member.firstName} {member.lastName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {member.lodgeLocation?.lodgeName || "Unassigned"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {member.lodgeLocation?.location || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-xs text-primary font-mono">
                        #{member.membershipId || member.lodgeNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(
                            member.status
                          )}`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleCopyLink(member.membershipId || member.lodgeNumber)}
                          className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg border border-amber-200/30 hover:underline font-semibold transition-colors"
                        >
                          <FaLink /> Copy URL
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 text-xs font-semibold">
                          <button
                            onClick={() => openDetailView(member)}
                            className="px-2.5 py-1 text-amber-700 bg-amber-50 dark:bg-amber-900/25 border border-amber-200/30 hover:bg-amber-100 rounded-lg transition-all"
                          >
                            View
                          </button>
                          <Link
                            to={`/dashboard/members/edit/${member._id}`}
                            className="px-2.5 py-1 text-primary bg-primary/5 border border-primary/20 hover:bg-primary/10 rounded-lg transition-all flex items-center"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(member)}
                            className="px-2.5 py-1 text-red-650 bg-red-50 dark:bg-red-955/20 border border-red-200/30 hover:bg-red-100 rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-150 dark:border-gray-750 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/40">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-150 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-150 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}



      {/* Delete Confirmation Modal */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Text size="sm" mb="lg">
          Are you sure you want to remove <strong>{memberToDelete?.firstName} {memberToDelete?.lastName}</strong> from the ledger? All of their credentials and verification files will be deleted.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete Member
          </Button>
        </Group>
      </Modal>
    </div>
  );
}

export default MemberList;
