import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { handleSuccess, handleError } from "../../utils";
import { ToastContainer } from "react-toastify";

const Header = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [showLogout, setShowLogout] = useState(false); // Added state for showing logout
    const navigate = useNavigate();

    // Fetch user data from localStorage initially
    useEffect(() => {
        const user = localStorage.getItem("loggedInUser");
        const profilePhoto = localStorage.getItem("profilePhoto");
        setProfilePhoto(profilePhoto);
        setLoggedInUser(user);
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("profilePhoto");
        localStorage.removeItem("token");
        handleSuccess(`${loggedInUser} Logged Out`); // Toast notification on logout
        localStorage.removeItem("loggedInUser");

        // Update state to ensure UI reflects the change immediately
        setLoggedInUser(null);
        setProfilePhoto(null);

        setTimeout(() => navigate("/"), 1000); // Redirect after logout
    };

    // Toggle logout visibility
    const toggleLogout = () => {
        setShowLogout(!showLogout);
    };

    return (
        <header className="bg-gray-800 text-gray-100 py-4 shadow-lg">
            <div className="container mx-auto flex flex-wrap items-center justify-between px-5">
                <a className="flex items-center text-gray-100 hover:text-gray-300">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="ml-3 text-xl font-bold">Tailblocks</span>
                </a>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#" className="hover:text-gray-300 transition duration-300">First Link</a>
                    <a href="#" className="hover:text-gray-300 transition duration-300">Second Link</a>
                    <a href="#" className="hover:text-gray-300 transition duration-300">Third Link</a>
                    <a href="#" className="hover:text-gray-300 transition duration-300">Fourth Link</a>
                </nav>

                {/* Profile and Dashboard Button */}
                <div className="flex items-center space-x-4">
                    {loggedInUser && (
                        <>
                            {/* Dashboard Button */}
                            <button className="btn" onClick={() => navigate("/dashboard")}>
                                Dashboard
                            </button>
                            {/* Profile Photo or Icon */}
                            <div className="relative">
                                {profilePhoto ? (
                                    <img
                                        src={profilePhoto}
                                        alt="Profile"
                                        className="rounded-full object-cover w-12 h-12 cursor-pointer"
                                        onClick={toggleLogout} // Toggle logout when clicked
                                    />
                                ) : (
                                    <FaUserCircle
                                        className="text-gray-400 w-12 h-12 cursor-pointer"
                                        onClick={toggleLogout} // Toggle logout when clicked
                                    />
                                )}

                                {/* Logout Button (visible when showLogout is true) */}
                                {showLogout && (
                                    <button
                                        className="absolute top-14 right-0 mt-2 bg-red-600 text-white py-2 px-4 rounded-lg"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* Conditional Buttons for Login/Logout */}
                    {!loggedInUser ? (
                        <>
                            <button className="btn" onClick={() => navigate("/register")}>
                                Register
                            </button>
                            <button className="btn" onClick={() => navigate("/login")}>
                                Login
                            </button>
                        </>
                    ) : null}
                </div>
            </div>

            {/* Custom Button Styles */}
            <style jsx> {
                `.btn {
                    --border-color: linear-gradient(-45deg, #ffae00, #7e03aa, #00fffb);
                    --border-width: 0.125em;
                    --curve-size: 0.5em;
                    --bg: #080312;
                    --color: #afffff;
                    color: var(--color);
                    cursor: pointer;
                    position: relative;
                    isolation: isolate;
                    display: inline-grid;
                    place-content: center;
                    padding: 0.75em 2em;
                    font-size: 1rem;
                    font-weight: bold;
                    border: 0;
                    text-transform: uppercase;
                    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.6);
                    clip-path: polygon(
                        0% var(--curve-size),
                        var(--curve-size) 0,
                        100% 0,
                        100% calc(100% - var(--curve-size)),
                        calc(100% - var(--curve-size)) 100%,
                        0 100%
                    );
                    transition: color 250ms;
                }

                .btn::after,
                .btn::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                }

                .btn::before {
                    background: var(--border-color);
                    background-size: 300% 300%;
                    animation: move-bg7234 5s ease infinite;
                    z-index: -2;
                }

                @keyframes move-bg7234 {
                    0% {
                        background-position: 31% 0%;
                    }

                    50% {
                        background-position: 70% 100%;
                    }

                    100% {
                        background-position: 31% 0%;
                    }
                }

                .btn::after {
                    background: var(--bg);
                    z-index: -1;
                    clip-path: polygon(
                        var(--border-width) calc(var(--curve-size) + var(--border-width) * 0.5),
                        calc(var(--curve-size) + var(--border-width) * 0.5) var(--border-width),
                        calc(100% - var(--border-width)) var(--border-width),
                        calc(100% - var(--border-width)) calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5)),
                        calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5)) calc(100% - var(--border-width)),
                        var(--border-width) calc(100% - var(--border-width))
                    );
                    transition: clip-path 500ms;
                }

                .btn:hover::after {
                    clip-path: polygon(
                        calc(100% - var(--border-width)) calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5)),
                        calc(100% - var(--border-width)) var(--border-width),
                        calc(100% - var(--border-width)) var(--border-width),
                        calc(100% - var(--border-width)) calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5)),
                        calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5)) calc(100% - var(--border-width)),
                        calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5)) calc(100% - var(--border-width))
                    );
                    transition: 200ms;
                }

                .btn:hover {
                    color: #fff;
                }`
            }</style>

            <ToastContainer />
        </header>
    );
};

export default Header;
