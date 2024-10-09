import React, { useState } from "react";
import TitleBar from "@/components/TitleBar";
import { MessageColors, setMessage } from "@/features/messages/messagesSlice";
import { setError } from "@/features/errors/errorsSlice";
import { useAppDispatch } from "@/app/hooks";

function Login() {
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState<string>("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (email.trim().length === 0) {
            dispatch(setMessage({ message: "Enter an email address.", background: MessageColors.WARNING }));
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
                dispatch(setMessage({ message: "Enter an email address.", background: MessageColors.WARNING }));
            }
            else if (response.status == 404) {
                dispatch(setMessage({ message: "Account not found with that email.", background: MessageColors.WARNING }));
            }
            else if (!response.ok) {
                dispatch(setError({ message: `Response status: ${response.status}` }));
            } else {
                const json = await response.json();
                dispatch(setMessage({ message: json.message, background: MessageColors.SUCCESS }));
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
