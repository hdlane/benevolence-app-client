import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Requests from "./pages/Requests";
import Verify from "./pages/Login/Verify";
import VerifyPerson from "./pages/Login/VerifyPerson";
import VerifyOrganization from "./pages/Login/VerifyOrganization";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/verify" element={<Verify />} />
                <Route path="/login/verify/organization" element={<VerifyOrganization />} />
                <Route path="/login/verify/person" element={<VerifyPerson />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/requests/:id" element={<Requests />} />
            </Routes>
        </>
    )
}

export default App
