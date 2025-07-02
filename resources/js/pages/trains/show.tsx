import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';
import { type Train } from '@/models/Train';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

// --- INTERFACE ---
interface ShowTrainProps {
    train: Train; // The train object, with all relations loaded from the controller
}

// --- MAIN COMPONENT ---
export default function Show({ train }: ShowTrainProps) {

    console.log('Train data:', train);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Trains', href: '/trains' },
        { title: train.name, href: `/trains/${train.id}` },
        { title: 'Details', href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                {/* --- Card 1: Train Information --- */}
                <Card>
                    <CardHeader className="flex-row justify-between items-center">
                        <div className="space-y-1.5">
                            <CardTitle>{train.name}</CardTitle>
                            <CardDescription>Train Details</CardDescription>
                        </div>
                        <Button asChild>
                            <Link href={`/trains/${train.id}/edit`}>Edit Train</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="gap-6 grid grid-cols-1 md:grid-cols-3">
                        <div className="space-y-1">
                            <Label>Name</Label>
                            <Input value={train.name} readOnly />
                        </div>
                        <div className="space-y-1">
                            <Label>Latitude</Label>
                            <Input value={train.latitude ?? 'N/A'} readOnly />
                        </div>
                        <div className="space-y-1">
                            <Label>Longitude</Label>
                            <Input value={train.longitude ?? 'N/A'} readOnly />
                        </div>
                    </CardContent>
                </Card>

                {/* --- Card 2: Power Train Sections --- */}
                <Card>
                    <CardHeader>
                        <CardTitle>Power Train</CardTitle>
                        <CardDescription>Locomotives assigned to this train.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {train.power_trains && train.power_trains.length > 0 ? (
                            train.power_trains.map((section, index) => (
                                <div key={section.id || index} className="space-y-3 p-4 border rounded-lg">
                                    <h3 className="font-semibold">{section.name}</h3>
                                    <Separator />
                                    <div className='flex flex-wrap gap-2'>
                                        {section.locomotives.map(loco => (
                                            <div key={loco.id} className='bg-muted px-3 py-1 rounded-md font-medium text-sm'>
                                                {loco.code}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-sm">No power train sections have been added.</p>
                        )}
                    </CardContent>
                </Card>

                {/* --- Card 3: Wagon Sections --- */}
                <Card>
                    <CardHeader>
                        <CardTitle>Wagon Sections</CardTitle>
                        <CardDescription>Wagons assigned to this train, grouped by section.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {train.train_sections && train.train_sections.length > 0 ? (
                            train.train_sections.map((section, index) => (
                                <div key={section.id || index} className="space-y-3 p-4 border rounded-lg">
                                    <h3 className="font-semibold">{section.name}</h3>
                                    <Separator />
                                    <div className='flex flex-wrap gap-2'>
                                        {section.wagons.map(wagon => (
                                            <div key={wagon.id} className='bg-muted px-3 py-1 rounded-md font-medium text-sm'>
                                                {wagon.code}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-sm">No wagon sections have been added.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
