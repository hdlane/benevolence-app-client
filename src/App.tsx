import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./components/AdminRoutes";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Verify from "./pages/Login/Verify";
import VerifyPerson from "./pages/Login/VerifyPerson";
import VerifyOrganization from "./pages/Login/VerifyOrganization";
import RequestDetails from "./pages/Requests/RequestDetails";
import RequestCreate from "./pages/Requests/RequestCreate";
import RequestUpdate from "./pages/Requests/RequestUpdate";
import Oauth from "./pages/Oauth";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/verify" element={<Verify />} />
                <Route path="/login/verify/organization" element={<VerifyOrganization />} />
                <Route path="/login/verify/person" element={<VerifyPerson />} />
                <Route path="/oauth" element={<Oauth />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/requests/:requestId" element={<RequestDetails />} />
                </Route>
                <Route element={<AdminRoutes />}>
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/requests/:requestId/edit" element={<RequestUpdate />} />
                    <Route path="/requests/new" element={<RequestCreate />} />
                </Route>
            </Routes>
        </>
    )
}

export default App
