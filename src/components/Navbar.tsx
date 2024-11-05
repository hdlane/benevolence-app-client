import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import LogoutDialog from "./dialogs/LogoutDialog";

function Navbar() {
    const [dialogOpen, setDialogOpen] = useState(false);

    return <nav className="navbar">
        <a href="/" className="flex">
            <img src={logo} alt="Logo" id="logo" />
            <span className="text-2xl">benevolence</span>
        </a>
        <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/admin">Admin</Link>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger>
                    <a href="#">Logout</a>
                </DialogTrigger>
                <DialogContent>
                    <LogoutDialog onOpenChange={setDialogOpen} />
                </DialogContent>
            </Dialog>
        </div>
    </nav>
}

export default Navbar;
