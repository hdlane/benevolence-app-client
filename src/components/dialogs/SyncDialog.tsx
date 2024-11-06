import React, { useState } from "react";
import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import createApi from "@/lib/api";
import { Loader } from "lucide-react";

function SyncDialog({ onOpenChange, onReloadChange }) {
    const { toast } = useToast();
    const [isDisabled, setIsDisabled] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    async function handleSync() {
        const controller = new AbortController();
        const api = createApi({ endpoint: "/sync" })

        try {
            setIsSyncing(true);
            const response = await api.get({ controller: controller });
            const json = await response.json();

            if (response.ok) {
                toast({
                    description: `Planning Center Sync Complete: ${json.meta.count} people synced`
                });
                onReloadChange(true);
                onOpenChange(false);
            } else {
                toast({
                    variant: "destructive",
                    description: `${json.errors.detail}`
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: `${error}`,
            });
        } finally {
            setIsDisabled(false);
            setIsSyncing(false);
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-center">
                    Sync with Planning Center
                </DialogTitle>
                <DialogDescription className="text-md text-center">
                    Begin Sync with Planning Center People
                </DialogDescription>
            </DialogHeader>
            {isSyncing ? (
                <>
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                        <Loader className="w-8 h-8 animate-spin text-primary" />
                    </div>
                    <div className="grid gap-4 py-4 text-center">
                        <div className="grid grid-cols-all items-center gap-4">
                            <p>Syncing with Planning Center People will:</p>
                            <ul>
                                <li>Create people added since last sync</li>
                                <li>Update information that has changed</li>
                                <li>Remove people deleted since last sync</li>
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <div className="grid gap-4 py-4 text-center">
                    <div className="grid grid-cols-all items-center gap-4">
                        <p>Syncing with Planning Center People will:</p>
                        <ul>
                            <li>Create people added since last sync</li>
                            <li>Update information that has changed</li>
                            <li>Remove people deleted since last sync</li>
                        </ul>
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
                        handleSync();
                    }}
                >
                    Begin Sync
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
    )
}

export default SyncDialog;
