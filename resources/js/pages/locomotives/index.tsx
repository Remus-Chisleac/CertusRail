import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { type Locomotive, LocomotiveTableColumns } from '@/models/Locomotive';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DataTable } from '@/components/data-table';


interface IndexProps {
    locomotives: Locomotive[];
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Locomotives',
        href: '/locomotives',
    },
];


export default function Index({ locomotives }: IndexProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader className="flex flex-row justify-between">
                        <CardTitle>Locomotives</CardTitle>
                        <Link href="locomotives/create">
                            <Button>Add Locomotive</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={LocomotiveTableColumns} data={locomotives} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
