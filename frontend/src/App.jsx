import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage.jsx";
// import RegisterPage from "./pages/RegisterPage.jsx";
import PageNotFound from "./pages/PageNotFound/PageNotFound.jsx";
import UploadPYQ from "./pages/Home/UploadPYQ.jsx";
import Layout from "./Layout/Homelayout.jsx";
import RegisterPage from "./pages/Register/RegisterPage.jsx";
import Home from "./pages/Home/Home.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<UploadPYQ />} />
          <Route path="/upload" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
