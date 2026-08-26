import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  PencilIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Pagination, Modal, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { format } from "date-fns";

import useAuth from "../../hooks/useAuth";

const TeamList = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, search],
    queryFn: async () => {
      // Assuming 'users' endpoint returns team members
      const response = await axiosPrivate.get(
        `/users?page=${page}&limit=10&search=${search}`
      );
      return response.data;
    },
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // Endpoint: /delete/:deleteType/:deletedBy/:userId
      await axiosPrivate.delete(`/users/delete/soft/${auth?.user?._id}/${id}`);
    },
    onSuccess: () => {
      toast.success("Team member removed successfully");
      queryClient.invalidateQueries(["users"]);
      close();
      setDeleteId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error removing team member");
      close();
    },
  });

  const confirmDelete = (id) => {
    setDeleteId(id);
    open();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Team Management
        </h1>
        <Link
          to="/dashboard/team/create"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-md"
        >
          <UserPlusIcon className="w-5 h-5" />
          Add Member
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-lighter p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search team members..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-dark text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-lighter rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-dark-lighter text-gray-600 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Loading team...
                    </div>
                  </td>
                </tr>
              ) : data?.users?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4">
                    <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-dark-lighter/30 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                      <UsersIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        No team members found
                      </p>
                      <p className="text-sm">Add your first team member.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.users?.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-lighter/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-lg">
                          {user.firstName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="w-4 h-4 text-gray-400" />
                        <span className="capitalize text-sm text-gray-700 dark:text-gray-300">
                          {user.roles?.[0] || user.role || "Staff"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {user.createdAt
                        ? format(new Date(user.createdAt), "MMM dd, yyyy")
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/dashboard/team/${user._id}`}
                          title="View Details"
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <PencilIcon className="w-4 h-4" /> View
                        </Link>
                        <button
                          onClick={() => confirmDelete(user._id)}
                          title="Delete"
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
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
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-center">
          <Pagination
            total={data?.pagination?.pages || 1}
            value={page}
            onChange={setPage}
            color="red"
            size="sm"
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Confirm Removal"
        centered
        classNames={{
          content: "dark:bg-dark-lighter dark:border dark:border-gray-800",
          header: "dark:bg-dark-lighter dark:text-white",
          title: "dark:text-white font-semibold",
          close: "dark:text-gray-400 dark:hover:bg-gray-800",
        }}
      >
        <div className="flex flex-col items-center text-center p-4">
          <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-800 dark:text-gray-200 font-medium mb-2">
            Are you sure you want to remove this member?
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            This action cannot be undone.
          </p>

          <div className="flex gap-3 w-full">
            <Button
              fullWidth
              variant="default"
              onClick={close}
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              fullWidth
              color="red"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Removing..." : "Remove Member"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamList;
