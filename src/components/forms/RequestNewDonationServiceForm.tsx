import React, { useEffect, useState } from "react";
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
import { CalendarIcon } from "lucide-react";
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
        shouldUnregister: true,
    });

    function onSubmit(values: z.infer<typeof DonationServiceSchema>) {
        console.log("SUBMITTED");
        const results = { ...values, request_type: requestType, date_single: { from: values.date_single_from, to: values.date_single_to } }
        console.log(results);
    }

    return <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 justify-center">
                <FormField control={form.control} name="recipient_id" render={({ field }) => (
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
                <FormField control={form.control} name="coordinator_id" render={({ field }) => (
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
                <button className="button-primary" type="submit">Submit</button>
            </form>
        </Form >
    </>
}

export default RequestNewDonationServiceForm;
