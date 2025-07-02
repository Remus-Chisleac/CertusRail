import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Wagon } from '@/models/Wagon'; // Import Wagon model
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';

// Props interface for the Show component
interface ShowProps {
    wagon: Wagon;
}

export default function Show({ wagon: rawWagon }: ShowProps) {
    // Parse and validate the incoming prop
    const wagon = Wagon.parse(rawWagon);

    // Breadcrumb configuration
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Wagons', href: '/rolling-stock/wagons' },
        { title: wagon.code, href: `/rolling-stock/wagons/${wagon.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Wagon Details</CardTitle>
                        <Button asChild>
                            <Link href={`/rolling-stock/wagons/${wagon.id}/edit`}>
                                Edit Wagon
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label htmlFor="code">Code</Label>
                                <Input id="code" value={wagon.code} readOnly />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="type">Type</Label>
                                <Input id="type" value={wagon.type} readOnly />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input id="capacity" value={wagon.capacity?.toString() ?? ''} readOnly />
                            </div>
                        </div>
                        <Separator className="mx-0 my-4" />
                        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label htmlFor="createdAt">Created At</Label>
                                <Input id="createdAt" value={wagon.created_at ? new Date(wagon.created_at).toLocaleString() : ''} readOnly />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="updatedAt">Updated At</Label>
                                <Input id="updatedAt" value={wagon.updated_at ? new Date(wagon.updated_at).toLocaleString() : ''} readOnly />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
