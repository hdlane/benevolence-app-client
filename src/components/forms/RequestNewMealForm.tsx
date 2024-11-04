import React, { useState } from "react";
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
import { CalendarIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { MealSchema } from "@/lib/schemas/mealSchema";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { useToast } from "@/hooks/use-toast";
import createApi from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

function RequestNewMealForm({ requestType, people }) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [selectedCoordinator, setSelectedCoordinator] = useState(null);
    const [openRecipientSearch, setOpenRecipientSearch] = useState(false);
    const [openCoordinatorSearch, setOpenCoordinatorSearch] = useState(false);
    // TODO: make popovers close after selecting date
    const [dateRangeFrom, setDateRangeFrom] = useState(false);
    const [dateRangeTo, setDateRangeTo] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const endDateRange = new Date(new Date().setHours(0, 0, 0, 0));
    endDateRange.setMonth(today.getMonth() + 3);
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
                start_date: today,
                end_date: endDateRange,
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
        const selected_days = [];
        values.selected_days?.forEach((day) => {
            selected_days.push(day - 1);
        })
        const results = {
            request: {
                recipient_id: values.recipient_id,
                coordinator_id: values.coordinator_id,
                request_type: requestType,
                title: values.title,
                notes: values.notes,
                allergies: values.allergies,
                selected_days: selected_days,
                start_date: values.date_range?.start_date,
                end_date: values.date_range?.end_date,
                street_line: values.street_line,
                city: values.city,
                state: values.state,
                zip_code: values.zip_code,
            },
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
            <form id="meal-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 pt-4">
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
                    <FormItem className="sm:col-span-3">
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                            <Textarea maxLength={500} placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="allergies" render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                            <Textarea maxLength={100} placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 sm:col-span-4">
                    <FormField
                        control={form.control} name="date_range.start_date" render={({ field }) => (
                            <FormItem className="sm:col-span-3">
                                <FormLabel>Start Date</FormLabel>
                                <Popover open={dateRangeFrom} onOpenChange={setDateRangeFrom}>
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
                        control={form.control} name="date_range.end_date" render={({ field }) => (
                            <FormItem className="sm:col-span-3">
                                <FormLabel>End Date</FormLabel>
                                <Popover open={dateRangeTo} onOpenChange={setDateRangeTo}>
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
                </div>
                <FormField
                    control={form.control}
                    name="selected_days"
                    render={() => (
                        <FormItem className="sm:col-span-2 sm:place-self-center">
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
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 col-span-full">
                    <FormField control={form.control} name="street_line" render={({ field }) => (
                        <FormItem className="sm:col-span-full">
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                                <Input maxLength={100} placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem className="sm:col-span-full">
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
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <button
                            className="button-primary mb-10 col-span-1"
                            type="button"
                        >
                            Submit
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Confirm Meal Request
                            </DialogTitle>
                            <DialogDescription>
                                Verify dates and delivery days
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-all items-center gap-4">
                                <p>
                                    Please confirm the date range and delivery days. You will not be able to update after creating this Meal Request.
                                </p>
                                <p>
                                    Date Range:<br />
                                    <strong>
                                        {format(form.getValues("date_range.start_date"), "PP")} to {format(form.getValues("date_range.end_date"), "PP")}
                                    </strong>
                                </p>
                                <p>
                                    Delivery Days:<br />
                                    <strong>
                                        {form.getValues("selected_days")!.sort().map((selected_day) => (
                                            <p>{days.filter((day) => day.id == selected_day)[0].label}</p>
                                        ))}
                                    </strong>
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row">
                            <button
                                className="button-primary"
                                type="submit"
                                form="meal-form"
                                onClick={() => {
                                    setDialogOpen(false);
                                }}
                            >
                                Submit
                            </button>
                            <button
                                className="button-outline mt-5 sm:m-0"
                                type="button"
                                onClick={() => {
                                    setDialogOpen(false);
                                }}
                            >
                                Cancel
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </form>
        </Form >
    </>
}

export default RequestNewMealForm;
