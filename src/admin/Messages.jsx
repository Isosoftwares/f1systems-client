import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { Modal, Button as MantineButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  PaperAirplaneIcon,
  UsersIcon,
  CommandLineIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  SparklesIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

function Messages() {
  const axiosPrivate = useAxiosPrivate();
  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await axiosPrivate.get("/companies");
      return res.data.data;
    },
  });
  const activeCompany = companies?.find((c) => c.isDefault);

  // Sample Templates
  const SMS_TEMPLATES = [
    {
      id: "service_reminder",
      name: "Service Reminder",
      text: `Dear Customer, this is a friendly reminder that your vehicle is due for service. Please contact ${activeCompany?.name || "Ruiru Auto Garage"} on ${activeCompany?.phone || "0700000000"} to book your slot. Thank you!`,
    },
    {
      id: "ready_for_pickup",
      name: "Vehicle Ready",
      text: `Dear Customer, we are pleased to inform you that your vehicle is ready for pickup. You can view your invoice in the client portal. Thank you for choosing ${activeCompany?.name || "Ruiru Auto Garage"}!`,
    },
    {
      id: "invoice_payment",
      name: "Payment Reminder",
      text: `Dear Customer, your invoice is ready. Kindly make the payment via ${activeCompany?.bankDetails?.bankName || "our bank"} A/C ${activeCompany?.bankDetails?.accountNumber || ""} (${activeCompany?.bankDetails?.accountName || ""}) to facilitate vehicle release. Thank you, ${activeCompany?.name || "Ruiru Auto Garage"}.`,
    },
    {
      id: "holiday_greetings",
      name: "Holiday Greetings",
      text: `Dear Customer, ${activeCompany?.name || "Ruiru Auto Garage"} wishes you a happy and safe holiday season! We value your partnership and look forward to serving you. Stay safe on the roads!`,
    },
  ];

  // State variables
  const [activeTab, setActiveTab] = useState("clients"); // 'clients' | 'manual'
  const [sendToAll, setSendToAll] = useState(false); // inside 'clients' tab: send to all active clients or select individually
  const [selectedClientIds, setSelectedClientIds] = useState(new Set());
  const [manualNumbers, setManualNumbers] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [search, setSearch] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sendResult, setSendResult] = useState(null);

  // Mantine Modal disclosure hook
  const [
    confirmModalOpened,
    { open: openConfirmModal, close: closeConfirmModal },
  ] = useDisclosure(false);

  // Fetch all clients with a high limit to allow frontend selection and filtering
  const { data: clientsData, isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients", "all-for-sms"],
    queryFn: async () => {
      const response = await axiosPrivate.get("/clients?limit=10000");
      return response.data;
    },
    keepPreviousData: true,
  });

  const clients = useMemo(() => clientsData?.data || [], [clientsData]);

  // Client search filter
  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const query = search.toLowerCase();
    return clients.filter(
      (client) =>
        (client.firstName || "").toLowerCase().includes(query) ||
        (client.lastName || "").toLowerCase().includes(query) ||
        (client.phone || "").includes(query) ||
        (client.email || "").toLowerCase().includes(query),
    );
  }, [clients, search]);

  // Checkbox handlers
  const handleSelectClient = (id) => {
    setSelectedClientIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    setSelectedClientIds((prev) => {
      const next = new Set(prev);
      const allSelected = filteredClients.every((c) => next.has(c._id));

      if (allSelected) {
        filteredClients.forEach((c) => next.delete(c._id));
      } else {
        filteredClients.forEach((c) => next.add(c._id));
      }
      return next;
    });
  };

  // Template change handler
  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    if (templateId) {
      const found = SMS_TEMPLATES.find((t) => t.id === templateId);
      if (found) {
        setMessageText(found.text);
      }
    }
  };

  // Manual list parser
  const manualList = useMemo(() => {
    if (!manualNumbers.trim()) return [];
    return manualNumbers
      .split(/[\n,]+/)
      .map((num) => num.trim())
      .filter((num) => num.length > 0);
  }, [manualNumbers]);

  // Total recipient count resolver
  const recipientCount = useMemo(() => {
    if (activeTab === "clients") {
      return sendToAll ? clients.length : selectedClientIds.size;
    }
    if (activeTab === "manual") return manualList.length;
    return 0;
  }, [
    activeTab,
    sendToAll,
    clients.length,
    selectedClientIds.size,
    manualList,
  ]);

  // Chunks calculation (100 size batches)
  const batchesCount = Math.ceil(recipientCount / 100) || 0;

  // Character & Multi-part SMS logic
  const characterCount = messageText.length;
  const smsParts = useMemo(() => {
    if (characterCount === 0) return 0;
    if (characterCount <= 160) return 1;
    return Math.ceil(characterCount / 153);
  }, [characterCount]);

  // Form submit interceptor (shows modal)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (recipientCount === 0) {
      toast.error("Please specify at least one recipient.");
      return;
    }
    if (!messageText.trim()) {
      toast.error("Please enter the SMS text message.");
      return;
    }
    openConfirmModal();
  };

  // Actual execution method
  const executeSendSMS = async () => {
    setIsSending(true);
    setProgress(10);
    setSendResult(null);

    // Simulated progress tick since the server resolves all batches sequentially.
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 400);

    try {
      const payload = {
        message: messageText,
        recipients:
          activeTab === "clients"
            ? sendToAll
              ? "all"
              : Array.from(selectedClientIds)
            : [],
        manualNumbers: activeTab === "manual" ? manualList : [],
      };

      const response = await axiosPrivate.post("/sms/send-bulk", payload);

      clearInterval(progressInterval);
      setProgress(100);

      if (response.data?.success) {
        toast.success("SMS dispatch completed successfully!");
        setSendResult(response.data.data);

        // Reset state on success
        if (activeTab === "clients") {
          setSelectedClientIds(new Set());
          setSendToAll(false);
        } else if (activeTab === "manual") {
          setManualNumbers("");
        }
        setMessageText("");
        setSelectedTemplate("");
      } else {
        toast.error(response.data?.message || "Failed to dispatch messages.");
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      console.error("Bulk Send SMS Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Internal server error dispatching SMS.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mantine Custom Confirmation Modal */}
      <Modal
        opened={confirmModalOpened}
        onClose={closeConfirmModal}
        title={
          <span className="font-bold text-gray-800 dark:text-white text-base">
            Confirm Bulk SMS Dispatch
          </span>
        }
        centered
        overlayProps={{
          backgroundOpacity: 0.6,
          blur: 4,
        }}
        styles={{
          header: {
            borderBottom: "1px solid rgb(229 231 235)",
            paddingBottom: "12px",
            backgroundColor: "transparent",
          },
          body: {
            paddingTop: "16px",
          },
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You are about to dispatch this SMS to{" "}
            <span className="font-extrabold text-primary">
              {recipientCount}
            </span>{" "}
            recipients.
          </p>
          <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 p-3 rounded-lg border border-amber-500/20 text-xs font-semibold">
            ⚠️ The dispatch will be processed in{" "}
            <span className="font-extrabold">{batchesCount}</span> sequential
            batch(es) of up to 100 numbers per query to prevent server overload.
          </div>

          <div className="bg-gray-50 dark:bg-dark p-3.5 rounded-xl border border-gray-150 dark:border-gray-850">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Message Text Verification:
            </p>
            <p className="text-xs text-gray-800 dark:text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
              {messageText}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-850">
            <MantineButton
              variant="outline"
              color="gray"
              onClick={closeConfirmModal}
              disabled={isSending}
              size="xs"
            >
              Cancel
            </MantineButton>
            <MantineButton
              color="red"
              onClick={async () => {
                closeConfirmModal();
                await executeSendSMS();
              }}
              loading={isSending}
              size="xs"
            >
              Proceed & Send
            </MantineButton>
          </div>
        </div>
      </Modal>

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Bulk SMS Portal
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Dispatch announcements, notifications, and reminders to clients or
            custom numbers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recipients Pane (Left Column) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-lighter rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-[680px]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-lighter/50">
            <h2 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-primary" />
              1. Choose Recipients
            </h2>

            {/* Tabs Selector */}
            <div className="flex bg-gray-100 dark:bg-dark p-1 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("clients");
                  setSendResult(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                  activeTab === "clients"
                    ? "bg-white dark:bg-dark-lighter text-primary shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                <UsersIcon className="w-4 h-4" />
                Clients ({sendToAll ? clients.length : selectedClientIds.size})
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("manual");
                  setSendResult(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                  activeTab === "manual"
                    ? "bg-white dark:bg-dark-lighter text-primary shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                <CommandLineIcon className="w-4 h-4" />
                Manual Numbers ({manualList.length})
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            {/* TAB CLIENTS */}
            {activeTab === "clients" && (
              <div className="space-y-4 flex flex-col h-full">
                {/* Send To All Toggle Card */}
                <div className="bg-gray-55 dark:bg-dark p-4 rounded-xl border border-gray-100 dark:border-gray-850 flex items-center justify-between shadow-sm">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                      Send to All Clients
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Send to all {clients.length} active clients in the
                      database.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendToAll}
                      onChange={(e) => {
                        setSendToAll(e.target.checked);
                        setSendResult(null);
                      }}
                      className="sr-only peer animate-none"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    disabled={sendToAll}
                    placeholder={
                      sendToAll
                        ? "All clients selected. Disable toggle to search & select..."
                        : "Filter clients by name, email, or number..."
                    }
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-dark text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="absolute left-3.5 top-2.5 text-gray-400">
                    🔍
                  </div>
                  {search && !sendToAll && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {isLoadingClients ? (
                  <div className="flex-1 flex flex-col justify-center items-center py-12 text-gray-500">
                    <ArrowPathIcon className="w-8 h-8 animate-spin text-primary mb-2" />
                    <p className="text-sm">Fetching clients database...</p>
                  </div>
                ) : filteredClients.length === 0 ? (
                  <div className="flex-1 flex flex-col justify-center items-center py-12 text-gray-500">
                    <p className="text-sm">
                      No clients match your filter query.
                    </p>
                  </div>
                ) : (
                  <div
                    className={`flex-1 overflow-y-auto border border-gray-150 dark:border-gray-800 rounded-lg min-h-0 bg-white dark:bg-dark transition-opacity duration-300 ${sendToAll ? "opacity-60 select-none" : ""}`}
                  >
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-gray-50 dark:bg-dark-lighter text-gray-600 dark:text-gray-400 font-bold sticky top-0 border-b border-gray-100 dark:border-gray-800 z-10">
                        <tr>
                          <th className="px-4 py-2.5 w-10">
                            <input
                              type="checkbox"
                              disabled={sendToAll}
                              checked={
                                sendToAll ||
                                (filteredClients.length > 0 &&
                                  filteredClients.every((c) =>
                                    selectedClientIds.has(c._id),
                                  ))
                              }
                              onChange={handleSelectAllFiltered}
                              className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer disabled:cursor-not-allowed"
                            />
                          </th>
                          <th className="px-4 py-2.5">Name</th>
                          <th className="px-4 py-2.5">Phone Number</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredClients.map((client) => {
                          const isSelected = selectedClientIds.has(client._id);
                          return (
                            <tr
                              key={client._id}
                              onClick={() =>
                                !sendToAll && handleSelectClient(client._id)
                              }
                              className={`hover:bg-gray-50 dark:hover:bg-dark-lighter/40 transition-colors ${
                                !sendToAll
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                              } ${isSelected || sendToAll ? "bg-primary/5 dark:bg-primary/5" : ""}`}
                            >
                              <td
                                className="px-4 py-2.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  disabled={sendToAll}
                                  checked={sendToAll || isSelected}
                                  onChange={() =>
                                    !sendToAll && handleSelectClient(client._id)
                                  }
                                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer disabled:cursor-not-allowed"
                                />
                              </td>
                              <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-gray-200">
                                {client.firstName} {client.lastName}
                              </td>
                              <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">
                                {client.phone}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB MANUAL NUMBERS */}
            {activeTab === "manual" && (
              <div className="space-y-4 flex flex-col h-full">
                <div className="flex-1 flex flex-col min-h-0">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                    Enter numbers manually (one per line, or separated by
                    commas)
                  </label>
                  <textarea
                    rows={12}
                    value={manualNumbers}
                    onChange={(e) => setManualNumbers(e.target.value)}
                    placeholder="e.g.&#10;0712345678&#10;0787654321, 254799887766"
                    className="flex-1 w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-dark text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm resize-none"
                  />
                </div>

                {manualList.length > 0 && (
                  <div className="bg-gray-50 dark:bg-dark-lighter p-3 rounded-lg border border-gray-150 dark:border-gray-800">
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Parsed Numbers Preview ({manualList.length}):
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {manualList.map((num, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-gray-200 dark:bg-dark text-gray-700 dark:text-gray-300 text-[10px] rounded font-mono"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Message Editor & dispatch logs (Right Column) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Dispatch Form */}
          <div className="bg-white dark:bg-dark-lighter rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-primary" />
              2. Compose Message
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Optional Templates */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex justify-between items-center">
                  <span>Templates (Optional)</span>
                  {selectedTemplate && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTemplate("");
                        setMessageText("");
                      }}
                      className="text-red-500 hover:text-red-600 text-[10px] font-bold"
                    >
                      Clear Template
                    </button>
                  )}
                </label>
                <select
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-dark text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm cursor-pointer"
                >
                  <option value="">-- Direct Input (No Template) --</option>
                  {SMS_TEMPLATES.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Editor */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block">
                  Verify & Edit Final Message Text{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your text message here..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-dark text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-y"
                />

                {/* Character & Part Counter */}
                <div className="flex justify-between items-center text-[11px] font-medium text-gray-500 dark:text-gray-400 px-1">
                  <span>
                    Characters:{" "}
                    <span
                      className={
                        characterCount > 160 ? "text-amber-500 font-bold" : ""
                      }
                    >
                      {characterCount}
                    </span>
                  </span>
                  <span>
                    SMS Parts:{" "}
                    <span
                      className={smsParts > 1 ? "text-amber-500 font-bold" : ""}
                    >
                      {smsParts}
                    </span>{" "}
                    ({characterCount <= 160 ? "160 max" : "153 chars/part"})
                  </span>
                </div>
              </div>

              {/* Summary Box */}
              <div className="bg-gray-55 dark:bg-dark p-4 rounded-xl space-y-2 border border-gray-100 dark:border-gray-855">
                <h4 className="text-xs font-bold text-gray-750 dark:text-gray-300">
                  Dispatch Summary
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">
                      Recipients count:
                    </span>
                    <span className="font-bold text-gray-850 dark:text-gray-200 text-sm">
                      {recipientCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">
                      Batching Segmentation:
                    </span>
                    <span className="font-bold text-gray-850 dark:text-gray-200 text-sm">
                      {batchesCount} batch(es){" "}
                      <span className="text-[10px] text-gray-400">
                        (max 100/batch)
                      </span>
                    </span>
                  </div>
                </div>

                {recipientCount > 100 && (
                  <div className="text-[10px] text-amber-500 font-semibold bg-amber-500/10 p-2 rounded border border-amber-500/20">
                    ⚠️ Note: Since you are sending to &gt; 100 numbers, the
                    system will batch sending into segments of 100 to prevent
                    system timeout/overload.
                  </div>
                )}
              </div>

              {/* Loader / Progress Bar */}
              {isSending && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500 font-bold">
                    <span>Sending in batches...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <button
                type="submit"
                disabled={
                  isSending || recipientCount === 0 || !messageText.trim()
                }
                className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold text-white transition-all shadow-md active:scale-[0.98] ${
                  isSending || recipientCount === 0 || !messageText.trim()
                    ? "bg-gray-300 dark:bg-gray-850 text-gray-500 cursor-not-allowed shadow-none"
                    : "bg-primary hover:bg-primary/95 shadow-primary/20 hover:shadow-primary/30"
                }`}
              >
                {isSending ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    Processing Dispatches...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5" />
                    Verify and Send SMS
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Summary Logs (Rendered on successful dispatch) */}
          {sendResult && (
            <div className="bg-white dark:bg-dark-lighter rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-3">
              <h3 className="font-bold text-gray-855 dark:text-white text-sm flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                Dispatch Results Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1.5">
                  <span className="text-gray-500">Total processed:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {sendResult.totalRecipients}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1.5">
                  <span className="text-gray-500">Successful dispatches:</span>
                  <span className="font-bold text-green-600">
                    {sendResult.successCount}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1.5">
                  <span className="text-gray-500">Failed dispatches:</span>
                  <span
                    className={`font-bold ${sendResult.failureCount > 0 ? "text-red-500" : "text-gray-500"}`}
                  >
                    {sendResult.failureCount}
                  </span>
                </div>
              </div>

              {sendResult.results && sendResult.results.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                    Batch Logs
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto text-[10px]">
                    {sendResult.results.map((r, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded flex justify-between items-center ${
                          r.status === "success"
                            ? "bg-green-500/10 text-green-600 dark:bg-green-500/5"
                            : "bg-red-500/10 text-red-500 dark:bg-red-500/5"
                        }`}
                      >
                        <span>
                          Batch {r.batchNumber} ({r.count} numbers)
                        </span>
                        <span className="capitalize font-bold">{r.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
