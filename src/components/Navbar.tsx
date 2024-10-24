import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAppDispatch } from "@/app/hooks";
import createApi from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function Navbar() {
    const navigate = useNavigate();
    const { toast } = useToast();

    async function handleLogout() {
        const controller = new AbortController();
        const api = createApi({ endpoint: "/logout" })

        try {
            const response = await api._delete({ controller: controller });
            const json = await response.json();

            if (!response.ok) {
                toast({
                    variant: "destructive",
                    description: `${json.errors.detail}`
                });
            } else {
                localStorage.removeItem("user_id");
                toast({
                    description: "Successfully logged out!"
                });
                navigate("/login");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: `${error}`,
            });
        }
    }

    return <nav className="navbar">
        <a href="/" className="flex">
            <img src={logo} alt="Logo" id="logo" />
            <span className="text-2xl">benevolence</span>
        </a>
        <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/requests">Requests</Link>
            <Link to="#" onClick={handleLogout}>Logout</Link>
        </div>
    </nav>
}

export default Navbar;
