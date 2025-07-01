import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Locomotive } from '@/models/Locomotive';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { router } from '@inertiajs/react';
import { MouseEvent } from 'react';

interface ShowProps {
    locomotive: Locomotive;
}



export default function Edit({ locomotive }: ShowProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Locomotives', href: '/rolling-stock/locomotives' },
        { title: locomotive.code, href: '/rolling-stock/locomotives/' + locomotive.id },
        { title: 'Edit', href: '' },
    ];

    const onDelete = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        router.delete(`/rolling-stock/locomotives/${locomotive.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                router.visit('/rolling-stock/locomotives');
            },
            onError: (error) => {
                console.error('Error deleting locomotive:', error);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader className="flex flex-row justify-between">
                        <CardTitle>Locomotive Editor</CardTitle>
                        <div id='action-buttons' className="flex gap-2">
                            <Button>
                                Save Changes
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button variant="destructive">
                                        Delete Locomotive
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>You are about to delete a Locomotive</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete locomotive?
                                            All data associated with this locomotive will be permanently removed.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={(e) => onDelete(e)} >Delete</AlertDialogAction>
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
                                    value={locomotive.code}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="model">Model</Label>
                                <Input
                                    id="model"
                                    value={locomotive.model}

                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="manufacturer">Manufacturer</Label>
                                <Input
                                    id="manufacturer"
                                    value={locomotive.manufacturer ?? ''}

                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="builtYear">Built Year</Label>
                                <Input
                                    id="builtYear"
                                    value={locomotive.built_year?.toString() ?? ''}

                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="createdAt">Created At</Label>
                                <Input
                                    id="createdAt"
                                    value={locomotive.created_at.toString() ?? '—'}

                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="updatedAt">Updated At</Label>
                                <Input
                                    id="updatedAt"
                                    value={locomotive.updated_at ?? '—'}

                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
