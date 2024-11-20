import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

function HomeNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    function toggleMenu() {
        setIsOpen(!isOpen)
    }

    return <>
        <nav className="navbar">
            <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex">
                    <img src={logo} alt="Logo" id="logo" />
                    <span className="text-2xl">benevolence</span>
                </Link>
                {/* Menu button (for mobile) */}
                <div className="sm:hidden">
                    <button
                        onClick={toggleMenu}
                        type="button"
                        className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-white"
                        aria-controls="mobile-menu"
                        aria-expanded={isOpen}
                    >
                        <svg
                            className="block h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Navbar links (visible on larger screens) */}
                <div className="hidden sm:flex space-x-4">
                    <Link to="/" className="hover:text-[#84A296]">Home</Link>
                    <Link to="/dashboard" className="hover:text-[#84A296]">Dashboard</Link>
                    <Link to="/help" className="hover:text-[#84A296]">Help</Link>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:text-[#84A296]"
                            onClick={() => toggleMenu()}
                        >
                            Home
                        </Link>
                        <Link
                            to="/dashboard"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:text-[#84A296]"
                            onClick={() => toggleMenu()}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/help"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:text-[#84A296]"
                            onClick={() => toggleMenu()}
                        >
                            Help
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    </>
}

export default HomeNavbar;
