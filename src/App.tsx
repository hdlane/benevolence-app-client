import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Requests from "./pages/Requests";

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/requests" element={<Requests />}>
                        <Route path=":id" element={<Requests />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
