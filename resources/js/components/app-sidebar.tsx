import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Map, TrainFront, Wrench } from 'lucide-react';
import AppLogo from './app-logo';
// import { NavRollingStock } from './nav-rolling-stock';
import { NavCompact, NavCompactProps } from './nav-compact';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Activity Map',
        href: '/map',
        icon: Map,
    }
];

const navCompactProps: NavCompactProps = {
    title: 'Operations',
    items: [{
        title: 'Rolling Stock',
        url: '/rolling-stock',
        icon: TrainFront,
        isActive: false,
        items: [
            { title: 'Trains', url: '/rolling-stock/trains' },
            { title: 'Locomotives', url: '/rolling-stock/locomotives' },
            { title: 'Wagons', url: '/rolling-stock/wagons' },
        ],
    },
    {
        title: 'Maintenance',
        url: '/maintenance',
        icon: Wrench,
        isActive: false,
        items: [
            { title: 'Schedules', url: '/maintenance/schedules' },
            { title: 'Reports', url: '/maintenance/reports' },
        ],
    }]
};

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/dashboard" prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>


                <SidebarContent>

                    <SidebarContent>
                        <NavMain items={mainNavItems} />


                        {/* <NavRollingStock items={rollingStockNavItems} /> */}
                        <NavCompact props={navCompactProps} />
                    </SidebarContent>
                </SidebarContent>

                <SidebarFooter>
                    {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                    <NavUser />
                </SidebarFooter>
        </Sidebar>
    );
}
