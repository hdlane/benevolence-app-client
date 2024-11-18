import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import getPermissions from "@/lib/getPermissions";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setIsAdmin, setIsLoggedIn } from "@/features/users/userSlice";

function AdminRoutes() {
    const { toast } = useToast();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const isAdmin = useAppSelector((state) => state.user.is_admin) || (localStorage.getItem("is_admin") === "true");
    // check backend to get permissions and update cookies
    useEffect(() => {
        async function checkPermissions() {
            const response = await getPermissions();
            if (response.ok) {
                const json = await response.json();
                localStorage.setItem("is_admin", json.is_admin);
                localStorage.setItem("organization_name", json.organization_name);
                localStorage.setItem("user_id", json.id);
                localStorage.setItem("name", json.name);
                localStorage.setItem("logged_in", json.logged_in);
                dispatch(setIsLoggedIn({ logged_in: json.logged_in }));
                json.is_admin === true ? dispatch(setIsAdmin({ is_admin: true })) : dispatch(setIsAdmin({ is_admin: false }));
                if (!json.is_admin) {
                    dispatch(setIsAdmin({ is_admin: false }));
                    toast({
                        variant: "destructive",
                        description: "You must be logged in as an admin to view this page",
                    });
                } else {
                    dispatch(setIsAdmin({ is_admin: true }));
                }
            } else {
                localStorage.removeItem("is_admin");
                localStorage.removeItem("user_id");
                localStorage.removeItem("organization_name");
                localStorage.removeItem("name");
                localStorage.removeItem("logged_in");
                localStorage.removeItem("synced_at");
                dispatch(setIsAdmin({ is_admin: false }));
                dispatch(setIsLoggedIn({ logged_in: false }));
                const json = await response.json();
                toast({
                    variant: "destructive",
                    description: `${json.errors.detail}`
                });
            }
        }

        checkPermissions();
    }, [isAdmin])

    if (isAdmin === undefined) {
        return "Loading"
    }

    return (
        isAdmin === true ? <Outlet /> : <Navigate to={"/login"} replace state={{ path: location.pathname }} />
    )
}

export default AdminRoutes;
