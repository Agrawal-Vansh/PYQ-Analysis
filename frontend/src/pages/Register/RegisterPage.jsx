import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import { handleError, handleSuccess } from '../../utils';
import axios from "axios"

const RegisterPage = () => {
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
      });
      const handleChange = (e) => {
        const { name, value } = e.target;       
        setFormData({
          ...formData,
          [name]: value,
        });  
      };
      const handleRegister = async (e) => {
        e.preventDefault();
        const {
          name,
          email,
          password,
        } = formData;
        
        if (!name ||  !password || !email) {
          return handleError("All Fields are required ");
        }
        try {
          
          const res=await axios.post(`${import.meta.env.VITE_URL}/auth/register`, {
            name,
            password,
            email,
          });
   
            handleSuccess("Registeration Successful")
            setTimeout(()=>{   navigate('/');},1000);
        
          } 
        catch (error) {
        // console.log(error);
        handleError('Registration failed: ' + (error.response?.data?.error?.details[0]?.message||error.response?.data?.message || error.message));
      }
    };
    const [showPassword, setShowPassword] = useState(false); 
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword); // Toggle password visibility
    };

    const handleGoogleLogin = async (response) => {
      try {
        // console.log("Google login response:", response); 
    
        const googleToken = response.credential; // Extract the token from Google response
        // console.log("Google token:", googleToken);
    
        // Redirect to backend endpoint with the Google token
        const res = await axios.get(`${import.meta.env.VITE_URL}/auth/google/callback`, {
          params: { token: googleToken },
        });
    
        const { message, name, token } = res.data;
    
        // Store token and user details in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("loggedInUser", name);
    
        // Set default Authorization header for Axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
        // Handle success (show message and navigate)
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        handleError("Google login failed: " + error.message);
      }
    };
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Register</h1>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={formData.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Your Name"
              autoFocus
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Your Email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative w-full">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    onChange={handleChange}
    value={formData.password}
    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Enter Your Password"
    required
  />
  <button
    type="button"
    onClick={togglePasswordVisibility}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3.98 8.33a10.443 10.443 0 0117.04 0 10.443 10.443 0 01-17.04 0zM12 15a3 3 0 100-6 3 3 0 000 6z"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13.875 18.825a10.443 10.443 0 005.365-3.236M16.22 12.78a3.001 3.001 0 01-3.003-3.003M8.78 9.22A3.003 3.003 0 015.777 12.78m2.24 6.221c-2.69-1.73-4.805-4.47-5.566-7.753M15 12c0 3.866-3.134 7-7 7-2.75 0-5.128-1.572-6.333-3.902l2.84-1.904C5.84 13.74 6.918 14 8 14c2.21 0 4-1.79 4-4 0-.85-.22-1.64-.58-2.33l1.45-1.45C14.88 7.75 15 9.84 15 12z"
        />
      </svg>
    )}
  </button>
</div>

          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
        <p className="text-m text-gray-600 text-center m-2"> or</p>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <div className="my-4 text-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin} // Handle Google login response
              onError={(error) => console.log("Google login error", error)}
              useOneTap
            />
          </div>
          </GoogleOAuthProvider>
        <p className="text-sm text-gray-600 text-center mt-6">
          Already Have an Account?{' '}
          <Link to="/login" className="text-blue-500 font-medium hover:underline">
            Sign in
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default RegisterPage;
