import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearMessage } from "@/features/messages/messagesSlice";

interface TitleBarProps {
    title?: string | null;
    subTitle?: string | null;
}

function TitleBar({ title, subTitle = null }: TitleBarProps) {
    const dispatch = useAppDispatch();
    const message = useAppSelector((state) => state.messages.currentMessage);
    const messageBackground = useAppSelector((state) => state.messages.background);
    return <>
        {message ? <div className={`flex justify-between p-2 message-${messageBackground}`} ><span>{message}</span><button className="hover:underline" type="button" onClick={() => { dispatch(clearMessage()) }}>X</button></div> : ""}
        <div className="title-bar">
            <div id="title" className="flex flex-col">
                <h1>{title ? title : "Benevolence App"}</h1>
                {subTitle ? <p>{subTitle}</p> : null}
            </div>
        </div>
    </>
}

export default TitleBar;
