import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Locomotive } from '@/models/Locomotive';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface ShowProps {
    locomotive: Locomotive;
}



export default function Show({ locomotive }: ShowProps) {

    locomotive = Locomotive.parse(locomotive);

    const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Locomotives', href: '/rolling-stock/locomotives' },
    { title: locomotive.code, href: '/rolling-stock/locomotives/' + locomotive.id },
    { title: 'Details', href: '' },
];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader className="flex flex-row justify-between">
                        <CardTitle>Locomotive Details</CardTitle>
                        <Button asChild >
                            <Link href={"/rolling-stock/locomotives/"+locomotive.id+"/edit"}>
                                Edit Locomotive
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    value={locomotive.code}
                                    readOnly
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="model">Model</Label>
                                <Input
                                    id="model"
                                    value={locomotive.model}
                                    readOnly
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="manufacturer">Manufacturer</Label>
                                <Input
                                    id="manufacturer"
                                    value={locomotive.manufacturer ?? '—'}
                                    readOnly
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="builtYear">Built Year</Label>
                                <Input
                                    id="builtYear"
                                    value={locomotive.built_year?.toString() ?? '—'}
                                    readOnly
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="createdAt">Created At</Label>
                                <Input
                                    id="createdAt"
                                    value={locomotive.created_at.toString() ?? '—'}
                                    readOnly
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="updatedAt">Updated At</Label>
                                <Input
                                    id="updatedAt"
                                    value={locomotive.updated_at ?? '—'}
                                    readOnly
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
