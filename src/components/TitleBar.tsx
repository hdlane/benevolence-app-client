import React from "react";
import RequestActions from "./RequestActions";
import { useLocation } from "react-router-dom";

interface TitleBarProps {
    title?: string | null;
    subTitle?: string | null;
}

function TitleBar({ title, subTitle = null }: TitleBarProps) {
    const location = useLocation();

    return <>
        <div className="title-bar flex justify-between">
            <div id="title" className="flex-col">
                <h1>{title ? title : "Benevolence App"}</h1>
                {subTitle ? <p>{subTitle}</p> : null}
            </div>
            {
                location.pathname.includes("requests") ? (
                    <RequestActions />
                ) : null
            }
        </div>
    </>
}

export default TitleBar;
