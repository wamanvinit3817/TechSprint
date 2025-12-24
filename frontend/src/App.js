import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AuthSuccess from "./pages/AuthSuccess";
import Dashboard from "./pages/Dashboard";
import SocietyLogin from "./pages/SocietyLogin";
import CollegeCodeLogin from "./pages/CollegecodeLogin";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />        
        <Route path="/society-login" element={<SocietyLogin />} />        
        <Route path="/college-code-login" element={<CollegeCodeLogin />} />        

        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

