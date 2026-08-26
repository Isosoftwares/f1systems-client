import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { Modal, Button, Text, Group, Stack, Badge, Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  EllipsisVerticalIcon,
  MapPinIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

function ActiveSessions() {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [loadingSessionId, setLoadingSessionId] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [sessionToTerminate, setSessionToTerminate] = useState(null);

  // Fetch active sessions
  const fetchSessions = async () => {
    const response = await axios.get("/auth/sessions");
    return response.data;
  };

  const {
    data: sessionsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["active-sessions"],
    queryFn: fetchSessions,
    retry: 1,
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch sessions";
      toast.error(errorMessage);
    },
  });

  // Delete session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId) => {
      setLoadingSessionId(sessionId);
      return await axios.delete(`/auth/sessions/${sessionId}`);
    },
    onSuccess: () => {
      toast.success("Session terminated successfully");
      queryClient.invalidateQueries(["active-sessions"]);
      setLoadingSessionId(null);
      close();
      setSessionToTerminate(null);
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to terminate session";
      toast.error(errorMessage);
      setLoadingSessionId(null);
      close();
      setSessionToTerminate(null);
    },
  });

  
  const sessions = sessionsData?.data?.sessions || [];

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeviceIcon = (device) => {
    const deviceLower = device?.toLowerCase() || "";
    if (deviceLower.includes("mobile") || deviceLower.includes("phone")) {
      return DevicePhoneMobileIcon;
    }
    if (deviceLower.includes("tablet") || deviceLower.includes("ipad")) {
      return DeviceTabletIcon;
    }
    return ComputerDesktopIcon;
  };

  const getLocationString = (region) => {
    if (!region) return "Unknown Location";
    const parts = [];
    if (region.city) parts.push(region.city);
    if (region.region) parts.push(region.region);
    if (region.country) parts.push(region.country);
    return parts.join(", ") || "Unknown Location";
  };

  const getRiskColor = (riskScore) => {
    if (riskScore >= 70) return "text-red-600 bg-red-100";
    if (riskScore >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const handleTerminateSession = (session) => {
    setSessionToTerminate(session);
    open();
  };

  const confirmTermination = () => {
    if (sessionToTerminate) {
      deleteSessionMutation.mutate(sessionToTerminate.sessionId);
    }
  };

  const getSessionDisplayInfo = (session) => {
    const device = session.device || "Unknown Device";
    const location = getLocationString(session.region);
    const browser = session.browser || "Unknown Browser";
    return { device, location, browser };
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Sessions
          </h3>
          <p className="text-red-600 mb-4">
            {error?.response?.data?.message ||
              error?.message ||
              "An unexpected error occurred"}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ShieldCheckIcon className="h-6 w-6 mr-3 text-green-600" />
          Active Sessions ({sessions.length})
        </h3>
        <button
          onClick={() => refetch()}
          className="text-sm text-primary font-medium"
        >
          Refresh
        </button>
      </div>

      {!sessions?.length ? (
        <div className="text-center py-8">
          <ShieldCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No active sessions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions?.map((session) => {
            const DeviceIcon = getDeviceIcon(session.device);
            const isCurrentSession = session.isCurrent; // You might want to add current session detection
            const isLoading = loadingSessionId === session.sessionId;

            return (
              <div
                key={session.sessionId}
                className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                  isCurrentSession
                    ? "border-primary bg-primary/5"
                    : "border-gray-200"
                } ${session.isSuspicious ? "border-orange-300 bg-orange-50" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Device Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <DeviceIcon className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>

                    {/* Session Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {session.device || "Unknown Device"}
                        </h4>
                        {isCurrentSession && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Current Session
                          </span>
                        )}
                        {session.isSuspicious && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <ShieldExclamationIcon className="h-3 w-3 mr-1" />
                            Suspicious
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-1">
                          <GlobeAltIcon className="h-4 w-4 text-gray-400" />
                          <span>{session.browser || "Unknown Browser"}</span>
                          <span className="text-gray-400">•</span>
                          <span>{session.os || "Unknown OS"}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="h-4 w-4 text-gray-400" />
                          <span>{getLocationString(session.region)}</span>
                          {session.region?.isp && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500">
                                {session.region.isp}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span>Login: {formatDate(session.loginTime)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Last Active: {formatDate(session.lastActivity)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <span className="text-gray-400">IP:</span>
                          <span className="font-mono text-xs">
                            {session.ipAddress}
                          </span>
                          {session.riskScore > 0 && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(
                                  session.riskScore
                                )}`}
                              >
                                Risk: {session.riskScore}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {!isCurrentSession && (
                      <button
                        onClick={() => handleTerminateSession(session)}
                        disabled={isLoading}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full mr-2"></div>
                        ) : (
                          <TrashIcon className="h-4 w-4 mr-2" />
                        )}
                        {isLoading ? "Terminating..." : "Terminate"}
                      </button>
                    )}

                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <EllipsisVerticalIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Session Method & Expiry */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>
                      Method:{" "}
                      <span className="font-medium">
                        {session.loginMethod || "password"}
                      </span>
                    </span>
                    <span>
                      Expires: {formatDate(session.expiresAt)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        session.isActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="font-medium">
                      {session.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-900 font-medium mb-1">Security Notice</p>
            <p className="text-blue-700">
              Monitor your active sessions regularly. If you notice any
              suspicious activity or unrecognized devices, terminate those
              sessions immediately and change your password.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={<Text fw={600} size="lg">Terminate Session</Text>}
        centered
        size="md"
        padding="xl"
        radius="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Stack spacing="lg">
          {/* Warning Icon */}
          <Center>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
          </Center>

          {/* Content */}
          <Stack spacing="md" align="center">
            <Text size="md" fw={500} ta="center">
              Are you sure you want to terminate this session?
            </Text>

            {sessionToTerminate && (
              <div className="w-full p-4 bg-gray-50 rounded-lg border">
                <Stack spacing="xs">
                  <Group position="apart">
                    <Text size="sm" color="dimmed">Device:</Text>
                    <Text size="sm" fw={500}>{getSessionDisplayInfo(sessionToTerminate).device}</Text>
                  </Group>
                  <Group position="apart">
                    <Text size="sm" color="dimmed">Browser:</Text>
                    <Text size="sm" fw={500}>{getSessionDisplayInfo(sessionToTerminate).browser}</Text>
                  </Group>
                  <Group position="apart">
                    <Text size="sm" color="dimmed">Location:</Text>
                    <Text size="sm" fw={500}>{getSessionDisplayInfo(sessionToTerminate).location}</Text>
                  </Group>
                  <Group position="apart">
                    <Text size="sm" color="dimmed">IP Address:</Text>
                    <Text size="sm" fw={500} ff="monospace">{sessionToTerminate.ipAddress}</Text>
                  </Group>
                  {sessionToTerminate.isSuspicious && (
                    <Center mt="xs">
                      <Badge color="orange" variant="filled" size="sm">
                        <ShieldExclamationIcon className="h-3 w-3 mr-1" />
                        Suspicious Activity Detected
                      </Badge>
                    </Center>
                  )}
                </Stack>
              </div>
            )}

            <Text size="sm" color="dimmed" ta="center">
              This action cannot be undone. The user will be logged out from this device immediately.
            </Text>
          </Stack>

          {/* Action Buttons */}
          <Group position="center" spacing="md" mt="lg">
            <Button
              variant="outline"
              color="gray"
              onClick={close}
              size="md"
              disabled={loadingSessionId !== null}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={confirmTermination}
              loading={loadingSessionId === sessionToTerminate?.sessionId}
              size="md"
              leftIcon={<TrashIcon className="h-4 w-4" />}
            >
              Terminate Session
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}

export default ActiveSessions;