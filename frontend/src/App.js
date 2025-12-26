import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AuthSuccess from "./pages/AuthSuccess";
import Dashboard from "./pages/Dashboard";
import SocietyLogin from "./pages/SocietyLogin";
import CollegeCodeLogin from "./pages/CollegecodeLogin";
import VerifyClaim from "./pages/VerifyClaim";
import AddItem from "./pages/Additem";
import History from "./pages/History";

import { AlertProvider } from "./context/AlertContext";
import { LoadingProvider } from "./context/LoadingContext";
import GlobalAlert from "./pages/GlobalAlert";

import "./App.css";

function App() {
  return (
    <LoadingProvider>
      <AlertProvider>
        <BrowserRouter>
          <GlobalAlert />

          <Routes>
            {/* AUTH */}
            <Route path="/" element={<Login />} />
            <Route path="/society-login" element={<SocietyLogin />} />
            <Route path="/college-code-login" element={<CollegeCodeLogin />} />
            <Route path="/auth/success" element={<AuthSuccess />} />

            {/* MAIN */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/history" element={<History />} />

            {/* QR VERIFY */}
            <Route path="/verify-claim" element={<VerifyClaim />} />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </LoadingProvider>
  );
}

export default App;
