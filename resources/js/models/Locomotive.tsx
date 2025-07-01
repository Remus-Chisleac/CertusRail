import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';
import { Link } from "@inertiajs/react";
import { SeparatorVertical } from "@/components/ui/separator-vertical";

export const Locomotive = z.object({
    id: z.coerce.string(),
    code: z.string(),
    model: z.string(),
    manufacturer: z.string().nullable(),
    built_year: z.coerce.string(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime().nullable(),
});
export type Locomotive = z.infer<typeof Locomotive>;

export const LocomotiveTableColumns: ColumnDef<Locomotive>[] = [
    {
        id: 'id',
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID
                    {column.getIsSorted() &&
                        (column.getIsSorted() === "asc" ?
                            (<ArrowUp className="ml-2 w-4 h-4" />) :
                            (<ArrowDown className="ml-2 w-4 h-4" />))
                    }
                </Button>
            )
        },
        cell: ({ row }) => <Link href={`locomotives/${row.original.id}`}>{row.original.id}</Link>,
    },
    {
        id: 'code',
        accessorKey: 'code',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Code
                    {column.getIsSorted() &&
                        (column.getIsSorted() === "asc" ?
                            (<ArrowUp className="ml-2 w-4 h-4" />) :
                            (<ArrowDown className="ml-2 w-4 h-4" />))
                    }
                </Button>
            )
        },
    },
    {
        id: 'model',
        accessorKey: 'model',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Model
                    {column.getIsSorted() &&
                        (column.getIsSorted() === "asc" ?
                            (<ArrowUp className="ml-2 w-4 h-4" />) :
                            (<ArrowDown className="ml-2 w-4 h-4" />))
                    }
                </Button>
            )
        },
    },
    {
        id: 'manufacturer',
        accessorKey: 'manufacturer',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Manufacturer
                    {column.getIsSorted() &&
                        (column.getIsSorted() === "asc" ?
                            (<ArrowUp className="ml-2 w-4 h-4" />) :
                            (<ArrowDown className="ml-2 w-4 h-4" />))
                    }
                </Button>
            )
        },
    },
    {
        id: 'built_year',
        accessorKey: 'built_year',
        header: 'Year',
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const locomotive = row.original

            return (
                <div className="flex border-1 rounded-md w-fit h-fit">
                    <Button variant="ghost" asChild>
                        <Link href={`locomotives/${locomotive.id}`}>
                            View
                        </Link>
                    </Button>
                    <SeparatorVertical height="5" />
                    <Button variant="ghost" asChild>
                        <Link href={`locomotives/${locomotive.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                    <SeparatorVertical height="5" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(locomotive.id)}
                            >
                                Copy Locomotive ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>View</DropdownMenuLabel>
                            <DropdownMenuItem>Linked Train</DropdownMenuItem>
                            <DropdownMenuItem>Maintenance Logs</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            )
        }
    },
]
