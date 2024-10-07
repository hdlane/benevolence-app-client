import React, { useState } from "react";
import TitleBar from "@/components/TitleBar";
import { fetchWrapper, HttpMethod } from "@/lib/fetchData";

function Login() {
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e) {
        e.preventDefault();
        const submitButton = document.getElementById("submit-button");
        submitButton.disabled = true;
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
                setMessage("Enter an email address.")
            }
            else if (response.status == 404) {
                setMessage("Account not found with that email.")
            }
            else if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            } else {
                const json = await response.json();
                setMessage(json.message);
            }
        } catch (e) {
            console.log("An error occurred:", e);
        }
    }

    return <>
        <TitleBar title={"Login"} />
        <div className="content">
            <div>
                {message ? <span className="p-3 bg-orange-200">{message}</span> : ""}
                <p><strong>To get started, enter your email address.</strong><br />
                    We'll send you a link you can use to login. </p>
                <form action="submit">
                    <input type="email" name="email" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required /><br />
                    <button type="submit" id="submit-button" onClick={handleSubmit}>Sign In</button>
                </form>
            </div>
        </div>
    </>
}

export default Login;
