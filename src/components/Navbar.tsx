import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAppDispatch } from "@/app/hooks";
import { setError } from "@/features/errors/errorsSlice";
import { MessageColors, setMessage } from "@/features/messages/messagesSlice";

function Navbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            const response = await fetch(
                "http://localhost:3000/api/v1/logout",
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )
            if (!response.ok) {
                dispatch(setError({ message: `Response status: ${response.status}` }));
            } else {
                const json = await response.json();
                dispatch(setMessage({ message: json.message, background: MessageColors.SUCCESS }));
                navigate("/login");
            }
        } catch (error) {
            dispatch(setError({ message: (error as Error).message }));
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
