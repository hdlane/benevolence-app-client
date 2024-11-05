import { useToast } from "@/hooks/use-toast";
import getPermissions from "@/lib/getPermissions";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoutes() {
    const { toast } = useToast();
    const location = useLocation();
    const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>(undefined);
    // check backend to get permissions and update cookies
    useEffect(() => {
        async function checkPermissions() {
            const response = await getPermissions();
            if (response.ok) {
                const json = await response.json();
                localStorage.setItem("is_admin", json.is_admin);
                localStorage.setItem("user_id", json.id);
                localStorage.setItem("name", json.name);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
                const json = await response.json();
                toast({
                    variant: "destructive",
                    description: `${json.errors.detail}`
                });
            }
        }

        checkPermissions();
    }, [])

    if (isAuthorized === undefined) {
        return "Loading"
    }

    return (
        isAuthorized === true ? <Outlet /> : <Navigate to={"/login"} replace state={{ path: location.pathname }} />
    )
}

export default ProtectedRoutes;
