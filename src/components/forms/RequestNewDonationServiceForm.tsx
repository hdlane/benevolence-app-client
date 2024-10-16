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
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 pt-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem className="col-span-full">
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
                <FormField control={form.control} name="resources" render={() => (
                    <FormItem className="sm:col-span-3">
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
                                    <button className="button-primary p-2" type="button" onClick={(e) => {
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
                                ) : (
                                    <button className="button-primary p-2" type="button" disabled><Plus /></button>
                                )
                            }
                        </FormControl>
                    </FormItem>
                )}
                />
                {resources.length > 0 ? (
                    <div className="sm:col-span-3 border rounded p-5">
                        <p className="text-sm font-md mb-5">Resources:</p>
                        {resources.map((resource, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name="resources"
                                render={() => {
                                    return (
                                        <div className="space-y-4">
                                            <FormItem className="my-4">
                                                <FormControl>
                                                    <Button variant={"destructive"} className="button-primary h-3 w-3 p-3 mr-5" type="button" onClick={(e) => {
                                                        e.preventDefault();
                                                        const updatedResources = resources.filter((obj) => obj != resource);
                                                        setResources(updatedResources);
                                                        form.setValue("resources", updatedResources);
                                                    }}
                                                    >
                                                        <span>X</span>
                                                    </Button>
                                                </FormControl>
                                                <span className="mt-2">{resource.name} (x{resource.quantity})</span>
                                            </FormItem>
                                            <hr />
                                        </div>
                                    )
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="sm:col-span-3 border rounded p-5">
                        <p className="text-sm font-md mb-5">Resources:</p>
                        <p className="text-sm font-md mb-5 text-gray-500">None created yet!</p>
                    </div>
                )
                }
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 sm:col-span-full">
                    <FormField control={form.control} name="date_single_day" render={({ field }) => (
                        <FormItem className="col-span-full lg:col-span-2 md:col-span-full">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn(
                                            "flex justify-between w-full pl-3 text-left font-normal",
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
                        <FormItem className="col-span-full sm:col-span-3 lg:col-span-2 lg:justify-self-center">
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
                        <FormItem className="col-span-full sm:col-span-3 lg:col-span-2 lg:justify-self-end">
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
                </div>
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

export default RequestNewDonationServiceForm;
