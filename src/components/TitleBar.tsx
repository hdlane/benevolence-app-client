import React from "react";
import RequestActions from "./RequestActions";

interface TitleBarProps {
    title?: string | null;
    subTitle?: string | null;
}

function TitleBar({ title, subTitle = null }: TitleBarProps) {
    return <>
        <div className="title-bar flex justify-between">
            <div id="title" className="flex-col">
                <h1>{title ? title : "Benevolence App"}</h1>
                {subTitle ? <p>{subTitle}</p> : null}
            </div>
            <RequestActions />
        </div>
    </>
}

export default TitleBar;
