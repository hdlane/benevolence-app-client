import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Requests from "./pages/Requests";
import Verify from "./pages/Login/Verify";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/verify" element={<Verify />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/requests/:id" element={<Requests />} />
            </Routes>
        </>
    )
}

export default App
