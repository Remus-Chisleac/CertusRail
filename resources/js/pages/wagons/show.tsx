import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Wagon } from '@/models/Wagon';
import { Button } from '@/components/ui/button';

interface ShowProps {
    wagon: Wagon;
}



export default function Show({ wagon }: ShowProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Wagons', href: '/rolling-stock/wagons' },
        { title: wagon.code, href: '/rolling-stock/wagons/' + wagon.id },
        { title: 'Edit', href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader className="flex flex-row justify-between">
                        <CardTitle>Wagon Editor</CardTitle>
                        <Button>
                            Save Changes
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    type='text'
                                    value={wagon.code}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="type">Type</Label>
                                <Input
                                    id="type"
                                    value={wagon.type}

                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input
                                    id="capacity"
                                    value={wagon.capacity ?? ''}

                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="createdAt">Created At</Label>
                                <Input
                                    id="createdAt"
                                    value={wagon.created_at.toString() ?? '—'}

                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="updatedAt">Updated At</Label>
                                <Input
                                    id="updatedAt"
                                    value={wagon.updated_at ?? '—'}

                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
