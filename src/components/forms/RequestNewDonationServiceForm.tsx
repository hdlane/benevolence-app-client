import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MessageColors, setMessage } from "@/features/messages/messagesSlice";
import { setError } from "@/features/errors/errorsSlice";
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
import { CalendarIcon, Minus, Plus } from "lucide-react";
import TimePicker from "../TimePicker";
import { Textarea } from "../ui/textarea";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { DonationServiceSchema } from "@/lib/schemas/donationServiceSchema";

function RequestNewDonationServiceForm({ requestType, people }) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [selectedCoordinator, setSelectedCoordinator] = useState(null);
    // TODO: make popovers close after selecting date
    const [openRecipientSearch, setOpenRecipientSearch] = useState(false);
    const [openCoordinatorSearch, setOpenCoordinatorSearch] = useState(false);
    const [resources, setResources] = useState([]);
    const [resourceName, setResourceName] = useState("");
    const [resourceQuantity, setResourceQuantity] = useState(1);
    const resourceNameRef = useRef(null);

    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const endDateRange = new Date(new Date().setMonth(today.getMonth() + 3));
    const form = useForm<z.infer<typeof DonationServiceSchema>>({
        resolver: zodResolver(DonationServiceSchema),
        defaultValues: {
            title: "",
            notes: "",
            date_single_day: today,
            date_single_from: today,
            date_single_to: today,
            street_line: "",
            city: "",
            state: "",
            zip_code: "",
        },
    });

    function onSubmit(values: z.infer<typeof DonationServiceSchema>) {
        const results = { ...values, request_type: requestType, date_single: { from: values.date_single_from, to: values.date_single_to } }
        console.log(results);

        async function postData(results) {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/v1/requests",
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(results),
                    }
                );
                const json = await response.json();
                if (response.status == 400) {
                    dispatch(setMessage({ message: "400 status", background: MessageColors.WARNING }));
                } else if (response.status == 401) {
                    dispatch(setMessage({ message: json.errors.detail, background: MessageColors.WARNING }));
                    navigate("/login");
                } else if (response.status == 403) {
                    dispatch(setMessage({ message: "You do not have permission to access this request", background: MessageColors.WARNING }));
                }
                else if (response.status == 404) {
                    dispatch(setMessage({ message: "Request could not be found", background: MessageColors.WARNING }));
                }
                else if (!response.ok) {
                    dispatch(setError({ message: `Response status: ${json.error}` }));
                } else {
                    dispatch(setMessage({ message: json.message, background: MessageColors.SUCCESS }));
                }
            } catch (error) {
                dispatch(setError({ message: (error as Error).message }));
            }
        }

        postData(results);
    }

    return <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 justify-center">
                <FormField control={form.control} name="recipient_id" render={() => (
                    <FormItem>
                        <Popover open={openRecipientSearch} onOpenChange={setOpenRecipientSearch}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} role={"combobox"} >
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
                    <FormItem>
                        <Popover open={openCoordinatorSearch} onOpenChange={setOpenCoordinatorSearch}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} role={"combobox"} >
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
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input maxLength={100} placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                            <Textarea maxLength={500} placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="resources" render={() => (
                    <FormItem>
                        <FormLabel>Resources Needed</FormLabel>
                        <FormItem>
                            <Input type="text" ref={resourceNameRef} placeholder={requestType == "Donation" ? "Item" : "Assignment"} onChange={(e) => setResourceName(e.target.value)} />
                        </FormItem>
                        <FormItem>
                            <Input type="number" placeholder="Quantity" defaultValue={1} min={1} max={100} onChange={(e) => setResourceQuantity(parseInt(e.target.value))} />
                        </FormItem>
                        <FormMessage />
                        <FormControl>
                            {
                                (resourceName != "" && resourceQuantity > 0) ? (
                                    <button className="button-primary" type="button" onClick={(e) => {
                                        e.preventDefault();
                                        const updatedResources = [
                                            ...resources,
                                            {
                                                name: resourceName,
                                                quantity: resourceQuantity,
                                            }
                                        ];
                                        setResources(updatedResources);
                                        form.setValue("resources", updatedResources);
                                        resourceNameRef.current.value = "";
                                        resourceNameRef.current.focus();
                                        setResourceName("");
                                        setResourceQuantity(1)
                                    }}
                                    >
                                        <Plus />
                                    </button>
                                ) : (null)
                            }
                        </FormControl>
                        {resources.map((resource, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name="resources"
                                render={() => {
                                    return (
                                        <FormItem>
                                            <span>{resource.name} (x{resource.quantity})</span>
                                            <FormControl>
                                                <button className="button-primary" type="button" onClick={(e) => {
                                                    e.preventDefault();
                                                    const updatedResources = resources.filter((obj) => obj != resource);
                                                    setResources(updatedResources);
                                                    form.setValue("resources", updatedResources);
                                                }}
                                                >
                                                    <Minus />
                                                </button>
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
                            />
                        ))}
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="date_single_day" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn(
                                        "w-[240px] justify-between pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                        {field.value ? (
                                            format(field.value, "PP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="h-4 w-4" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                        const tempFrom = form.getValues("date_single_from");
                                        const tempTo = form.getValues("date_single_to");
                                        const from = new Date(tempFrom.setFullYear(date?.getFullYear(), date?.getMonth(), date?.getDate()))
                                        const to = new Date(tempTo.setFullYear(date?.getFullYear(), date?.getMonth(), date?.getDate()))
                                        form.setValue("date_single_day", date);
                                        form.setValue("date_single_from", from);
                                        form.setValue("date_single_to", to);
                                    }}
                                    disabled={(date) =>
                                        date < today || date > endDateRange
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="date_single_from" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                            <div className="p-3">
                                <TimePicker date={field.value} setDate={field.onChange} />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="date_single_to" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                            <div className="p-3">
                                <TimePicker date={field.value} setDate={field.onChange} />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="street_line" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                            <Input maxLength={100} placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input maxLength={50} placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                            <Input maxLength={2} placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="zip_code" render={({ field }) => (
                    <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                            <Input maxLength={10} placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <button className="button-primary" type="button" onClick={form.handleSubmit(onSubmit)}>Submit</button>
            </form>
        </Form >
    </>
}

export default RequestNewDonationServiceForm;
