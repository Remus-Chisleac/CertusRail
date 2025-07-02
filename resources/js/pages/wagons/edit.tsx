import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Wagon } from '@/models/Wagon';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { router, useForm } from '@inertiajs/react';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Props interface for the Edit component
interface EditProps {
    wagon: Wagon;
}

export default function Edit({ wagon }: EditProps) {
    // Breadcrumb configuration
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Wagons', href: '/rolling-stock/wagons' },
        { title: wagon.code, href: `/rolling-stock/wagons/${wagon.id}` },
        { title: 'Edit', href: '' },
    ];

    // Use Inertia's useForm hook to manage form state and submissions
    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        code: wagon.code || '',
        type: wagon.type || '',
        capacity: wagon.capacity || undefined,
    });

    // Handler for the delete action, with a confirmation dialog
    const onDelete = () => {
        destroy(`/rolling-stock/wagons/${wagon.id}`, {
            onSuccess: () => router.visit('/rolling-stock/wagons'),
        });
    };

    // Handler for the save action
    const onSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Note: You might want to add client-side validation here as well
        // before submitting, similar to the Create component, if desired.
        put(`/rolling-stock/wagons/${wagon.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-4 p-6">
                <form onSubmit={onSave}>
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Wagon Editor</CardTitle>
                            <div id='action-buttons' className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" disabled={processing}>
                                            Delete Wagon
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>You are about to delete a wagon</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete wagon {data.code}? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="code">Code</Label>
                                    <Input
                                        id="code"
                                        type='text'
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                    />
                                    {errors.code && <div className="mt-1 text-red-500 text-sm">{errors.code}</div>}
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger id="type">
                                            <SelectValue placeholder="Select a wagon type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="passenger">Passenger</SelectItem>
                                            <SelectItem value="freight">Freight</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <div className="mt-1 text-red-500 text-sm">{errors.type}</div>}
                                </div>

                                {/* Conditionally render capacity field based on the selected type */}
                                {data.type && (
                                    <div className="space-y-1">
                                        <Label htmlFor="capacity">
                                            {data.type === 'passenger' ? 'Passenger Capacity' : 'Carrying Capacity (tons)'}
                                        </Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            value={data.capacity ?? ''}
                                            onChange={(e) => setData('capacity', e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                                        />
                                        {errors.capacity && <div className="mt-1 text-red-500 text-sm">{errors.capacity}</div>}
                                    </div>
                                )}
                            </div>
                            <Separator className="my-4" />
                            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                                {/* Read-only fields for creation/update timestamps */}
                                <div className="space-y-1">
                                    <Label htmlFor="createdAt">Created At</Label>
                                    <Input id="createdAt" value={wagon.created_at ? new Date(wagon.created_at).toLocaleString() : '—'} readOnly />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="updatedAt">Updated At</Label>
                                    <Input id="updatedAt" value={wagon.updated_at ? new Date(wagon.updated_at).toLocaleString() : '—'} readOnly />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
