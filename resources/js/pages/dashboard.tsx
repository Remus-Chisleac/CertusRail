import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import DashboardMap from './dashboard/DashboardMap';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {


    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isLoadingKey, setIsLoadingKey] = useState(true);

    useEffect(() => {
        fetch('/api/map-key')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch API key');
                }
                return res.json();
            })
            .then(data => {
                setApiKey(data.apiKey)
            })
            .catch(error => {
                console.error("Error fetching Google Maps API key:", error);
            })
            .finally(() => {
                setIsLoadingKey(false);
            });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col flex-1 gap-4 p-4 rounded-xl h-full overflow-x-auto">
                <div className="gap-4 grid md:grid-cols-3 auto-rows-min">
                    {/* Placeholder cards */}
                    <div className="relative border border-sidebar-border/70 dark:border-sidebar-border rounded-xl aspect-video overflow-hidden">
                        {/* <DelayPanel/> */}
                        <PlaceholderPattern className="absolute inset-0 stroke-neutral-900/20 dark:stroke-neutral-100/20 size-full" />

                    </div>
                    <div className="relative border border-sidebar-border/70 dark:border-sidebar-border rounded-xl aspect-video overflow-hidden">
                        <PlaceholderPattern className="absolute inset-0 stroke-neutral-900/20 dark:stroke-neutral-100/20 size-full" />
                    </div>
                    <div className="relative border border-sidebar-border/70 dark:border-sidebar-border rounded-xl aspect-video overflow-hidden">
                        <PlaceholderPattern className="absolute inset-0 stroke-neutral-900/20 dark:stroke-neutral-100/20 size-full" />
                    </div>
                </div>
                <div className="relative flex-1 border border-sidebar-border/70 dark:border-sidebar-border rounded-xl min-h-[100vh] md:min-h-min overflow-hidden">
                    {isLoadingKey ? (
                        <Skeleton className="rounded-xl size-full" />
                    ) : ((apiKey === null || apiKey === undefined) ?
                        (
                            <PlaceholderPattern className="absolute inset-0 stroke-neutral-900/20 dark:stroke-neutral-100/20 size-full" />
                        ) : (
                            <DashboardMap apiKey={apiKey} />
                        )
                    )
                    }
                </div>
            </div>
        </AppLayout>
    );
}

