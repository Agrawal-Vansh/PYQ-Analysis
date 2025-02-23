import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-800 py-12 shadow-lg border-t border-gray-700">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Us Section */}
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-gray-100 mb-4">About Us</h3>
                        <p className="text-gray-400">
                            At <span className="font-semibold text-blue-400">PYQ Pulse</span>, we are passionate about helping students achieve academic excellence. Our platform provides access to past year question papers, AI-generated insights, and a collaborative community to fuel your academic ambitions.
                        </p>
                    </div>

                    {/* Follow Us Section */}
                    <div className="text-right"> {/* Align text to the right */}
                        <h3 className="text-2xl font-bold text-gray-100 mb-4">Follow Us</h3>
                        <div className="flex justify-end space-x-6"> {/* Align icons to the right */}
                            <span
                                className="text-gray-400 hover:text-blue-500 transition duration-300 cursor-pointer"
                                aria-label="GitHub"
                            >
                                <FaGithub className="h-6 w-6" />
                            </span>
                            <span
                                className="text-gray-400 hover:text-blue-500 transition duration-300 cursor-pointer"
                                aria-label="Twitter"
                            >
                                <FaTwitter className="h-6 w-6" />
                            </span>
                            <span
                                className="text-gray-400 hover:text-blue-500 transition duration-300 cursor-pointer"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin className="h-6 w-6" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        &copy; {new Date().getFullYear()} PYQ Pulse. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;