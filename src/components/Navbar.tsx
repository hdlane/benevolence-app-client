import React from "react";
import { Link } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import logo from "../assets/logo.png";

function Navbar() {
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
        </div>
    </nav>
}

export default Navbar;
