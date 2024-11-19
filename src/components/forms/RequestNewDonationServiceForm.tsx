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
import { CalendarIcon, ChevronDown, Plus } from "lucide-react";
import TimePicker from "../TimePicker";
import { Textarea } from "../ui/textarea";
import { useNavigate } from "react-router-dom";
import { DonationServiceSchema } from "@/lib/schemas/donationServiceSchema";
import { useToast } from "@/hooks/use-toast";
import createApi from "@/lib/api";

function RequestNewDonationServiceForm({ requestType, people }) {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [selectedCoordinator, setSelectedCoordinator] = useState(null);
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
    const form = useForm<z.infer<typeof DonationServiceSchema>>({
        resolver: zodResolver(DonationServiceSchema),
        defaultValues: {
            title: "",
            notes: "",
            date_single_day: today,
            start_date: today,
            end_date: today,
            street_line: "",
            city: "",
            state: "",
            zip_code: "",
        },
    });

    function onSubmit(values: z.infer<typeof DonationServiceSchema>) {
        const results = {
            request: {
                recipient_id: values.recipient_id,
                coordinator_id: values.coordinator_id,
                request_type: requestType,
                title: values.title,
                notes: values.notes,
                start_date: values.start_date,
                end_date: values.end_date,
                street_line: values.street_line,
                city: values.city,
                state: values.state,
                zip_code: values.zip_code,
            },
            resources: values.resources,
        }

        async function postData(results) {
            const api = createApi({ endpoint: "/requests" });
            const controller = new AbortController();

            try {
                const response = await api.post({
                    body: results,
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
                        description: "Request successfully created!",
                    });
                    navigate(`/requests/${json.id}`);
                }
            } catch (error) {
                console.error(error)
                toast({
                    variant: "destructive",
                    description: `${error}`
                });
            }
        }

        postData(results);
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
                                        {
                                            selectedRecipient ? selectedRecipient.name :
                                                (
                                                    <>
                                                        Select Recipient
                                                        <ChevronDown className="h-4 w-4" />
                                                    </>
                                                )
                                        }
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
                                        {
                                            selectedCoordinator ? selectedCoordinator.name :
                                                (
                                                    <>
                                                        Select Coordinator
                                                        <ChevronDown className="h-4 w-4" />
                                                    </>
                                                )
                                        }
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
                            <Input type="number" ref={resourceQuantityRef} placeholder="Quantity" defaultValue={1} min={1} max={100} onChange={(e) => setResourceQuantity(parseInt(e.target.value))} />
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
                                        resourceQuantityRef.current.value = 1;
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
                                            const tempFrom = form.getValues("start_date");
                                            const tempTo = form.getValues("end_date");
                                            const start_date = new Date(tempFrom.setFullYear(date?.getFullYear(), date?.getMonth(), date?.getDate()))
                                            const end_date = new Date(tempTo.setFullYear(date?.getFullYear(), date?.getMonth(), date?.getDate()))
                                            form.setValue("date_single_day", date);
                                            form.setValue("start_date", start_date);
                                            form.setValue("end_date", end_date);
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
                    <FormField control={form.control} name="start_date" render={({ field }) => (
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
                    <FormField control={form.control} name="end_date" render={({ field }) => (
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
