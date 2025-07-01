import { Link, usePage } from '@inertiajs/react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRight, LucideIcon } from 'lucide-react';
import { z } from 'zod';

export const NavCompactItem = z.object({
    title: z.string(),
    icon: z.custom<LucideIcon>().optional(),
    url: z.string(),
    isActive: z.boolean().optional(),
    canView: z.boolean().optional(),
    items: z.array(z.object({
        title: z.string(),
        url: z.string(),
    })).optional(),
});
export type NavCompactItem = z.infer<typeof NavCompactItem>;
export const NavCompactProps = z.object({
    title: z.string().optional(),
    items: z.array(NavCompactItem).optional(),
    canView: z.boolean().optional(),
    isActive: z.boolean().optional(),
});
export type NavCompactProps = z.infer<typeof NavCompactProps>;


export function NavCompact({ props }: { props: NavCompactProps }) {
    const page = usePage();
    return (
        <SidebarGroup>
            {props.title && <SidebarGroupLabel>{props.title}</SidebarGroupLabel>}
            <SidebarMenu>
                {props.items?.map((item) => (

                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={page.url.startsWith(item.url)}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title} isActive={page.url.startsWith(item.url)}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto group-data-[state=open]/collapsible:rotate-90 transition-transform duration-200" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton asChild >
                                                <Link href={subItem.url} prefetch >
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
