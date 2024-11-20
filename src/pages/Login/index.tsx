import React, { useState } from "react";
import TitleBar from "@/components/TitleBar";
import { z } from "zod";
import createApi from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function Login() {
    const { toast } = useToast();
    const [email, setEmail] = useState<string>("");

    const submitButton = document.getElementById("submit-button");

    async function handleSubmit(e) {
        e.preventDefault();

        const api = createApi({ endpoint: "/login" });
        const controller = new AbortController();
        const parsedEmail = z.string().email().safeParse(email);

        if (!parsedEmail.success) {
            const message = parsedEmail.error.format();
            toast({
                description: message._errors[0],
            })
            return
        }

        try {
            const response = await api.post({
                body: { email },
                controller: controller,
            });
            const json = await response.json();
            if (!response.ok) {
                if (response.status === 400) {
                    toast({
                        variant: "destructive",
                        description: "Email address invalid",
                    });
                } else if (response.status === 404) {
                    toast({
                        variant: "destructive",
                        description: "Account not found with that email address",
                    });
                } else {
                    toast({
                        variant: "destructive",
                        description: `${json.errors.detail}`
                    });
                }
            } else {
                submitButton?.setAttribute("disabled", "true");
                if (json.redirect_url) {
                    toast({
                        description: `${json.message}`,
                    });
                    window.open(json.redirect_url, "_self");
                } else {
                    toast({
                        description: `${json.message}`,
                    });
                }
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: `${error}`,
            });
        }
    }

    return <>
        <TitleBar title={"Login"} />
        <div className="content flex items-center justify-center h-full">
            <div className="flex flex-col space-y-4 bg-white p-6 rounded text-center w-full max-w-md">
                <p className="text-lg font-semibold">To get started, enter your email address.</p>
                <p>We'll send you a link you can use to login.</p>
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
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:flex-row-reverse sm:items-center py-2">
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
