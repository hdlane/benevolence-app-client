import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TitleBar from "@/components/TitleBar";

function Requests() {
    const [request, setRequest] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        return
    }, [request])

    return <>
        <TitleBar title={"Requests"} />
        <div className="content">
            <p>Lorem ipsum</p>
        </div>
    </>
}

export default Requests;
