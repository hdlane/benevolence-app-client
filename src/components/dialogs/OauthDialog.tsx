import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader } from "lucide-react";
import createApi from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

function OauthDialog({ onOpenChange }) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchParams,] = useSearchParams();
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const code = searchParams.get("code");

    async function handleSubmit() {
        const controller = new AbortController();

        const api = createApi({ endpoint: `/oauth/complete?code=${code}` });
        try {
            setIsLoading(true);
            const response = await api.get({ controller: controller });
            const json = await response.json();

            if (response.ok) {
                toast({
                    description: "Authorization Complete! Login with your admin email address and perform first sync",
                });
                navigate("/login");
            } else if (response.status == 409) {
                toast({
                    description: `${json.errors.detail}`,
                    action: <button className="button-primary" onClick={() => navigate("/login")}>Login</button>
                });
            } else {
                toast({
                    variant: "destructive",
                    description: `${json.errors.detail}`,
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: `${error}`,
            });
        } finally {
            setIsDisabled(false);
            setIsLoading(false);
        }
    }

    return <>
        <DialogHeader>
            <DialogTitle className="text-center">
                Authorize Planning Center
            </DialogTitle>
            <DialogDescription className="text-md text-center hidden">
                Complete connection with Planning Center
            </DialogDescription>
        </DialogHeader>
        {isLoading ? (
            <>
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <Loader className="w-8 h-8 animate-spin text-primary" />
                </div>
                <div className="grid gap-4 py-4 text-center">
                    <div className="grid grid-cols-all items-center gap-4">
                        <p>Connecting with Planning Center will allow:</p>
                        <ul className="list-disc ml-3">
                            <li className="text-left">People in your organization can login using their email address</li>
                            <li className="text-left">People can be recipients, coordinators, and providers of benevolence</li>
                            <li className="text-left">Current PCO People admins to be admins in the app</li>
                        </ul>
                        <p className="text-gray-500 text-sm">Information we collect: Name, Email, Phone Number</p>
                    </div>
                </div>
            </>
        ) : (
            <div className="grid gap-4 py-4 text-center">
                <div className="grid grid-cols-all items-center gap-4">
                    <p>Connecting with Planning Center will allow:</p>
                    <ul className="list-disc ml-3">
                        <li className="text-left">People in your organization can login using their email address</li>
                        <li className="text-left">People can be recipients, coordinators, and providers of benevolence</li>
                        <li className="text-left">Current PCO People admins to be admins in the app</li>
                    </ul>
                    <p className="text-gray-500 text-sm">Information we collect: Name, Email, Phone Number</p>
                </div>
            </div>
        )}
        <DialogFooter className="flex-col sm:flex-row">
            <button
                className="button-primary"
                type="button"
                disabled={isDisabled}
                onClick={() => {
                    setIsDisabled(true)
                    handleSubmit();
                }}
            >
                Authorize
            </button>
            <button
                className="button-outline mt-5 sm:m-0"
                type="button"
                disabled={isDisabled}
                onClick={() => {
                    onOpenChange(false);
                }}
            >
                Cancel
            </button>
        </DialogFooter>
    </>
}

export default OauthDialog;
