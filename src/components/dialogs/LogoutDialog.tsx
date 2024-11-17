import React from "react";
import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import createApi from "@/lib/api";
import { useNavigate } from "react-router-dom";

function LogoutDialog({ onOpenChange }) {
    const navigate = useNavigate();
    const { toast } = useToast();

    async function handleLogout(e) {
        e.preventDefault();
        const controller = new AbortController();
        const api = createApi({ endpoint: "/logout" })

        try {
            const response = await api._delete({ controller: controller });
            const json = await response.json();

            if (!response.ok) {
                toast({
                    variant: "destructive",
                    description: `${json.errors.detail}`
                });
            } else {
                localStorage.removeItem("user_id");
                localStorage.removeItem("organization_name");
                localStorage.removeItem("is_admin");
                localStorage.removeItem("name");
                localStorage.removeItem("logged_in");
                localStorage.removeItem("synced_at");
                toast({
                    description: "Successfully logged out!"
                });
                navigate("/login");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: `${error}`,
            });
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-center">
                    Logout?
                </DialogTitle>
                <DialogDescription className="text-md text-center">
                    Logout from Benevolence App
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-center">
                <div className="grid grid-cols-all items-center gap-4">
                    <p>
                        Are you sure you want to logout?
                    </p>
                </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row">
                <button
                    className="button-primary bg-red-500"
                    type="button"
                    onClick={(e) => {
                        handleLogout(e);
                        onOpenChange(false);
                    }}
                >
                    Logout
                </button>
                <button
                    className="button-outline mt-5 sm:m-0"
                    type="button"
                    onClick={() => {
                        onOpenChange(false);
                    }}
                >
                    Cancel
                </button>
            </DialogFooter>
        </>
    )
}

export default LogoutDialog;
