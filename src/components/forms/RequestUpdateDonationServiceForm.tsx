import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea";
import { useNavigate } from "react-router-dom";
import { DonationServiceUpdateSchema } from "@/lib/schemas/donationServiceUpdateSchema";
import { useToast } from "@/hooks/use-toast";
import createApi from "@/lib/api";
import { CalendarIcon, Plus } from "lucide-react";
import ResourceItem from "./ui/ResourceItem";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import TimePicker from "../TimePicker";

function RequestUpdateDonationServiceForm({ request, people }) {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [selectedRecipient, setSelectedRecipient] = useState(people.find((person) => person.id == request.recipient_id));
    const [selectedCoordinator, setSelectedCoordinator] = useState(people.find((person) => person.id == request.coordinator_id));
    // TODO: make popovers close after selecting date
    const [openRecipientSearch, setOpenRecipientSearch] = useState(false);
    const [openCoordinatorSearch, setOpenCoordinatorSearch] = useState(false);
    const [resources, setResources] = useState(request.resources);
    const [newResources, setNewResources] = useState([]);
    const [newResourceName, setNewResourceName] = useState("");
    const [newResourceQuantity, setNewResourceQuantity] = useState(1);
    const [updatedResources, setUpdatedResources] = useState([]);
    const [updatedResourceName, setUpdatedResourceName] = useState("");
    const [deletedResources, setDeletedResources] = useState([]);
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
            date_single_day: new Date(request.start_date),
            start_date: new Date(request.start_date),
            end_date: new Date(request.end_date),
            street_line: request.street_line,
            city: request.city,
            state: request.state,
            zip_code: request.zip_code,
        },
    });

    function onSubmit(values: z.infer<typeof DonationServiceUpdateSchema>) {
        const resources = {
            new: [
                ...newResources,
            ],
            updated: [
                ...updatedResources,
            ],
            deleted: [
                ...deletedResources,
            ]
        }

        const results = {
            request: {
                id: request.id,
                recipient_id: values.recipient_id,
                coordinator_id: values.coordinator_id,
                request_type: request.request_type,
                title: values.title,
                notes: values.notes,
                start_date: values.start_date,
                end_date: values.end_date,
                street_line: values.street_line,
                city: values.city,
                state: values.state,
                zip_code: values.zip_code,
            },
            resources: resources,
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
                <FormField control={form.control} name="resources" render={() => (
                    <FormItem className="sm:col-span-2">
                        <FormLabel>Resources Needed</FormLabel>
                        <FormItem>
                            <Input
                                type="text"
                                ref={resourceNameRef}
                                placeholder={request.request_type == "Donation" ? "Item" : "Assignment"}
                                onChange={(e) => setNewResourceName(e.target.value)}
                            />
                        </FormItem>
                        <FormItem>
                            <Input
                                type="number"
                                ref={resourceQuantityRef}
                                placeholder="Quantity"
                                defaultValue={1}
                                min={1}
                                max={100}
                                onChange={(e) => setNewResourceQuantity(parseInt(e.target.value))}
                            />
                        </FormItem>
                        <FormMessage />
                        <FormControl>
                            {
                                (newResourceName != "" && newResourceQuantity > 0) ? (
                                    <button className="button-primary p-2" type="button" onClick={(e) => {
                                        e.preventDefault();
                                        const updatedNewResources = [
                                            ...newResources,
                                            {
                                                name: newResourceName,
                                                quantity: newResourceQuantity,
                                            }
                                        ];
                                        setNewResources(updatedNewResources);
                                        form.setValue("new_resources", updatedNewResources);
                                        resourceNameRef.current.value = "";
                                        resourceQuantityRef.current.value = 1;
                                        resourceNameRef.current.focus();
                                        setNewResourceName("");
                                        setNewResourceQuantity(1)
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
                <div className="sm:col-span-4 border rounded p-5">
                    {resources.length > 0 ? (
                        <>
                            <p className="text-sm font-md mb-5">Unchanged Resources:</p>
                            {resources.map((resource) => (
                                <ResourceItem
                                    key={resource.id}
                                    resource={resource}
                                    form={form}
                                    updatedResourceName={updatedResourceName}
                                    setUpdatedResourceName={setUpdatedResourceName}
                                    setResources={setResources}
                                    updatedResources={updatedResources}
                                    setUpdatedResources={setUpdatedResources}
                                    deletedResources={deletedResources}
                                    setDeletedResources={setDeletedResources}
                                />
                            ))}
                        </>
                    ) : null}
                    {newResources.length > 0 ? (
                        <>
                            <p className="text-sm font-md mb-5">New Resources:</p>
                            {newResources.map((resource, index) => (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name="resources"
                                    render={() => {
                                        return (
                                            <div className="space-y-4">
                                                <FormItem className="flex items-center my-4">
                                                    <FormControl>
                                                        <Button variant={"destructive"} className="button-primary h-3 w-3 p-3 mr-5" type="button" onClick={(e) => {
                                                            e.preventDefault();
                                                            const updatedNewResources = setNewResources(prev => prev.filter((obj) => obj != resource))
                                                            form.setValue("new_resources", updatedNewResources);
                                                        }}
                                                        >
                                                            <span>X</span>
                                                        </Button>
                                                    </FormControl>
                                                    <Input
                                                        disabled
                                                        type="text"
                                                        defaultValue={resource.name}
                                                    />
                                                    <Input disabled type="number" className="w-12 ml-5" defaultValue={resource.quantity} />
                                                    <hr />
                                                </FormItem>
                                            </div>
                                        )
                                    }}
                                />
                            ))}
                        </>
                    ) : null}
                    {updatedResources.length > 0 ? (
                        <>
                            <p className="text-sm font-md mb-5">Updated Resources:</p>
                            {updatedResources.map((resource) => (
                                <FormField
                                    key={resource.id}
                                    control={form.control}
                                    name="resources"
                                    render={() => {
                                        return (
                                            <div className="space-y-4">
                                                <FormItem className="flex items-center my-4">
                                                    <FormControl>
                                                        <Button variant={"destructive"} className="button-primary h-3 w-3 p-3 mr-5" type="button" onClick={(e) => {
                                                            e.preventDefault();
                                                            const newUpdatedResources = setResources(prev => [
                                                                ...prev,
                                                                resource,
                                                            ])
                                                            setUpdatedResources(prev => prev.filter((obj) => obj.id != resource.id))
                                                            form.setValue("updated_resources", newUpdatedResources);
                                                        }}
                                                        >
                                                            <span>X</span>
                                                        </Button>
                                                    </FormControl>
                                                    <Input
                                                        type="text"
                                                        disabled
                                                        defaultValue={resource.name}
                                                    />
                                                    <Input disabled type="number" className="w-12 ml-5" defaultValue={resource.quantity} />
                                                    <hr />
                                                </FormItem>
                                            </div>
                                        )
                                    }}
                                />
                            ))}
                        </>
                    ) : null}
                    {deletedResources.length > 0 ? (
                        <>
                            <p className="text-sm font-md mb-5">Deleted Resources:</p>
                            {deletedResources.map((resource) => (
                                <FormField
                                    key={resource.id}
                                    control={form.control}
                                    name="resources"
                                    render={() => {
                                        return (
                                            <div className="space-y-4">
                                                <FormItem className="flex items-center my-4">
                                                    <FormControl>
                                                        <Button variant={"destructive"} className="button-primary h-3 w-3 p-3 mr-5" type="button" onClick={(e) => {
                                                            e.preventDefault();
                                                            const newResources = setResources(prev => [
                                                                ...prev,
                                                                resource,
                                                            ])
                                                            const updatedDeletedResources = setDeletedResources(prev => prev.filter((obj) => obj != resource))
                                                            form.setValue("deleted_resources", updatedDeletedResources);
                                                            form.setValue("resources", newResources);
                                                        }}
                                                        >
                                                            <span>X</span>
                                                        </Button>
                                                    </FormControl>
                                                    <Input
                                                        type="text"
                                                        disabled
                                                        defaultValue={resource.name}
                                                    />
                                                    <Input disabled type="number" className="w-12 ml-5" defaultValue={resource.quantity} />
                                                    <hr />
                                                </FormItem>
                                            </div>
                                        )
                                    }}
                                />
                            ))}
                        </>
                    ) : null}
                </div>
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

export default RequestUpdateDonationServiceForm;
