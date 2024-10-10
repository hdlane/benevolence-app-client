import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "./ui/calendar";
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "lucide-react";
import TimePicker from "./TimePicker";
import { Textarea } from "./ui/textarea";

const RequestTypeEnum = z.enum(["Donation", "Meal", "Service"]);
type RequestTypeEnum = z.infer<typeof RequestTypeEnum>;
const zipCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;

const requestFormSchema = z.object({
    request_type: RequestTypeEnum,
    title: z.string().min(1, { message: "Enter a Title" }).max(100, { message: "Title max length 100 characters" }),
    notes: z.string().min(1, { message: "Enter Notes" }).max(500, { message: "Notes max length 1000 characters" }),
    allergies: z.string().max(100, { message: "Allergies max length 100 characters" }),
    start_datetime: z.date(),
    end_datetime: z.date(),
    street_line: z.string().min(1, { message: "Enter a Street Address" }).max(100, { message: "Street Address max length 100 characters" }),
    city: z.string().min(1, { message: "Enter a City" }).max(50, { message: "City max length 50 characters" }),
    state: z.string().length(2, { message: "Use State abbreviation of 2 characters" }).transform((val) => val.toUpperCase()),
    zip_code: z.string().refine((val) => zipCodeRegex.test(val), { message: "Invalid ZIP code format (12345 / 12345-1234)" }),
});

function RequestNewForm() {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const form = useForm<z.infer<typeof requestFormSchema>>({
        resolver: zodResolver(requestFormSchema),
        defaultValues: {
            request_type: "Meal",
            title: "",
            notes: "",
            allergies: "",
            start_datetime: today,
            end_datetime: today,
            street_line: "",
            city: "",
            state: "",
            zip_code: "",
        }
    });
    function onSubmit(values: z.infer<typeof requestFormSchema>) {
        console.log(values);
    }
    return <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 justify-center">
                <FormField control={form.control} name="request_type" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Donation">Donation</SelectItem>
                                    <SelectItem value="Meal">Meal</SelectItem>
                                    <SelectItem value="Service">Service</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl>
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
                    control={form.control} name="start_datetime" render={({ field }) => (
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
                                                format(field.value, "Pp")
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
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                    />
                                    <div className="p-3 border-t border-border">
                                        <TimePicker date={field.value} setDate={field.onChange} />
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control} name="end_datetime" render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn(
                                            "w-[240px] justify-between pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                            {field.value ? (
                                                format(field.value, "Pp")
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
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                    />
                                    <div className="p-3 border-t border-border">
                                        <TimePicker date={field.value} setDate={field.onChange} />
                                    </div>
                                </PopoverContent>
                            </Popover>
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
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    </>
}

export default RequestNewForm;
