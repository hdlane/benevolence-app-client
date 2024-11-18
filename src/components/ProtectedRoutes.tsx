import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setIsAdmin, setIsLoggedIn } from "@/features/users/userSlice";
import { useToast } from "@/hooks/use-toast";
import getPermissions from "@/lib/getPermissions";
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoutes() {
    const { toast } = useToast();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((state) => state.user.logged_in) || (localStorage.getItem("logged_in") === "true");
    // check backend to get permissions and update cookies
    useEffect(() => {
        async function checkPermissions() {
            const response = await getPermissions();
            if (response.ok) {
                const json = await response.json();
                localStorage.setItem("is_admin", json.is_admin);
                localStorage.setItem("user_id", json.id);
                localStorage.setItem("organization_name", json.organization_name);
                localStorage.setItem("name", json.name);
                localStorage.setItem("logged_in", json.logged_in);
                localStorage.setItem("synced_at", json.synced_at);
                dispatch(setIsLoggedIn({ logged_in: true }));
                dispatch(setIsAdmin({ is_admin: json.is_admin }));
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
    }, [isLoggedIn])

    if (isLoggedIn === undefined) {
        return "Loading"
    }

    return (
        isLoggedIn === true ? <Outlet /> : <Navigate to={"/login"} replace state={{ path: location.pathname }} />
    )
}

export default ProtectedRoutes;
