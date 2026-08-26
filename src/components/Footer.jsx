import React from "react";
import { Link } from "react-router-dom";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaMobile,
  FaShoppingBag,
  FaUsers,
  FaHeart,
} from "react-icons/fa";

function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  const defaultMessage = encodeURIComponent(
    "Hello DASOPS, I would like to inquire about your marketplace services."
  );

  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden mt-16">
      {/* Modern background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-light/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className=" mx-auto px-4 sm:px-6 lg:px-12 py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Logo & Description Section */}
            <div className="lg:col-span-4">
              <Link to="/" className="inline-block group mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <span className="text-light font-bold text-xl">MJ</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      DASOPS
                    </span>
                    <div className="text-xs text-gray-500 -mt-1">
                      Kenya's Marketplace
                    </div>
                  </div>
                </div>
              </Link>

              <div className="space-y-6">
                <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                  Kenya's trusted marketplace connecting buyers and sellers
                  across all counties. Buy, sell, and discover amazing deals
                  with confidence.
                </p>

                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm text-gray-500">
                      10,000+ Active Products
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">
                      5,000+ Verified Sellers
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">
                      All 47 Counties Covered
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Section */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-light relative">
                Download Our Mobile App
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-blue-600 mt-2"></div>
              </h3>

              {/* App Download Section */}
              <div className="pt-4 border-t border-gray-800">
                <div className="space-y-3">
                  {/* Google Play Store */}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.DASOPS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-3 p-3 border border-gray-700 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaGooglePlay size={16} className="text-light" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">GET IT ON</p>
                      <p className="text-gray-300 font-medium">Google Play</p>
                    </div>
                  </a>

                  {/* Apple App Store */}
                  <a
                    href="https://apps.apple.com/app/DASOPS/id123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-3 p-3 border border-gray-700 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaApple size={16} className="text-light" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">DOWNLOAD ON THE</p>
                      <p className="text-gray-300 font-medium">App Store</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-light relative">
                Quick Links
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-blue-600 mt-2"></div>
              </h3>

              <nav className="space-y-4">
                {[
                  { name: "Sell Your Items", path: "/sell" },
                  { name: "All Products", path: "/products" },
                  { name: "About Us", path: "/about" },
                  { name: "Contact Support", path: "/contact" },
                  { name: "Help Center", path: "/help" },
                  { name: "Safety Tips", path: "/safety" },
                ].map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="group flex items-center space-x-3 text-gray-400 hover:text-primary transition-all duration-300"
                  >
                    <IoIosArrowForward
                      className="text-primary group-hover:translate-x-1 transition-transform duration-300"
                      size={16}
                    />
                    <span className="group-hover:underline">{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact & App Downloads Section */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl font-bold text-light relative">
                Get In Touch
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-blue-600 mt-2"></div>
              </h3>

              <div className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-3">
                  {/* Location */}
                  <div className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <FaMapMarkerAlt size={16} className="text-light" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Serving</p>
                      <p className="text-gray-300 font-medium">
                        All Kenya Counties
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/254700000000?text=${defaultMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaWhatsapp size={16} className="text-light" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">WhatsApp Support</p>
                      <p className="text-gray-300 font-medium">
                        Available 24/7
                      </p>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:support@DASOPS.com"
                    className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaEnvelope size={16} className="text-light" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Email Us</p>
                      <p className="text-gray-300 font-medium">
                        support@DASOPS.com
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm mb-4">
              Follow us for updates and deals
            </p>
            <div className="flex items-center space-x-4">
              {[
                {
                  icon: FaFacebook,
                  color: "from-blue-600 to-blue-700",
                  href: "https://facebook.com/DASOPS",
                },
                {
                  icon: FaInstagram,
                  color: "from-pink-500 to-purple-600",
                  href: "https://instagram.com/DASOPS",
                },
                {
                  icon: FaTwitter,
                  color: "from-blue-400 to-blue-500",
                  href: "https://twitter.com/DASOPS",
                },
                {
                  icon: FaLinkedin,
                  color: "from-blue-700 to-blue-800",
                  href: "https://linkedin.com/company/DASOPS",
                },
                {
                  icon: FaWhatsapp,
                  color: "from-green-500 to-green-600",
                  href: `https://wa.me/254700000000?text=${defaultMessage}`,
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-gradient-to-r ${social.color} rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300`}
                >
                  <social.icon size={18} className="text-light" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-gray-500 text-sm">
                Copyright © {year} DASOPS. All rights reserved.
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <Link
                  to="/privacy-policy"
                  className="text-gray-500 hover:text-primary transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms-of-service"
                  className="text-gray-500 hover:text-primary transition-colors duration-300"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/seller-terms"
                  className="text-gray-500 hover:text-primary transition-colors duration-300"
                >
                  Seller Terms
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-500">Secure & Trusted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
