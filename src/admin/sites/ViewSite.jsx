import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Modal, Button, Text, Group } from "@mantine/core";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaGlobe, FaUserShield, FaPlus, FaTrash, FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

function ViewSite() {
  const { id } = useParams();
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  // Create User Form States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Edit User Form States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isUpdatingAdmin, setIsUpdatingAdmin] = useState(false);

  const openEditModal = (adm) => {
    setAdminToEdit(adm);
    setEditUsername(adm.userName || "");
    setEditEmail(adm.email || "");
    setIsEditModalOpen(true);
  };

  const handleEditAdminSubmit = async (e) => {
    e.preventDefault();
    if (!editUsername.trim() || !editEmail.trim()) {
      toast.error("Username and email are required");
      return;
    }

    setIsUpdatingAdmin(true);
    try {
      await axios.patch("/users/edit", {
        userId: adminToEdit._id,
        userName: editUsername.trim(),
        email: editEmail.trim(),
      });
      toast.success("Admin user details updated successfully!");
      setIsEditModalOpen(false);
      setAdminToEdit(null);
      queryClient.invalidateQueries({ queryKey: ["site-admins", id] });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update admin");
    } finally {
      setIsUpdatingAdmin(false);
    }
  };

  // Fetch Site Details
  const { data: siteData, isLoading: isSiteLoading, error: siteError } = useQuery({
    queryKey: ["site-detail", id],
    queryFn: async () => {
      const res = await axios.get(`/sites/${id}`);
      return res.data;
    },
  });

  // Fetch Site Admins
  const { data: adminsData, isLoading: isAdminsLoading } = useQuery({
    queryKey: ["site-admins", id],
    queryFn: async () => {
      const res = await axios.get(`/users/site/${id}`);
      return res.data;
    },
  });

  // Mutation to create site admin
  const handleCreateAdminSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password) {
      toast.error("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsCreatingAdmin(true);
    try {
      await axios.post("/users", {
        userName: username.trim(),
        email: email.trim(),
        password,
        role: "admin",
        siteId: id,
      });
      toast.success("Admin user created successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["site-admins", id] });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create admin");
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  // Mutation to delete admin user
  const handleDeleteAdminConfirm = async () => {
    if (!adminToDelete) return;
    try {
      // route: /delete/:deleteType/:deletedBy/:userId
      await axios.delete(`/users/delete/permanent/${auth?.user?.id || "admin"}/${adminToDelete._id}`);
      toast.success("Admin user removed successfully");
      setIsDeleteModalOpen(false);
      setAdminToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["site-admins", id] });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove user");
    }
  };

  if (isSiteLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader size="md" color="amber" />
      </div>
    );
  }

  if (siteError || !siteData?.site) {
    return (
      <div className="bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-800 p-6 rounded-2xl text-center max-w-lg mx-auto my-12">
        <h2 className="text-xl font-bold text-red-750 dark:text-red-400 mb-2">Tenant Site Not Found</h2>
        <p className="text-sm text-gray-650 dark:text-gray-400 mb-4">
          The requested tenant site details could not be loaded.
        </p>
        <Link to="/dashboard/sites" className="inline-flex items-center gap-2 px-4 py-2 bg-red-650 text-white rounded-xl font-semibold text-sm hover:bg-red-700">
          <FaArrowLeft /> Back to Sites List
        </Link>
      </div>
    );
  }

  const site = siteData.site;
  const admins = adminsData?.users || [];

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <Link
            to="/dashboard/sites"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            <FaArrowLeft /> Back to Sites List
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white uppercase font-serif mt-2">
            Site Portal Console
          </h2>
        </div>
        
        {/* Enable creation of additional admins */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-md shadow-amber-650/10 transition"
        >
          <FaUserPlus /> Create New Admin
        </button>
      </div>

      {/* Site Description Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold font-serif text-gray-950 dark:text-white">{site.name}</h3>
            {site.isMain && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                Main System Hub
              </span>
            )}
          </div>
          <p className="text-xs text-primary font-semibold mt-1">
            <a href={site.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1.5">
              <FaGlobe /> {site.url}
            </a>
          </p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {site.description || "No description configured for this site."}
        </p>
      </div>

      {/* Admins Table/List */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40">
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-950 dark:text-white">
            Registered Site Admins ({admins.length})
          </h4>
        </div>

        {isAdminsLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size="sm" color="amber" />
          </div>
        ) : admins.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No admin users registered for this site. Click "Create New Admin" to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                {admins.map((adm) => (
                  <tr key={adm._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{adm.userName}</td>
                    <td className="px-6 py-4 text-xs font-medium">{adm.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-955/20 text-amber-800 dark:text-amber-400 border border-amber-200/30">
                        {adm.role === "super_admin" ? "Grand Admin" : "Site Admin"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2 items-center">
                      <button
                        onClick={() => openEditModal(adm)}
                        className="px-2.5 py-1 text-primary bg-primary/5 border border-primary/20 hover:bg-primary/10 rounded-lg text-xs font-semibold transition"
                      >
                        Edit
                      </button>
                      {/* Prevent self deletion */}
                      {adm._id !== auth?.user?.id ? (
                        <button
                          onClick={() => {
                            setAdminToDelete(adm);
                            setIsDeleteModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-red-655 bg-red-50 dark:bg-red-955/20 border border-red-200/30 hover:bg-red-100 rounded-lg text-xs font-semibold transition"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic py-1">Logged In</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create New Admin Modal */}
      <Modal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Site Admin"
        centered
        radius="lg"
        padding="xl"
      >
        <form onSubmit={handleCreateAdminSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2.5 rounded-xl text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2.5 rounded-xl text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2.5 pr-10 rounded-xl text-sm outline-none focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2.5 pr-10 rounded-xl text-sm outline-none focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="black"
              loading={isCreatingAdmin}
            >
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal
        opened={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setAdminToEdit(null);
        }}
        title="Edit Admin User Details"
        centered
        radius="lg"
        padding="xl"
      >
        <form onSubmit={handleEditAdminSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2.5 rounded-xl text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2.5 rounded-xl text-sm"
              required
            />
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setIsEditModalOpen(false);
                setAdminToEdit(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="black"
              loading={isUpdatingAdmin}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm User Deletion"
        centered
        radius="lg"
      >
        <Text size="sm" mb="lg">
          Are you sure you want to permanently delete the admin user{" "}
          <strong>{adminToDelete?.userName}</strong>? This action is irreversible.
        </Text>
        <Group position="right">
          <Button variant="subtle" color="gray" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteAdminConfirm}>
            Delete User
          </Button>
        </Group>
      </Modal>
    </div>
  );
}

export default ViewSite;
