import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Modal, Button, Group, Text } from "@mantine/core";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaEdit, FaUserTie, FaImage } from "react-icons/fa";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { BASE_API_URL } from "../../api/axios";

function GrandmasterList() {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGM, setSelectedGM] = useState(null);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [gmToDelete, setGMToDelete] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [lodgeNo, setLodgeNo] = useState("");
  const [history, setHistory] = useState("");
  const [pictureFile, setPictureFile] = useState(null);
  const [picturePreview, setPicturePreview] = useState("");

  // Query to fetch grandmasters
  const { data: gmData, isLoading } = useQuery({
    queryKey: ["grandmasters"],
    queryFn: async () => {
      const res = await axios.get("/grandmasters");
      return res.data;
    },
  });

  // Mutation to create grandmaster (multipart/form-data)
  const { mutate: createGMMutate, isPending: isCreating } = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post("/grandmasters", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Grandmaster added successfully");
      queryClient.invalidateQueries({ queryKey: ["grandmasters"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      closeModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create Grandmaster");
    },
  });

  // Mutation to update grandmaster (multipart/form-data)
  const { mutate: updateGMMutate, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await axios.put(`/grandmasters/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Grandmaster details updated");
      queryClient.invalidateQueries({ queryKey: ["grandmasters"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      closeModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update Grandmaster");
    },
  });

  // Mutation to delete grandmaster
  const { mutate: deleteGMMutate } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/grandmasters/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Grandmaster deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["grandmasters"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete Grandmaster");
    },
  });

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedGM(null);
    setName("");
    setLodgeNo("");
    setHistory("");
    setPictureFile(null);
    setPicturePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (gm) => {
    setIsEditing(true);
    setSelectedGM(gm);
    setName(gm.name);
    setLodgeNo(gm.lodgeNo);
    setHistory(gm.history || "");
    setPictureFile(null);
    setPicturePreview(gm.picture ? `${BASE_API_URL}/${gm.picture}` : "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPictureFile(file);
      setPicturePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !lodgeNo) {
      toast.error("Name and Lodge Number are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("lodgeNo", lodgeNo);
    formData.append("history", history);
    if (pictureFile) {
      formData.append("picture", pictureFile);
    }

    if (isEditing) {
      updateGMMutate({ id: selectedGM._id, formData });
    } else {
      createGMMutate(formData);
    }
  };

  const handleDeleteClick = (gm) => {
    setGMToDelete(gm);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (gmToDelete) {
      deleteGMMutate(gmToDelete._id);
      setIsDeleteModalOpen(false);
      setGMToDelete(null);
    }
  };

  const grandmasters = gmData?.grandmasters || [];

  return (
    <div className="p-1 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaUserTie className="text-primary" /> Grandmasters & Mentors
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage information and historical records of Grandmasters and Mentors connected to this site.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-all active:scale-95 text-sm shrink-0"
        >
          <FaPlus /> Add Grandmaster
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader size="md" color="red" />
        </div>
      ) : grandmasters.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center shadow-sm">
          <FaUserTie className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Grandmasters Found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Get started by adding details of your chapter's leadership.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg text-sm shadow-md hover:bg-primary/90 transition-all"
          >
            <FaPlus /> Add Grandmaster
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grandmasters.map((gm) => (
            <div
              key={gm._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex gap-4 items-center mb-4">
                  {gm.picture ? (
                    <img
                      src={`${BASE_API_URL}/${gm.picture}`}
                      alt={gm.name}
                      className="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-800 dark:text-amber-400 border border-amber-200/40 dark:border-amber-700/30 shrink-0">
                      <FaUserTie className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight">
                      {gm.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Lodge No: {gm.lodgeNo}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
                  {gm.history || "No historical record entered."}
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-800/40">
                <button
                  onClick={() => openEditModal(gm)}
                  className="p-1.5 text-gray-500 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(gm)}
                  className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full shadow-2xl p-6 relative">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {isEditing ? "Edit Grandmaster/Mentor" : "Add Grandmaster/Mentor"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Picture upload */}
              <div className="flex items-center gap-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-4">
                {picturePreview ? (
                  <img
                    src={picturePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-850 flex items-center justify-center text-gray-400 dark:text-gray-600 border border-dashed border-gray-300 dark:border-gray-700">
                    <FaImage className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-primary hover:underline cursor-pointer">
                    Upload Portrait Picture
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-gray-500 mt-0.5">JPEG, PNG up to 5MB</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. RW Bro. John Doe"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-primary dark:bg-gray-800 dark:text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Lodge Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lodgeNo}
                  onChange={(e) => setLodgeNo(e.target.value)}
                  placeholder="e.g. 15 or 'Grand Lodge'"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-primary dark:bg-gray-800 dark:text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  History / Bio
                </label>
                <textarea
                  value={history}
                  onChange={(e) => setHistory(e.target.value)}
                  placeholder="History or biography of the Grandmaster"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-primary dark:bg-gray-800 dark:text-white text-sm"
                  rows={4}
                />
              </div>

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
          Are you sure you want to delete the Grandmaster profile for <strong>{gmToDelete?.name}</strong>?
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete Grandmaster
          </Button>
        </Group>
      </Modal>
    </div>
  );
}

export default GrandmasterList;
