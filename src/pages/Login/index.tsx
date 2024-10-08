import React, { useState } from "react";
import TitleBar from "@/components/TitleBar";

function Login() {
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [background, setBackground] = useState<string>("#FED7AA");
    const [error, setError] = useState<string | null>(null);
    const submitButton = document.getElementById("submit-button");

    async function handleSubmit(e) {
        e.preventDefault();

        if (email.trim().length === 0) {
            setMessage("Enter an email address.")
            return
        }

        const controller = new AbortController();

        try {
            const response = await fetch(
                "http://localhost:3000/api/v1/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                    signal: controller.signal
                });

            if (response.status == 400) {
                setBackground("#FED7AA")
                setMessage("Enter an email address.")
            }
            else if (response.status == 404) {
                setBackground("#FED7AA")
                setMessage("Account not found with that email.")
            }
            else if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            } else {
                setBackground("#A7F3D0")
                const json = await response.json();
                setMessage(json.message);
            }
        } catch (error) {
            setError((error as Error).message)
        }
    }

    return <>
        <TitleBar title={"Login"} />
        <div className="content flex items-center justify-center h-full">
            <div className="flex flex-col space-y-4 bg-white p-6 rounded text-center w-full max-w-md">
                {message ? <span style={{ backgroundColor: `${background}` }} className={`p-1 w-full`}>{message}</span> : ""}
                <p className="text-lg font-semibold">To get started, enter your email address.</p>
                <p>We'll send you a link you can use to login.</p>
                <form action="submit">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                    <div className="flex justify-end py-2">
                        <button
                            className="button-primary"
                            type="submit"
                            id="submit-button"
                            onClick={handleSubmit}
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>
}

export default Login;
