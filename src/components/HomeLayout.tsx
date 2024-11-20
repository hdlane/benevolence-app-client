import React from "react";
import HomeNavbar from "./HomeNavbar";
import { Outlet } from "react-router-dom";

function HomeLayout() {
    return <>
        <HomeNavbar />
        <Outlet />
    </>
}

export default HomeLayout;
