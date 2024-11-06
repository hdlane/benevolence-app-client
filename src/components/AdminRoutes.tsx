import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import getPermissions from "@/lib/getPermissions";
import { useToast } from "@/hooks/use-toast";

function AdminRoutes() {
    const { toast } = useToast();
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);
    // check backend to get permissions and update cookies
    useEffect(() => {
        async function checkPermissions() {
            const response = await getPermissions();
            if (response.ok) {
                const json = await response.json();
                localStorage.setItem("is_admin", json.is_admin);
                localStorage.setItem("user_id", json.id);
                localStorage.setItem("name", json.name);
                json.is_admin === true ? setIsAdmin(true) : setIsAdmin(false);
                if (!json.is_admin) {
                    setIsAdmin(false);
                    toast({
                        variant: "destructive",
                        description: "You must be logged in as an admin to view this page",
                    });
                } else {
                    setIsAdmin(true);
                }
            } else {
                setIsAdmin(false);
                const json = await response.json();
                toast({
                    variant: "destructive",
                    description: `${json.errors.detail}`
                });
            }
        }

        checkPermissions();
    }, [])

    if (isAdmin === undefined) {
        return "Loading"
    }

    return (
        isAdmin === true ? <Outlet /> : <Navigate to={"/login"} replace state={{ path: location.pathname }} />
    )
}

export default AdminRoutes;
