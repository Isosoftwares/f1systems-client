import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import F404Page from "./F404Page";
import Login from "./Login";
import Unauthorized from "./Unauthorized";
import useScrollToTop from "./components/useScrollToTop";
import PasswordResetForm from "./PasswordResetForm";
import ResetPassword from "./ResetPassword";

// dashboard imports
import AdminDashboard from "./admin/AdminDashboard";
import Overview from "./admin/overview/Overview";
import UserProfile from "./admin/profile/UserProfile";
import ActiveSessions from "./admin/profile/components/ActiveSessions";

// Freemason Ledger Modules
import SitesList from "./admin/sites/SitesList";
import LodgeList from "./admin/lodges/LodgeList";
import GrandmasterList from "./admin/grandmasters/GrandmasterList";
import MemberList from "./admin/members/MemberList";
import RegisterMember from "./admin/members/RegisterMember";
import ViewMember from "./admin/members/ViewMember";
import MemberPortal from "./MemberPortal";
import ViewSite from "./admin/sites/ViewSite";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });

  useScrollToTop();
  return (
    <div className="relative">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            
            {/* Public Member Portal (No Authentication Required) */}
            <Route path="/registry/:lodgeNumber" element={<MemberPortal />} />
            
            <Route path="/*" element={<F404Page />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/reset/password" element={<PasswordResetForm />} />
            <Route
              path="/password/reset/:userType/:userId/:resetString"
              element={<ResetPassword />}
            />
            
            {/* Authenticated Dashboard */}
            <Route>
              <Route
                element={
                  <RequireAuth
                    allowedRoles={[
                      "admin",
                      "super_admin"
                    ]}
                  />
                }
              >
                <Route exact path="/dashboard" element={<AdminDashboard />}>
                  <Route index element={<Overview />} />
                  <Route path="overview" element={<Overview />} />

                   {/* Super Admin Module */}
                  <Route path="sites" element={<SitesList />} />
                  <Route path="sites/view/:id" element={<ViewSite />} />
                  
                  {/* Ledger Modules */}
                  <Route path="lodges" element={<LodgeList />} />
                  <Route path="grandmasters" element={<GrandmasterList />} />
                  <Route path="members" element={<MemberList />} />
                  <Route path="members/create" element={<RegisterMember />} />
                  <Route path="members/edit/:id" element={<RegisterMember />} />
                  <Route path="members/view/:id" element={<ViewMember />} />

                  {/* Profile & Security */}
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="security" element={<ActiveSessions />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
