import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaHome,
  FaSignOutAlt,
  FaBars,
  FaMoon,
  FaSun,
  FaTimes,
  FaMap,
  FaUserFriends,
  FaUserShield,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const SidebarLink = ({ item, isActive, onClick, isCollapsed }) => (
  <Link
    to={item.path}
    onClick={onClick}
    className={`group flex items-center gap-3 px-4 py-3 my-1 mx-2 rounded-xl transition-all duration-300 ${
      isActive
        ? "bg-primary text-white shadow-lg shadow-primary/30 translate-x-1"
        : "text-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary"
    }`}
  >
    <div
      className={`text-lg transition-transform duration-300 ${
        isActive ? "scale-110" : "group-hover:scale-110"
      }`}
    >
      {item.icon}
    </div>
    <span
      className={`font-medium tracking-wide transition-all duration-300 ${
        isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
      }`}
    >
      {item.name}
    </span>
    {isActive && !isCollapsed && (
      <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
    )}
  </Link>
);

const Drawer = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex lg:hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`relative w-64 bg-white dark:bg-gray-900 h-full shadow-2xl transform transition-transform duration-300 ease-out border-r border-gray-200 dark:border-gray-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 transition-colors"
        >
          <FaTimes />
        </button>
        {children}
      </div>
    </div>
  );
};

function AdminDashboard() {
  const { auth } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const logOut = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const signOut = async () => {
    await logOut();
    navigate("/");
  };

  const menuItems = [];

  menuItems.push(
    { name: "Overview", path: "/dashboard/overview", icon: <FaHome /> },
    { name: "Members Ledger", path: "/dashboard/members", icon: <FaUsers /> },
    { name: "Lodge Locations", path: "/dashboard/lodges", icon: <FaMap /> },
    {
      name: "Grandmasters",
      path: "/dashboard/grandmasters",
      icon: <FaUserFriends />,
    },
  );

  if (auth?.user?.role === "super_admin") {
    menuItems.push({
      name: "Sites",
      path: "/dashboard/sites",
      icon: <FaUserShield />,
    });
  }

  const MenuContent = () => (
    <div className="flex flex-col h-full">
      {/* Branding */}
      <div className="h-20 flex items-center gap-3 px-6 border-b-2 border-b-primary">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-md shadow-primary/20 shrink-0">
          G
        </div>
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          <h1 className="text-lg font-bold text-primary">
            Ledger Portal
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase">
            Brotherhood Admin
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 overflow-y-auto no-scrollbar">
        {!isSidebarCollapsed && (
          <p className="px-6 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Ledger Menu
          </p>
        )}

        {menuItems.map((item) => (
          <SidebarLink
            key={item.path}
            item={item}
            isActive={
              pathname.startsWith(item.path) ||
              (item.path === "/dashboard/overview" && pathname === "/dashboard")
            }
            onClick={() => setIsMobileMenuOpen(false)}
            isCollapsed={isSidebarCollapsed}
          />
        ))}
      </div>

      {/* User Logic (Bottom) */}
      <div
        className={`p-4 border-t border-dashed border-gray-200 dark:border-gray-800 ${
          isSidebarCollapsed ? "items-center" : ""
        }`}
      >
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 ${
            isSidebarCollapsed
              ? "justify-center p-0 bg-transparent border-0"
              : ""
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 shrink-0">
            {auth?.user?.userName?.[0]?.toUpperCase() || "A"}
          </div>

          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <Link
                to="/dashboard/profile"
                className="text-sm font-bold text-gray-800 dark:text-white truncate block hover:text-primary transition-colors cursor-pointer"
                title="View Profile"
              >
                {auth?.user?.userName}
              </Link>
              <button
                onClick={signOut}
                className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar (Desktop) */}
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl z-30 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-24" : "w-72"
        }`}
      >
        <MenuContent />
      </aside>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        <MenuContent />
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Navbar */}
        <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 z-20 sticky top-0 transition-colors duration-300">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 mr-2 sm:mr-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors shrink-0"
            >
              <FaBars className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex p-2 text-gray-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg shrink-0"
            >
              <FaBars className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-gray-800 dark:text-white hidden sm:block truncate">
              {getGreeting(auth?.user?.userName)}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="text-sm font-semibold px-3 py-1 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400">
              {auth?.user?.role === "super_admin"
                ? "Grand Lodge Admin"
                : "Site Admin"}
            </span>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-amber-400 transition-all duration-300 shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </button>

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

            <button
              onClick={signOut}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95"
            >
              <span>Logout</span>
              <FaSignOutAlt />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-black/20 p-4 lg:p-8 scroll-smooth">
          <div className="min-h-full pb-10 animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;

function getGreeting(name) {
  const hour = new Date().getHours();
  let greeting = "Good Morning";
  if (hour >= 12) greeting = "Good Afternoon";
  if (hour >= 17) greeting = "Good Evening";
  return name ? `${greeting}, ${name}` : greeting;
}
