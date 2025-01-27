import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false); // State for "Tools" dropdown

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and App Name */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:text-gray-200 transition"
        >
          <img
            src="public/logo.PNG" // Replace with your logo path
            alt="Logo"
            className="h-15 w-30 object-contain"
          />
       
        </Link>

        {/* Hamburger Menu */}
        <button
          className="lg:hidden flex items-center px-3 py-2 border rounded text-white border-white hover:text-gray-200 hover:border-gray-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="fill-current h-6 w-6"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" /> // Close Icon
            ) : (
              <path d="M4 6h16M4 12h16m-7 6h7" /> // Hamburger Icon
            )}
          </svg>
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:flex lg:items-center lg:space-x-6 space-y-4 lg:space-y-0 lg:static absolute bg-blue-600 w-full lg:w-auto p-4 lg:p-0 top-16 lg:top-0 left-0 z-50`}
        >
          {/* Main Links */}
          <Link
            to="/home1"
            className="block px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition"
          >
            Home
          </Link>
          <Link
            to="/admin-dashboard"
            className="block px-4 py-2 rounded-lg text-center hover:bg-green-700 transition"
          >
            Admin Dashboard
          </Link>

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => setIsToolsOpen(!isToolsOpen)}
            >
              Tools <MdKeyboardArrowDown className="h-4 w-4" />
            </button>
            <div
              className={`absolute left-0 bg-white text-black rounded-lg shadow-lg mt-2 w-40 ${
                isToolsOpen ? "block" : "hidden"
              }`}
            >
              <Link
                to="/datainc"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Data Increment
              </Link>
              <Link
                to="/history"
                className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg"
              >
                History
              </Link>
            </div>
          </div>

          {/* Auth Links */}
          <Link
            to="/login"
            className="block px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block px-4 py-2 bg-yellow-500 text-blue-900 rounded-lg hover:bg-yellow-600 transition"
          >
            Signup
          </Link>
          <Link
            to="/user-dashboard"
            className="block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            User Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
