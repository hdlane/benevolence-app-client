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
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { MealSchema } from "@/lib/schemas/mealSchema";

function RequestNewMealForm({ requestType, people }) {

    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [selectedCoordinator, setSelectedCoordinator] = useState(null);
    const [openRecipientSearch, setOpenRecipientSearch] = useState(false);
    const [openCoordinatorSearch, setOpenCoordinatorSearch] = useState(false);
    // TODO: make popovers close after selecting date
    const [dateRangeFrom, setDateRangeFrom] = useState(false);
    const [dateRangeTo, setDateRangeTo] = useState(false);

    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const endDateRange = new Date(new Date().setMonth(today.getMonth() + 3));
    const days = [
        {
            id: 1,
            label: "Sunday",
        },
        {
            id: 2,
            label: "Monday",
        },
        {
            id: 3,
            label: "Tuesday",
        },
        {
            id: 4,
            label: "Wednesday",
        },
        {
            id: 5,
            label: "Thursday",
        },
        {
            id: 6,
            label: "Friday",
        },
        {
            id: 7,
            label: "Saturday",
        },
    ];
    const form = useForm<z.infer<typeof MealSchema>>({
        resolver: zodResolver(MealSchema),
        defaultValues: {
            title: "",
            notes: "",
            allergies: "",
            date_range: {
                from: today,
                to: endDateRange,
            },
            selected_days: [],
            street_line: "",
            city: "",
            state: "",
            zip_code: "",
        },
        shouldUnregister: true,
    });

    function onSubmit(values: z.infer<typeof MealSchema>) {
        console.log("SUBMITTED");
        const results = { ...values, request_type: requestType }
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
                <FormField control={form.control} name="allergies" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                            <Input maxLength={100} placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control} name="date_range.from" render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            {
                                // TODO: make popover close after date selection
                            }
                            <Popover open={dateRangeFrom} onOpenChange={setDateRangeFrom}>
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
                                        onSelect={field.onChange}
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
                <FormField
                    control={form.control} name="date_range.to" render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <Popover open={dateRangeTo} onOpenChange={setDateRangeTo}>
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
                                        onSelect={field.onChange}
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
                <FormField
                    control={form.control}
                    name="selected_days"
                    render={() => (
                        <FormItem>
                            <FormLabel>Delivery Days</FormLabel>
                            {days.map((day) => (
                                <FormField
                                    key={day.id}
                                    control={form.control}
                                    name="selected_days"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={day.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(day.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, day.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== day.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {day.label}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
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

export default RequestNewMealForm;
