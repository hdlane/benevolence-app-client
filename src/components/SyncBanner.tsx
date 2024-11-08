import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";

function SyncBanner() {
    const navigate = useNavigate();

    return <>
        <Card className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-none">
            Your organization hasn't been synced yet! People from Planning Center will be missing until you do your first sync.
            <button
                className="button-primary ml-0 mt-5 sm:ml-5 sm:mt-0"
                onClick={() => navigate("/admin")}
            >
                Sync Now
            </button>
        </Card>
    </>
}

export default SyncBanner;
