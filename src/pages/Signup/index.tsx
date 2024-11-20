import React from "react";
import TitleBar from "@/components/TitleBar";

function Signup() {
    const API_URL = import.meta.env.VITE_API_URL;

    async function handleAuthorize() {
        window.location.href = `${API_URL}/oauth`;
    }

    return <>
        <TitleBar title={"Signup"} />
        <div className="content flex items-center justify-center h-full">
            <div className="flex flex-col space-y-4 bg-white p-6 rounded text-center w-full max-w-md">
                <p>
                    <span className="text-lg font-semibold">Ready to signup to use Benevolence App?<br /></span>
                    Click the button below to begin the process!
                </p>
                <button
                    onClick={handleAuthorize}
                    className="button-primary"
                >
                    Authorize with Planning Center
                </button>
                <p className="mt-4">When authorizing Benevolence App, the following information is gathered from Planning Center:</p>
                <ul className="text-gray-500">
                    <li>Names (People and Organization)</li>
                    <li>Email Addresses (People)</li>
                    <li>Phone Numbers (People)</li>
                    <li>Planning Center IDs (People and Organization)</li>
                </ul>
            </div>
        </div>
    </>
}

export default Signup;
