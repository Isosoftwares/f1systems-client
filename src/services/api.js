import useAxiosPrivate from "../hooks/useAxiosPrivate";

const createDashboardAPI = (api) => ({
  getOverview: (params) => api.get("/dashboard/overview", { params }),
  getQuickStats: (params) => api.get("/dashboard/quick-stats", { params }),
  getRecentActivities: (params) =>
    api.get("/dashboard/recent-activities", { params }),
});

const createAnalyticsAPI = (api) => ({
  getRevenueTrends: (params) =>
    api.get("/dashboard/analytics/revenue", { params }),
});

export const useApi = () => {
  const api = useAxiosPrivate();

  return {
    dashboard: createDashboardAPI(api),
    analytics: createAnalyticsAPI(api),
  };
};
