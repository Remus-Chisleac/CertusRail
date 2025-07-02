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

export const Wagon = z.object({
    id: z.coerce.string(),
    code: z.string(),
    type: z.string(),
    capacity: z.coerce.number().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime().nullable(),
});
export type Wagon = z.infer<typeof Wagon>;

export const WagonTableColumns: ColumnDef<Wagon>[] = [
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
        cell: ({ row }) => <Link href={`wagons/${row.original.id}`}>{row.original.id}</Link>,
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
        id: 'type',
        accessorKey: 'type',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
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
        id: 'capacity',
        accessorKey: 'capacity',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Capacity
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const data = row.original

            return (
                <div className="flex border-1 rounded-md w-fit h-fit">
                    <Button variant="ghost" >
                        <span className="sr-only">View</span>
                        <Link href={`wagons/${data.id}`}>
                            View
                        </Link>
                    </Button>
                    <SeparatorVertical height="5" />
                    <Button variant="ghost" >
                        <span className="sr-only">Edit</span>
                        <Link href={`wagons/${data.id}/edit`}>
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
                                onClick={() => navigator.clipboard.writeText(data.id)}
                            >
                                Copy Wagon ID
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
