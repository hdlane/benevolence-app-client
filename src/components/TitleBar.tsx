import React from "react";

interface TitleBarProps {
    title?: string | null;
    subTitle?: string | null;
}

function TitleBar({ title, subTitle = null }: TitleBarProps) {
    return <>
        <div className="title-bar">
            <div id="title" className="flex flex-col">
                <h1>{title ? title : "Benevolence App"}</h1>
                {subTitle ? <p>{subTitle}</p> : null}
            </div>
        </div>
    </>
}

export default TitleBar;
