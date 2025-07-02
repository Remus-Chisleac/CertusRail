import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Locomotive } from '@/models/Locomotive';
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
import { Separator } from '@/components/ui/separator';

interface ShowProps {
    locomotive: Locomotive;
}

export default function Edit({ locomotive }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Locomotives', href: '/rolling-stock/locomotives' },
        { title: locomotive.code, href: '/rolling-stock/locomotives/' + locomotive.id },
        { title: 'Edit', href: '' },
    ];

    // Use the useForm hook to manage your form state
    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        code: locomotive.code || '',
        model: locomotive.model || '',
        manufacturer: locomotive.manufacturer || '',
        built_year: locomotive.built_year || '',
    });

    const onDelete = () => {
        // Use the `destroy` method from the hook
        destroy(`/rolling-stock/locomotives/${locomotive.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                router.visit('/rolling-stock/locomotives');
            }
        });
    };

    const onSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Use the `put` method from the hook
        put(`/rolling-stock/locomotives/${locomotive.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Locomotive updated successfully');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-4 p-6">
                {/* Wrap content in a form element and use its onSubmit */}
                <form onSubmit={onSave}>
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Locomotive Editor</CardTitle>
                            <div id='action-buttons' className="flex gap-2">
                                {/* Disable button when processing */}
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" disabled={processing}>
                                            Delete Locomotive
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>You are about to delete a Locomotive</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete locomotive {data.code}?
                                                All data associated with this locomotive will be permanently removed.
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
                                        value={data.code} // Bind to hook's data object
                                        onChange={(e) => setData('code', e.target.value)} // Use setData to update state
                                    />
                                    {/* Display validation errors if they exist */}
                                    {errors.code && <div className="mt-1 text-red-500 text-sm">{errors.code}</div>}
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="model">Model</Label>
                                    <Input
                                        id="model"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                    />
                                    {errors.model && <div className="mt-1 text-red-500 text-sm">{errors.model}</div>}
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="manufacturer">Manufacturer</Label>
                                    <Input
                                        id="manufacturer"
                                        value={data.manufacturer}
                                        onChange={(e) => setData('manufacturer', e.target.value)}
                                    />
                                    {errors.manufacturer && <div className="mt-1 text-red-500 text-sm">{errors.manufacturer}</div>}
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="builtYear">Built Year</Label>
                                    <Input
                                        id="builtYear"
                                        type="number" // Use type="number" for year
                                        value={data.built_year}
                                        onChange={(e) => setData('built_year', e.target.value)}
                                    />
                                    {errors.built_year && <div className="mt-1 text-red-500 text-sm">{errors.built_year}</div>}
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                                {/* These fields are not editable, so they don't need to be in the form state */}
                                <div className="space-y-1">
                                    <Label htmlFor="createdAt">Created At</Label>
                                    <Input id="createdAt" value={locomotive.created_at ? new Date(locomotive.created_at).toLocaleString() : '—'} readOnly />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="updatedAt">Updated At</Label>
                                    <Input id="updatedAt" value={locomotive.updated_at ? new Date(locomotive.updated_at).toLocaleString() : '—'} readOnly />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
