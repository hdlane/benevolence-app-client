import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function NavbarLayout() {
    return <>
        <Navbar />
        <Outlet />
    </>
}

export default NavbarLayout;
