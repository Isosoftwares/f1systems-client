import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  TrashIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Modal, Button, Tabs, Badge } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { format } from "date-fns";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuth from "../../hooks/useAuth";

const TeamDetails = () => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    role: "",
    idNo: "",
    status: "",
  });

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/users/one/${id}`);
      return response.data; // response.data.user
    },
  });

  const user = userData?.user || {};
  const { auth } = useAuth();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // Corrected Delete Endpoint
      await axiosPrivate.delete(`/users/delete/soft/${auth?.user?._id}/${id}`);
    },
    onSuccess: () => {
      toast.success("Team member removed successfully");
      queryClient.invalidateQueries(["users"]);
      navigate("/dashboard/team");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error removing team member");
      close();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data) => {
      // Corrected Edit Endpoint
      await axiosPrivate.patch(`/users/edit`, { ...data, userId: id });
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries(["user", id]);
      queryClient.invalidateQueries(["users"]);
      closeEdit();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error updating user");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleEditClick = () => {
    setEditFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNo: user.phoneNo || "",
      role: user.roles?.[0] || user.role || "employee",
      idNo: user.idNo || "",
      status: user.status || "Active",
    });
    openEdit();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateUserMutation.mutate(editFormData);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/team"
            className="p-2 bg-white dark:bg-dark-lighter rounded-lg text-gray-500 hover:text-primary transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Team Member Details
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            leftSection={<PencilSquareIcon className="w-4 h-4" />}
            onClick={handleEditClick}
            className="dark:bg-transparent dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            Edit
          </Button>
          <Button
            variant="light"
            color="red"
            leftSection={<TrashIcon className="w-4 h-4" />}
            onClick={open}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-dark-lighter rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 text-center border-b border-gray-100 dark:border-gray-800">
              <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-secondary/10 text-secondary mb-4 text-3xl font-bold">
                {user?.firstName?.[0]}
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex justify-center flex-wrap gap-2 mt-2">
                <Badge color="blue" variant="light" size="sm">
                  {user?.role || user?.roles?.[0]}
                </Badge>
                <Badge
                  color={user?.isActive ? "green" : "red"}
                  variant="light"
                  size="sm"
                >
                  {user?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <span>{user?.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <span>{user?.phoneNo || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <IdentificationIcon className="w-5 h-5 text-gray-400" />
                <span>ID: {user?.idNo || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <div className="bg-white dark:bg-dark-lighter rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-primary" />
              Permissions & Access
            </h3>

            {user?.permissions?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((perm, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-sm capitalize"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No specific permissions assigned.
              </p>
            )}
          </div>

          {/* Account Activity - Placeholder for now */}
          <div className="bg-white dark:bg-dark-lighter rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Account Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                  Username
                </p>
                <p className="text-gray-800 dark:text-white">
                  {user?.userName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                  Member Since
                </p>
                <p className="text-gray-800 dark:text-white">
                  {user?.createdAt
                    ? format(new Date(user.createdAt), "PPP")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Confirm Deletion"
        centered
        classNames={{
          content: "dark:bg-dark-lighter dark:border dark:border-gray-800",
          header: "dark:bg-dark-lighter dark:text-white",
          title: "dark:text-white font-semibold",
          close: "dark:text-gray-400 dark:hover:bg-gray-800",
        }}
      >
        <div className="p-4 text-center">
          <p className="text-gray-800 dark:text-gray-200 mb-6">
            Are you sure you want to delete{" "}
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="default"
              onClick={close}
              className="dark:bg-transparent dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title="Edit Team Member"
        size="lg"
        centered
        classNames={{
          content: "dark:bg-dark-lighter dark:border dark:border-gray-800",
          header: "dark:bg-dark-lighter dark:text-white",
          title: "dark:text-white font-semibold",
          close: "dark:text-gray-400 dark:hover:bg-gray-800",
        }}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name *
              </label>
              <input
                required
                name="firstName"
                value={editFormData.firstName}
                onChange={handleEditChange}
                className="w-full p-2 border rounded dark:bg-dark-lighter dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name *
              </label>
              <input
                required
                name="lastName"
                value={editFormData.lastName}
                onChange={handleEditChange}
                className="w-full p-2 border rounded dark:bg-dark-lighter dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email *
              </label>
              <input
                required
                name="email"
                value={editFormData.email}
                onChange={handleEditChange}
                className="w-full p-2 border rounded dark:bg-dark-lighter dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <input
                name="phoneNo"
                value={editFormData.phoneNo}
                onChange={handleEditChange}
                className="w-full p-2 border rounded dark:bg-dark-lighter dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ID Number
              </label>
              <input
                name="idNo"
                value={editFormData.idNo}
                onChange={handleEditChange}
                className="w-full p-2 border rounded dark:bg-dark-lighter dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                name="role"
                value={editFormData.role}
                onChange={handleEditChange}
                className="w-full p-2 border rounded dark:bg-dark-lighter dark:border-gray-700 dark:text-white"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                name="status"
                value={editFormData.status}
                onChange={handleEditChange}
                className="w-full p-2 border rounded dark:bg-dark-lighter dark:border-gray-700 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="default"
              onClick={closeEdit}
              className="dark:bg-transparent dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" loading={updateUserMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamDetails;
