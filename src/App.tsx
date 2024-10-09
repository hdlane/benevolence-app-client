import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Verify from "./pages/Login/Verify";
import VerifyPerson from "./pages/Login/VerifyPerson";
import VerifyOrganization from "./pages/Login/VerifyOrganization";
import RequestDetails from "./pages/Requests/RequestDetails";

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
                <Route path="/requests/:requestId" element={<RequestDetails />} />
            </Routes>
        </>
    )
}

export default App
