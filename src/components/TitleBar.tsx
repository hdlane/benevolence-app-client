import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearMessage } from "@/features/messages/messagesSlice";

function TitleBar({ title }) {
    const dispatch = useAppDispatch();
    const message = useAppSelector((state) => state.messages.currentMessage);
    const messageBackground = useAppSelector((state) => state.messages.background);
    return <>
        {message ? <div className={`flex justify-between p-2 message-${messageBackground}`} ><span>{message}</span><button className="hover:underline" type="button" onClick={() => { dispatch(clearMessage()) }}>X</button></div> : ""}
        <div className="title-bar">
            <h1>{title}</h1>
        </div>
    </>
}

export default TitleBar;
