import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "../ui/calendar";
import { Input } from "@/components/ui/input"
import { CalendarIcon, Plus } from "lucide-react";
import TimePicker from "../TimePicker";
import { Textarea } from "../ui/textarea";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { DonationServiceUpdateSchema } from "@/lib/schemas/donationServiceUpdateSchema";
import { useToast } from "@/hooks/use-toast";
import createApi from "@/lib/api";

function RequestUpdateDonationServiceForm({ request, people }) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [selectedRecipient, setSelectedRecipient] = useState(people.filter((person) => person.id == request.recipient_id)[0]);
    const [selectedCoordinator, setSelectedCoordinator] = useState(people.filter((person) => person.id == request.coordinator_id)[0]);
    // TODO: make popovers close after selecting date
    const [openRecipientSearch, setOpenRecipientSearch] = useState(false);
    const [openCoordinatorSearch, setOpenCoordinatorSearch] = useState(false);
    const [resources, setResources] = useState([]);
    const [resourceName, setResourceName] = useState("");
    const [resourceQuantity, setResourceQuantity] = useState(1);
    const resourceNameRef = useRef(null);
    const resourceQuantityRef = useRef(null);

    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const endDateRange = new Date(new Date().setHours(0, 0, 0, 0));
    endDateRange.setMonth(today.getMonth() + 3);
    const form = useForm<z.infer<typeof DonationServiceUpdateSchema>>({
        resolver: zodResolver(DonationServiceUpdateSchema),
        defaultValues: {
            title: request.title,
            notes: request.notes,
            recipient_id: selectedRecipient?.id,
            coordinator_id: selectedCoordinator?.id,
            // date_single_day: today,
            // start_date: today,
            // end_date: today,
            street_line: request.street_line,
            city: request.city,
            state: request.state,
            zip_code: request.zip_code,
        },
    });

    function onSubmit(values: z.infer<typeof DonationServiceUpdateSchema>) {
        const results = {
            request: {
                recipient_id: values.recipient_id,
                coordinator_id: values.coordinator_id,
                request_type: request.request_type,
                title: values.title,
                notes: values.notes,
                // start_date: values.start_date,
                // end_date: values.end_date,
                street_line: values.street_line,
                city: values.city,
                state: values.state,
                zip_code: values.zip_code,
            },
            resources: values.resources,
        }

        async function putRequestData(request_data) {
            const api = createApi({ endpoint: `/requests/${request.id}` });
            const controller = new AbortController();

            try {
                const response = await api.put({
                    body: request_data,
                    controller: controller,
                });
                const json = await response.json();

                if (!response.ok) {
                    if (response.status == 401) {
                        toast({
                            variant: "destructive",
                            description: `${json.errors.detail}`
                        });
                        navigate("/login");
                    } else {
                        toast({
                            variant: "destructive",
                            description: `${json.errors.detail}`
                        });
                    }
                }
                else {
                    toast({
                        description: "Update successful!",
                    });
                    navigate(`/requests/${request.id}`);
                }
            } catch (error) {
                console.error(error)
                toast({
                    variant: "destructive",
                    description: `${error}`
                });
            }
        }

        putRequestData(results);
    }

    return <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 pt-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem className="sm:col-span-full">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input maxLength={100} placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="recipient_id" render={() => (
                    <FormItem className="sm:col-span-3">
                        <FormLabel>Recipient</FormLabel>
                        <Popover open={openRecipientSearch} onOpenChange={setOpenRecipientSearch}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button className="w-full" variant={"outline"} role={"combobox"} >
                                        {selectedRecipient ? selectedRecipient.name : "Select Recipient"}
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Command>
                                    <CommandInput placeholder="Search for Recipient" />
                                    <CommandList>
                                        <CommandEmpty>No results found.</CommandEmpty>
                                        {
                                            people.map((person, index) => (
                                                <CommandItem className="py-3" key={index} onSelect={() => {
                                                    form.setValue("recipient_id", person.id);
                                                    setSelectedRecipient(person)
                                                    setOpenRecipientSearch(false)
                                                }}>
                                                    <>
                                                        {person.name}
                                                        <br />
                                                        {person.email && person.email}
                                                        {person.phone_number && <><br />{person.phone_number}</>}
                                                    </>
                                                </CommandItem>
                                            ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="coordinator_id" render={() => (
                    <FormItem className="sm:col-span-3">
                        <FormLabel>Coordinator</FormLabel>
                        <Popover open={openCoordinatorSearch} onOpenChange={setOpenCoordinatorSearch}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button className="w-full" variant={"outline"} role={"combobox"} >
                                        {selectedCoordinator ? selectedCoordinator.name : "Select Coordinator"}
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Command>
                                    <CommandInput placeholder="Search for Coordinator" />
                                    <CommandList>
                                        <CommandEmpty>No results found.</CommandEmpty>
                                        {
                                            people.map((person, index) => (
                                                <CommandItem className="py-3" key={index} onSelect={() => {
                                                    form.setValue("coordinator_id", person.id);
                                                    setSelectedCoordinator(person)
                                                    setOpenCoordinatorSearch(false)
                                                }}>
                                                    <>
                                                        {person.name}
                                                        <br />
                                                        {person.email && person.email}
                                                        {person.phone_number && <><br />{person.phone_number}</>}
                                                    </>
                                                </CommandItem>
                                            ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem className="col-span-full">
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                            <Textarea maxLength={500} placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 col-span-full">
                    <FormField control={form.control} name="street_line" render={({ field }) => (
                        <FormItem className="col-span-full">
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                                <Input maxLength={100} placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem className="col-span-full">
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input maxLength={50} placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input maxLength={2} placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField control={form.control} name="zip_code" render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                                <Input maxLength={10} placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <button className="button-primary mb-10 col-span-1" type="button" onClick={form.handleSubmit(onSubmit)}>Submit</button>
            </form>
        </Form >
    </>
}

export default RequestUpdateDonationServiceForm;