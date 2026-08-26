import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Modal, Button, Group, Text } from "@mantine/core";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaEdit, FaMapMarkerAlt } from "react-icons/fa";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function LodgeList() {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLodge, setSelectedLodge] = useState(null);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lodgeToDelete, setLodgeToDelete] = useState(null);

  // Form states
  const [lodgeName, setLodgeName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [lodgeNumber, setLodgeNumber] = useState("");

  // Query to fetch lodges
  const { data: lodgesData, isLoading } = useQuery({
    queryKey: ["lodges"],
    queryFn: async () => {
      const res = await axios.get("/lodges");
      return res.data;
    },
  });

  // Mutation to create lodge
  const { mutate: createLodgeMutate, isPending: isCreating } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post("/lodges", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Lodge location created successfully");
      queryClient.invalidateQueries({ queryKey: ["lodges"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      closeModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create lodge");
    },
  });

  // Mutation to update lodge
  const { mutate: updateLodgeMutate, isPending: isUpdating } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.put(`/lodges/${data.id}`, {
        lodgeName: data.lodgeName,
        location: data.location,
        lodgeNumber: data.lodgeNumber,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Lodge location updated successfully");
      queryClient.invalidateQueries({ queryKey: ["lodges"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      closeModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update lodge");
    },
  });

  // Mutation to delete lodge
  const { mutate: deleteLodgeMutate } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/lodges/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Lodge location deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["lodges"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete lodge");
    },
  });

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedLodge(null);
    setLodgeName("");
    setLocationName("");
    setLodgeNumber("");
    setIsModalOpen(true);
  };

  const openEditModal = (lodge) => {
    setIsEditing(true);
    setSelectedLodge(lodge);
    setLodgeName(lodge.lodgeName);
    setLocationName(lodge.location);
    setLodgeNumber(lodge.lodgeNumber);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lodgeName || !locationName || !lodgeNumber) {
      toast.error("All fields are required");
      return;
    }

    if (isEditing) {
      updateLodgeMutate({
        id: selectedLodge._id,
        lodgeName,
        location: locationName,
        lodgeNumber,
      });
    } else {
      createLodgeMutate({
        lodgeName,
        location: locationName,
        lodgeNumber,
      });
    }
  };

  const handleDeleteClick = (lodge) => {
    setLodgeToDelete(lodge);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (lodgeToDelete) {
      deleteLodgeMutate(lodgeToDelete._id);
      setIsDeleteModalOpen(false);
      setLodgeToDelete(null);
    }
  };

  const lodges = lodgesData?.lodges || [];

  return (
    <div className="p-1 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaMapMarkerAlt className="text-primary" /> Lodge Locations
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Define and manage the physical lodge chapters operating within your branch.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-all active:scale-95 text-sm shrink-0"
        >
          <FaPlus /> Add Lodge Location
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader size="md" color="red" />
        </div>
      ) : lodges.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center shadow-sm">
          <FaMapMarkerAlt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Lodge Locations Found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Get started by adding your first lodge chapter.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg text-sm shadow-md hover:bg-primary/90 transition-all"
          >
            <FaPlus /> Add Lodge Location
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-4">Lodge Name</th>
                  <th className="px-6 py-4">Lodge Number</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-gray-750 text-sm text-gray-700 dark:text-gray-300">
                {lodges.map((lodge) => (
                  <tr key={lodge._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {lodge.lodgeName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border border-amber-200/40 dark:border-amber-700/30">
                        #{lodge.lodgeNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {lodge.location}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(lodge)}
                          className="p-1.5 text-gray-500 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-750 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(lodge)}
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-750 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full shadow-2xl p-6 relative">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {isEditing ? "Edit Lodge Location" : "Add Lodge Location"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Lodge Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lodgeName}
                  onChange={(e) => setLodgeName(e.target.value)}
                  placeholder="e.g. Grand Chapter of Light"
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
                  value={lodgeNumber}
                  onChange={(e) => setLodgeNumber(e.target.value)}
                  placeholder="e.g. 320"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-primary dark:bg-gray-800 dark:text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Location (City / Address) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Nairobi, Kenya"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-primary dark:bg-gray-800 dark:text-white text-sm"
                  required
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
          Are you sure you want to delete the lodge location <strong>{lodgeToDelete?.lodgeName}</strong>? All registered member records for this chapter will remain but the location option will be disabled.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete Lodge
          </Button>
        </Group>
      </Modal>
    </div>
  );
}

export default LodgeList;
