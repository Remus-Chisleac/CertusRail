import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { type Train, TrainTableColumns } from '@/models/Train';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DataTable } from '@/components/data-table';

// Props interface for the Index component
interface IndexProps {
    trains: Train[];
}

// Breadcrumb configuration for the page header
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trains',
        href: '/trains',
    },
];

export default function Index({ trains }: IndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Trains</CardTitle>
                        <Link href="/trains/create">
                            <Button>Add Train</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={TrainTableColumns} data={trains} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
