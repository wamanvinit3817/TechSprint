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
import GlobalAlert from "./pages/GlobalAlert";

import "./App.css"
import { LoadingProvider } from "./context/LoadingContext";

function App() {
  return (
    <LoadingProvider>
     <AlertProvider>
    <BrowserRouter>
   
      <Routes>
        <Route path="/" element={<Login />} />        
        <Route path="/society-login" element={<SocietyLogin />} />        
        <Route path="/college-code-login" element={<CollegeCodeLogin />} />        

        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/verify-claim" element={<VerifyClaim />} />
        <Route path="/history" element={<History />} />


      </Routes>
    </BrowserRouter>
    </AlertProvider>
    </LoadingProvider>
    
  );
}

export default App;

