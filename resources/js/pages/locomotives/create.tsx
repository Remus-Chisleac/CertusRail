import React from 'react';
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
    // FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Locomotives',
        href: '/rolling-stock/locomotives',
    },
    {
        title: 'Create',
        href: '',
    },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars


export default function Create() {

    const formSchema = z.object({
        code: z.string().min(1, 'Code is required'),
        model: z.string().min(1, 'Model is required'),
        manufacturer: z.string().optional(),
        built_year: z.string()
            .regex(/^\d{4}$/, 'Year must be a 4-digit number') // Ensures the string has exactly 4 digits
            .refine(year => {
                const numericYear = parseInt(year, 10);
                return numericYear > 1804 && numericYear < 2025; // Checks the range
            }, {
                message: 'Year must be between 1805 and 2024',
            }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: '',
            model: '',
            manufacturer: '',
            built_year: '',
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post('/rolling-stock/locomotives', values, {
            onSuccess: () => {
                form.reset();
            }
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader className="flex flex-row justify-between">
                        <CardTitle>Locomotive Form</CardTitle>
                        <div id='action-buttons' className='flex gap-2'>
                            <Button type="submit" form="locomotive-form">
                                Create
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form id='locomotive-form' onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Code</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            {/* <FormDescription>
                                                This is your public display name.
                                            </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="model"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Model</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            {/* <FormDescription>
                                                This is your public display name.
                                            </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="manufacturer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Manufacturer</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            {/* <FormDescription>
                                                This is your public display name.
                                            </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="built_year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Built Year</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            {/* <FormDescription>
                                                This is your public display name.
                                            </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
