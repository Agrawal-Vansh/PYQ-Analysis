import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../../utils";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

function Dashboard() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    setLoggedInUser(user);

    // Fetch user details from the server using an API (assuming token-based authentication)
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            `${import.meta.env.VITE_URL}/api/user/details`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("response data is ");
          console.log(response.data);

          setUserDetails(response.data); // Assuming response contains user details
        } else {
          setError({ message: "User not authenticated" });
        }
      } catch (err) {
        setError(err);
        handleError("Error fetching user details");
      }
    };

    if (user) {
      fetchUserDetails();
    } else {
      setError({ message: "No user logged in" });
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    handleSuccess(`${loggedInUser} Logged Out`);
    localStorage.removeItem("loggedInUser");
    setTimeout(() => navigate("/"), 1000);
  };

  const renderSubjects = () => {
    // Check if subjects exist and have data
    if (!userDetails.subjects || Object.keys(userDetails.subjects).length === 0) {
      return null; // If no subjects, return null (nothing is rendered)
    }

    return (
      <div className="mt-4">
        <h3 className="font-semibold text-gray-700">Subjects</h3>
        <ul className="list-disc pl-5">
          {Object.entries(userDetails.subjects).map(([subject, questions]) => (
            <li key={subject} className="mb-4">
              <strong className="text-lg">{subject}:</strong>
              {/* Check if there are questions to display */}
              {Array.isArray(questions) && questions.length > 0 ? (
                <ul className="list-inside list-decimal pl-5">
                  {questions.map((question, idx) => (
                    <li key={`${subject}-${idx}`}>{question}</li> // Improved key by combining subject and index
                  ))}
                </ul>
              ) : (
                <p>No questions available for {subject}</p> // Handle the case when there are no questions
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Error loading data: {error.message || error?.response?.data?.message}
        </h1>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80 text-center">
        <div className="flex justify-center mb-6">
          {userDetails.profilePhoto ? (
            <img
              src={userDetails.profilePhoto}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-gray-500 w-24 h-24" />
          )}
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          {loggedInUser}
        </h1>
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition duration-300"
        >
          Log Out
        </button>
      </div>

      <br />
      <br />
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">User Details</h2>
        <div className="bg-gray-200 p-4 rounded-lg shadow-sm">
          {userDetails && (
            <div>
              <p className="text-sm text-gray-600">Email: {userDetails.email}</p>
              {/* Render Subjects */}
              {renderSubjects()}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Dashboard;
