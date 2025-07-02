import { z } from 'zod';
import { type ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from '@inertiajs/react';
import { Wagon } from './Wagon';
import { Locomotive } from './Locomotive';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define the Zod schema for a Train, which is used for validation and type inference.
export const Train = z.object({
    id: z.number().int(),
    name: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    // These counts are provided by the `withCount` method in the Laravel controller.
    locomotives_count: z.number().int().optional(),
    wagons_count: z.number().int().optional(),
    // These are optional and would be used on a show/edit page if you load the full relations.
    locomotives: z.array(Locomotive).optional(),
    wagons: z.array(Wagon).optional(),

    power_trains: z.array(z.object({
        id: z.number().int(),
        name: z.string(),
        locomotives: z.array(Locomotive),
    })).optional(),
    train_sections: z.array(z.object({
        id: z.number().int(),
        name: z.string(),
        wagons: z.array(Wagon),
    })).optional(),
});

// Infer the TypeScript type from the Zod schema.
export type Train = z.infer<typeof Train>;

// Define the columns for the DataTable component on the Index page.
export const TrainTableColumns: ColumnDef<Train>[] = [
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
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                {column.getIsSorted() &&
                        (column.getIsSorted() === "asc" ?
                            (<ArrowUp className="ml-2 w-4 h-4" />) :
                            (<ArrowDown className="ml-2 w-4 h-4" />))
                    }
            </Button>
        ),
        cell: ({ row }) => (
            <Link href={`/trains/${row.original.id}`} className="font-medium text-blue-600 hover:underline">
                {row.original.name}
            </Link>
        )
    },
    {
        accessorKey: "locomotives_count",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Locomotives
                {column.getIsSorted() &&
                        (column.getIsSorted() === "asc" ?
                            (<ArrowUp className="ml-2 w-4 h-4" />) :
                            (<ArrowDown className="ml-2 w-4 h-4" />))
                    }
            </Button>
        ),
        cell: ({ row }) => (
            <span className="text-center">
                {row.original.locomotives_count ?? 0}
            </span>
        )
    },
    {
        accessorKey: "wagons_count",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Wagons
                {column.getIsSorted() &&
                        (column.getIsSorted() === "asc" ?
                            (<ArrowUp className="ml-2 w-4 h-4" />) :
                            (<ArrowDown className="ml-2 w-4 h-4" />))
                    }
            </Button>
        ),
        cell: ({ row }) => (
            <span className="text-center">
                {row.original.wagons_count ?? 0}
            </span>
        )
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const train = row.original;
            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-0 w-8 h-8">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/trains/${train.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/trains/${train.id}/edit`}>Edit Train</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]
