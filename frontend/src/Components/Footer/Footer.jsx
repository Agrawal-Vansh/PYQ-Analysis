import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
const Footer = () => {
    return (
        <footer className="bg-gray-800 py-8 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
                    <div className="text-center md:text-left md:w-1/2">
                        <h3 className="text-xl font-bold text-gray-100 mb-4">About Us</h3>
                        <p className="text-gray-400">
                            We are dedicated to providing the best experience for our users. Join us and explore the world of possibilities.
                        </p>
                    </div>

                    <div className="text-center md:w-1/2">
                        <h3 className="text-xl font-bold text-gray-100 mb-4">Follow Us</h3>
                        <div className="flex justify-center space-x-6">
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300">
                                <FaGithub className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300">
                                <FaTwitter className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300">
                                <FaLinkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
