import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaEnvelope,
  FaHeart,
  FaBars,
  FaTimes,
  FaBell,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { Indicator } from "@mantine/core";
import useLogout from "../hooks/useLogout";

function NavBar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdown, setUserDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logOut = useLogout();
  const signOut = async () => {
    await logOut();
    navigate("/");
  };

  // Mock auth state for demo
  const { auth } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.pageYOffset > 10;
      setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when route changes
  useEffect(() => {
    setMobileMenu(false);
    setUserDropdown(false);
  }, [location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setUserDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleUserDropdownClick = (e) => {
    e.stopPropagation();
    setUserDropdown(!userDropdown);
  };

  const notificationCount = 4; // Mock notification count
  const savedItemsCount = 12; // Mock saved items count

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[50] py-3 transition-all duration-300 ${
          scrolled
            ? "bg-light/95 backdrop-blur-md shadow-lg border-b border-gray-100"
            : "bg-light/90 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center space-x-3 flex-shrink-0 group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <span className="text-light font-bold text-lg">MJ</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-light"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  DASOPS
                </span>
                <div className="text-xs text-gray-500 -mt-1">
                  Kenya's Marketplace
                </div>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-6">
              <form onSubmit={handleSearch} className="w-full relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search products, services, or sellers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-light  border border-gray-200 rounded-l-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-700 placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-light px-6 py-3 rounded-r-xl hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 font-medium"
                  >
                    <FaSearch className="text-lg" />
                    <span className="hidden lg:block">Search</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Desktop Navigation Icons */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Messages */}
              <Link
                to="/messages"
                className="relative p-3 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300 group"
              >
                <Indicator
                  inline
                  color="red"
                  label={notificationCount}
                  size={16}
                >
                  <FaEnvelope className="text-3xl" />
                </Indicator>

                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-900 text-light text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Messages
                </div>
              </Link>

              {/* Saved Items */}
              <Link
                to="/saved"
                className="relative p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 group"
              >
                <Indicator
                  inline
                  color="red"
                  label={notificationCount > 1 && notificationCount}
                  size={16}
                >
                  <FaHeart className="text-3xl" />
                </Indicator>

                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-900 text-light text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Saved Items
                </div>
              </Link>

              {/* User Account */}
              <div className="relative">
                {!auth?.userId ? (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-gray-600 hover:text-primary font-medium transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-primary text-light px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : auth?.user?.role === "seller" ? (
                  <Link
                    to={"/seller"}
                    className="relative p-3 gap-2 text-gray-50 flex bg-primary/90 mx-5 items-center hover:text-primary hover:bg-primary/30 rounded-lg transition-all duration-300 group"
                  >
                    <FaUserCircle className="text-lg" />
                    <div className=" ">Dashboard</div>
                  </Link>
                ) : auth?.user?.role === "buyer" ? (
                  <div>
                    <button
                      onClick={handleUserDropdownClick}
                      className="relative bg-primary text-light  p-3 gap-2 mx-4  flex items-center hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300 group"
                    >
                      <FaUserCircle className="text-xl" />
                      <div className=" ">
                        {auth?.user?.firstName ||
                          auth?.user?.lastName ||
                          "My Account"}{" "}
                      </div>
                    </button>
                  </div>
                ) : (
                  ""
                )}

                {/* User Dropdown */}
                {userDropdown && auth?.userId && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-light rounded-xl shadow-lg border border-gray-100 py-2 z-[60]">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">
                        {auth?.user?.firstName ||
                          auth?.user?.lastName ||
                          "My Account"}{" "}
                      </p>
                      <p className="text-sm text-gray-500">
                        {auth?.user?.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-light  transition-colors"
                    >
                      <FaUser className="text-gray-400" />
                      <span>My Profile</span>
                    </Link>

                    <div className="border-t border-gray-100 mt-2">
                      <button
                        onClick={signOut}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-light  transition-colors w-full text-left text-red-600"
                      >
                        <FaSignOutAlt className="text-red-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300"
            >
              {mobileMenu ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-light  border border-gray-200 rounded-l-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-700 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="bg-primary text-light px-4 py-3 rounded-r-lg hover:bg-blue-700 transition-all duration-300"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] md:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-light shadow-2xl border-l border-gray-200 z-[70] md:hidden transform transition-transform duration-300 ${
          mobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-light font-bold text-lg">MJ</span>
              </div>
              <div>
                <span className="font-bold text-gray-900">DASOPS</span>
                <div className="text-xs text-gray-500">Kenya's Marketplace</div>
              </div>
            </div>
            <button
              onClick={() => setMobileMenu(false)}
              className="p-2 text-gray-600 hover:text-red-600 rounded-lg"
            >
              <FaTimes />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="space-y-1">
            {!auth?.userId ? (
              <div className="space-y-3 mb-6">
                <Link
                  to="/login"
                  className="block w-full text-center py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-light "
                  onClick={() => setMobileMenu(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center py-3 bg-primary text-light rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  onClick={() => setMobileMenu(false)}
                >
                  Sign Up
                </Link>
              </div>
            ) : auth?.user?.role === "buyer" ? (
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-3 p-3 border-b-2 border-b-primary bg-primary/20 w-full  rounded-lg">
                  <FaUserCircle className="text-2xl text-gray-400" />
                  <div className="">
                    <p className="font-medium text-gray-900">
                      {auth?.user?.firstName ||
                        auth?.user?.lastName ||
                        "My Account"}{" "}
                    </p>
                  </div>
                </div>
                <>
                  <Link
                    to="/messages"
                    className="flex items-center justify-between p-4 hover:bg-light  rounded-lg transition-colors"
                    onClick={() => setMobileMenu(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-gray-400" />
                      <span>Messages</span>
                    </div>
                    {notificationCount > 0 && (
                      <span className="bg-red-500 text-light text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/saved"
                    className="flex items-center justify-between p-4 hover:bg-light  rounded-lg transition-colors"
                    onClick={() => setMobileMenu(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <FaHeart className="text-gray-400" />
                      <span>Saved Items</span>
                    </div>
                    {savedItemsCount > 0 && (
                      <span className="bg-red-500 text-light text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {savedItemsCount > 9 ? "9+" : savedItemsCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 p-4 hover:bg-light  rounded-lg transition-colors"
                    onClick={() => setMobileMenu(false)}
                  >
                    <FaUser className="text-gray-400" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={signOut}
                    className="flex items-center space-x-3 p-4 hover:bg-red-50 rounded-lg transition-colors w-full text-left text-red-600"
                  >
                    <FaSignOutAlt className="text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </>
              </div>
            ) : auth?.user?.role === "seller" ? (
              <div>
                <Link
                  to={"/seller"}
                  className="relative p-3 gap-2 text-gray-50 flex bg-primary/90 mx-5 items-center hover:text-primary hover:bg-primary/30 rounded-lg transition-all duration-300 group"
                >
                  <FaUserCircle className="text-lg" />
                  <div className=" ">Dashboard</div>
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-3 p-4 hover:bg-red-50 rounded-lg transition-colors w-full text-left text-red-600"
                >
                  <FaSignOutAlt className="text-red-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
