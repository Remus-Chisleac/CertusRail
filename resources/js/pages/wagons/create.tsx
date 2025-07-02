import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Breadcrumb configuration
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wagons',
        href: '/rolling-stock/wagons',
    },
    {
        title: 'Create',
        href: '/rolling-stock/wagons/create',
    },
];

// Define an enum for the wagon types for better type safety
const WagonTypeEnum = z.enum(['Passenger', 'Freight'], {
    required_error: "Please select a wagon type."
});

// Zod schema for form validation with updated rules
const formSchema = z.object({
    code: z.string().min(3, 'Code must be at least 3 characters long'),
    type: WagonTypeEnum,
    capacity: z.coerce.number().optional(), // Start as optional
}).superRefine((data, ctx) => {
    if (data.type) {
        if (!data.capacity) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Capacity is required.",
                path: ["capacity"],
            });
        } else if (data.capacity <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Capacity must be a positive number.",
                path: ["capacity"],
            });
        }
    }
});


export default function Create() {
    // State to manage form submission status
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: '',
            capacity: undefined,
        },
    });

    // Watch the 'type' field to conditionally render the capacity input
    const selectedType = form.watch('type');

    // Form submission handler
    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        router.post('/rolling-stock/wagons', values, {
            onSuccess: () => {
                form.reset();
                router.visit('/rolling-stock/wagons');
            },
            onError: (errors) => {
                Object.keys(errors).forEach((key) => {
                    form.setError(key as keyof z.infer<typeof formSchema>, {
                        type: 'server',
                        message: errors[key],
                    });
                });
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>New Wagon Form</CardTitle>
                        <div id='action-buttons' className='flex gap-2'>
                            <Button type="submit" form="wagon-form" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create'}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form id='wagon-form' onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Code</FormLabel>
                                                <FormControl className="content-start">
                                                    <Input placeholder="e.g., GBS-2451" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a wagon type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Passenger">Passenger</SelectItem>
                                                        <SelectItem value="Freight">Freight</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Conditionally render capacity field */}
                                    {selectedType && (
                                        <FormField
                                            control={form.control}
                                            name="capacity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {selectedType === 'Passenger' ? 'Passenger Capacity' : 'Carrying Capacity (tons)'}
                                                    </FormLabel>
                                                    <FormControl>
                                                        {/* Setting value to empty string if null/undefined to avoid React warnings */}
                                                        <Input type="number" placeholder={selectedType === 'Passenger' ? 'e.g., 72' : 'e.g., 100'} {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
