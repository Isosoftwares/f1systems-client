import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaSearch,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCompass,
  FaRocket,
} from "react-icons/fa";

function Modern404Page() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log("Search triggered");
  };

  return (
    <div className="min-h-screen bg-light relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Shapes */}
        <div
          className="absolute w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${20 + mousePosition.x * 0.01}%`,
            top: `${10 + mousePosition.y * 0.01}%`,
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse"
          style={{
            right: `${15 + mousePosition.x * 0.008}%`,
            bottom: `${20 + mousePosition.y * 0.008}%`,
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute w-32 h-32 bg-tertiary/5 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${60 + mousePosition.x * 0.005}%`,
            top: `${60 + mousePosition.y * 0.005}%`,
            animationDelay: "2s",
          }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-gray-300" />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* 404 Number with Animation */}
          <div className="mb-6 relative">
            <div className="text-6xl sm:text-7xl lg:text-8xl font-black text-primary leading-none">
              404
            </div>
            <div className="absolute inset-0 text-6xl sm:text-7xl lg:text-8xl font-black text-primary/10 animate-pulse">
              404
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark leading-tight">
              Oops! Page Not
              <span className="block text-secondary">Found</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto leading-relaxed">
              Looks like you've ventured into uncharted territory. The page
              you're looking for has moved, been deleted, or never existed.
            </p>
          </div>

          {/* Helpful Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                <FaMapMarkerAlt className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-dark mb-2">
                Check the URL
              </h3>
              <p className="text-gray-600 text-sm">
                Make sure the web address is correct and try again.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
                <FaCompass className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-dark mb-2">
                Use Navigation
              </h3>
              <p className="text-gray-600 text-sm">
                Go back to the homepage and navigate from there.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="w-10 h-10 bg-tertiary rounded-lg flex items-center justify-center mx-auto mb-3">
                <FaRocket className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-dark mb-2">
                Start Fresh
              </h3>
              <p className="text-gray-600 text-sm">
                Begin your journey from our main page.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={handleGoHome}
              className="group bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3"
            >
              <FaHome className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Go to Homepage</span>
            </button>

            <button
              onClick={handleGoBack}
              className="group bg-white hover:bg-gray-50 text-dark font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200 flex items-center space-x-3"
            >
              <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Fun Element */}
          <div className="mt-12 opacity-60">
            <p className="text-gray-500 text-sm">
              Lost? Don't worry, even the best explorers take wrong turns
              sometimes.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-16 left-8 animate-bounce delay-1000">
        <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
      </div>
      <div className="absolute top-32 right-16 animate-bounce delay-2000">
        <div className="w-2 h-2 bg-secondary/30 rounded-full"></div>
      </div>
      <div className="absolute bottom-24 left-1/4 animate-bounce delay-3000">
        <div className="w-2 h-2 bg-tertiary/30 rounded-full"></div>
      </div>
      <div className="absolute bottom-16 right-1/3 animate-bounce">
        <div className="w-4 h-4 bg-primary/20 rounded-full"></div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

export default Modern404Page;
