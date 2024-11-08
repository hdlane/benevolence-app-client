import React from "react";
import RequestActions from "./RequestActions";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import SyncBanner from "./SyncBanner";

interface TitleBarProps {
    title?: string | null;
    subTitle?: string | null;
}

function TitleBar({ title, subTitle = null }: TitleBarProps) {
    const is_admin = (localStorage.getItem("is_admin") === "true");
    const location = useLocation();
    const navigate = useNavigate();
    const syncedAt = localStorage.getItem("synced_at");

    return <>
        <div className="title-bar flex justify-between">
            <div id="title" className="flex-col">
                <h1>{title ? title : "Benevolence App"}</h1>
                {subTitle ? <p>{subTitle}</p> : null}
            </div>
            {
                location.pathname.includes("requests") ? (
                    is_admin ? (
                        <RequestActions />
                    ) : null
                ) : (
                    is_admin ? (
                        <Button variant="ghost" onClick={() => navigate("/requests/new")}>
                            New Request
                            <Plus className="ml-1" />
                        </Button>
                    ) : null
                )
            }
        </div>
        {
            syncedAt === "null" ? (
                <SyncBanner />
            ) : null
        }
    </>
}

export default TitleBar;
