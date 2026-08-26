import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Modal, Button, Group, Text } from "@mantine/core";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaEdit, FaGlobe, FaUserShield, FaEye, FaEyeSlash } from "react-icons/fa";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";

function SitesList() {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  
  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState(null);

  // Form states
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  
  // Admin user form states (only for new site creation)
  const [adminUsername, setAdminUsername] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Query to fetch sites
  const { data: sitesData, isLoading } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const res = await axios.get("/sites");
      return res.data;
    },
  });

  // Mutation to create site
  const { mutate: createSiteMutate, isPending: isCreating } = useMutation({
    mutationFn: async (data) => {
      const siteRes = await axios.post("/sites", {
        name: data.name,
        url: data.url,
        description: data.description,
      });

      const newSite = siteRes.data.site;

      // If admin details are provided, register the admin user linked to this site
      if (data.adminUsername && data.adminEmail && data.adminPassword) {
        await axios.post("/auth/register", {
          userName: data.adminUsername,
          email: data.adminEmail,
          password: data.adminPassword,
          role: "admin",
          siteId: newSite._id,
        });
      }
      return siteRes.data;
    },
    onSuccess: () => {
      toast.success("Site and Admin registered successfully");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      closeModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create site");
    },
  });

  // Mutation to update site
  const { mutate: updateSiteMutate, isPending: isUpdating } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.put(`/sites/${data.id}`, {
        name: data.name,
        url: data.url,
        description: data.description,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Site updated successfully");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      closeModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update site");
    },
  });

  // Mutation to delete site
  const { mutate: deleteSiteMutate } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/sites/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Site deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete site");
    },
  });

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedSite(null);
    setSiteName("");
    setSiteUrl("");
    setSiteDescription("");
    setAdminUsername("");
    setAdminEmail("");
    setAdminPassword("");
    setIsModalOpen(true);
  };

  const openEditModal = (site) => {
    setIsEditing(true);
    setSelectedSite(site);
    setSiteName(site.name);
    setSiteUrl(site.url);
    setSiteDescription(site.description || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!siteName) {
      toast.error("Site Name is required");
      return;
    }

    if (isEditing) {
      updateSiteMutate({
        id: selectedSite._id,
        name: siteName,
        url: siteUrl,
        description: siteDescription,
      });
    } else {
      createSiteMutate({
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        adminUsername,
        adminEmail,
        adminPassword,
      });
    }
  };

  const handleDeleteClick = (site) => {
    setSiteToDelete(site);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (siteToDelete) {
      deleteSiteMutate(siteToDelete._id);
      setIsDeleteModalOpen(false);
      setSiteToDelete(null);
    }
  };

  const sites = sitesData?.sites || [];

  return (
    <div className="p-1 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaGlobe className="text-primary" /> Tenant Sites Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create and manage isolated tenant sites and their local administrators.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-all active:scale-95 text-sm shrink-0"
        >
          <FaPlus /> Add Site & Admin
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader size="md" color="red" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <div
              key={site._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[80%]">
                    {site.name}
                  </h3>
                  {site.isMain && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                      Main Site
                    </span>
                  )}
                </div>
                <p className="text-xs text-primary font-semibold mb-3 truncate">
                  <a href={site.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {site.url}
                  </a>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-6">
                  {site.description || "No description provided."}
                </p>
              </div>

              <div className="flex justify-end items-center gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                <Link
                  to={`/dashboard/sites/view/${site._id}`}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/50 rounded-xl font-bold transition text-xs shadow-sm flex items-center gap-1 mr-auto"
                >
                  <FaUserShield /> Admins & Details
                </Link>
                <button
                  onClick={() => openEditModal(site)}
                  className="p-2 text-gray-500 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Edit Site Details"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                {!site.isMain && (
                  <button
                    onClick={() => handleDeleteClick(site)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete Site"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {isEditing ? "Edit Site Details" : "Create New Site & Admin"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Site Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g. Lodge Alpha Chapter"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-primary dark:bg-gray-800 dark:text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Site URL / Hostname
                </label>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="e.g. http://localhost:5173"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-primary dark:bg-gray-800 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="Brief description of the site"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-primary dark:bg-gray-800 dark:text-white text-sm"
                  rows={2}
                />
              </div>

              {!isEditing && (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <FaUserShield className="text-primary" /> Create Initial Site Admin User
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Admin Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="e.g. lodge_alpha_admin"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-primary dark:bg-gray-800 dark:text-white text-xs"
                      required={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Admin Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="e.g. admin@lodgealpha.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-primary dark:bg-gray-800 dark:text-white text-xs"
                      required={!isEditing}
                    />
                  </div>

                   <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Admin Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? "text" : "password"}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter temporary password"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-primary dark:bg-gray-800 dark:text-white text-xs"
                        required={!isEditing}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {showAdminPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating || isUpdating ? "Saving..." : "Save details"}
                </button>
              </div>
            </form>
          </div>
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
          Are you sure you want to delete <strong>{siteToDelete?.name}</strong>? All tenant separation will remain but the site will be disabled.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete Site
          </Button>
        </Group>
      </Modal>
    </div>
  );
}

export default SitesList;
