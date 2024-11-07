import OauthDialog from "@/components/dialogs/OauthDialog";
import TitleBar from "@/components/TitleBar";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Oauth() {
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchParams,] = useSearchParams();
    const code = searchParams.get("code");

    useEffect(() => {
        if (!code) {
            navigate("/login");
        }
    }, [code])

    return <>
        <TitleBar title={"Authorize Planning Center"} />
        <div className="content">
            <Card className="flex flex-col p-5">
                <p className="text-lg my-5">Complete connection with Planning Center by clicking Authorize below</p>
                <div className="flex flex-col sm:flex-row items-center gap-2 mb-5">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <button className="button-primary max-w-xs" type="button">Authorize</button>
                        </DialogTrigger>
                        <DialogContent>
                            <OauthDialog onOpenChange={setDialogOpen} />
                        </DialogContent>
                    </Dialog>
                </div>
            </Card>
        </div>
    </>

}

export default Oauth;
