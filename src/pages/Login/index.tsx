import React, { useState } from "react";
import TitleBar from "@/components/TitleBar";
import { MessageColors } from "@/features/messages/messagesSlice";
import { setError } from "@/features/errors/errorsSlice";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [loginMessage, setLoginMessage] = useState<string | null>(null);
    const [loginMessageBackground, setLoginMessageBackground] = useState<MessageColors>(MessageColors.WARNING);

    const submitButton = document.getElementById("submit-button");

    async function handleSubmit(e) {
        e.preventDefault();

        const controller = new AbortController();
        const parsedEmail = z.string().email().safeParse(email);

        if (!parsedEmail.success) {
            const message = parsedEmail.error.format();
            setLoginMessageBackground(MessageColors.WARNING);
            setLoginMessage(message._errors[0]);
            return
        }

        try {
            const response = await fetch(
                "http://localhost:3000/api/v1/login",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                    signal: controller.signal
                });

            if (response.status == 400) {
                setLoginMessageBackground(MessageColors.WARNING);
                setLoginMessage("Email address invalid");
            }
            else if (response.status == 404) {
                setLoginMessageBackground(MessageColors.WARNING);
                setLoginMessage("Account not found with that email.");
            }
            else if (!response.ok) {
                dispatch(setError({ message: `Response status: ${response.status}` }));
            } else {
                submitButton?.setAttribute("disabled", "true");
                const json = await response.json();
                setLoginMessageBackground(MessageColors.SUCCESS);
                setLoginMessage(json.message);
                if (json.redirect_url) {
                    navigate("/");
                }
            }
        } catch (error) {
            dispatch(setError({ message: (error as Error).message }));
        }
    }

    return <>
        <TitleBar title={"Login"} />
        <div className="content flex items-center justify-center h-full">
            <div className="flex flex-col space-y-4 bg-white p-6 rounded text-center w-full max-w-md">
                <p className="text-lg font-semibold">To get started, enter your email address.</p>
                <p>We'll send you a link you can use to login.</p>
                {loginMessage ? (
                    <div className={`flex justify-between p-1 message-${loginMessageBackground}`}> <span className="flex-1">{loginMessage}</span></div>
                ) : null}
                <form>
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
