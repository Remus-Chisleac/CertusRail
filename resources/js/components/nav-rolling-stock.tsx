import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';


export function NavRollingStock({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup className="px-2 py-0">
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                        Rolling Stock
                        <ChevronDown className="ml-auto group-data-[state=open]/collapsible:rotate-180 transition-transform" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent >
                        <SidebarMenuSub>
                            {items.map((item) => (
                                <SidebarMenuSubItem key={item.title}>
                                    <SidebarMenuSubButton asChild isActive={page.url.startsWith(item.href)}>
                                        <Link href={item.href} prefetch>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}
