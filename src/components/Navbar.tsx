import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import LogoutDialog from "./dialogs/LogoutDialog";

function Navbar() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const isAdmin = (localStorage.getItem("is_admin") === "true");

    return <nav className="navbar">
        <Link to="/" className="flex">
            <img src={logo} alt="Logo" id="logo" />
            <span className="text-2xl">benevolence</span>
        </Link>
        <div className="navbar-links">
            <Link to="/">Home</Link>
            {isAdmin ? <Link to="/admin">Admin</Link> : null}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger>
                    <a href="#">Logout</a>
                </DialogTrigger>
                <DialogContent>
                    <LogoutDialog onOpenChange={setDialogOpen} />
                </DialogContent>
            </Dialog>
        </div>
    </nav >
}

export default Navbar;
