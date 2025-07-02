import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { type Wagon, WagonTableColumns } from '@/models/Wagon';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DataTable } from '@/components/data-table';

interface IndexProps {
    wagons: Wagon[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wagons',
        href: '/wagons',
    },
];

export default function Index({ wagons }: IndexProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader className="flex flex-row justify-between">
                        <CardTitle>Wagons</CardTitle>
                        <Link href="wagons/create">
                            <Button>Add Wagon</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={WagonTableColumns} data={wagons} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
