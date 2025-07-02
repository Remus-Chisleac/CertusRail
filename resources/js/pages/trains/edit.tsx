import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Locomotive } from '@/models/Locomotive';
import { Wagon } from '@/models/Wagon';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, X } from 'lucide-react';
import { type Train } from '@/models/Train';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// --- BREADCRUMBS & INTERFACES ---
interface EditTrainProps {
    train: Train; // The train object to edit, with relations loaded
    locomotives: Locomotive[]; // All available locomotives
    wagons: Wagon[];      // All available wagons
}

// --- FORM SCHEMA & VALIDATION ---
const formSchema = z.object({
    name: z.string().min(3, "Train name must be at least 3 characters."),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    power_trains: z.array(z.object({
        id: z.number().optional(), // Include ID for existing sections
        name: z.string().min(1, "Section name is required."),
        locomotives: z.array(z.object({
            id: z.number().int(),
            code: z.string().min(1, "Locomotive code is required."),
        })).min(1, "At least one locomotive is required in a power train section."),
    })),
    train_sections: z.array(z.object({
        id: z.number().optional(), // Include ID for existing sections
        name: z.string().min(1, "Section name is required."),
        wagons: z.array(z.object({
            id: z.number().int(),
            code: z.string().min(1, "Wagon code is required."),
        })).min(1, "At least one wagon is required in a train section."),
    })),
});

type FormValues = z.infer<typeof formSchema>;

// --- MAIN COMPONENT ---
export default function Edit({ train, locomotives: allLocomotives, wagons: allWagons }: EditTrainProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [locoDialogOpen, setLocoDialogOpen] = useState(false);
    const [wagonDialogOpen, setWagonDialogOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<{ type: 'power' | 'wagon', index: number } | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Trains', href: '/trains' },
        { title: train.name, href: `/trains/${train.id}` },
        { title: 'Edit', href: '' },
    ];

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: train.name || '',
            latitude: train.latitude || undefined,
            longitude: train.longitude || undefined,
            power_trains: train.power_trains?.map(pt => ({
                id: pt.id,
                name: pt.name,
                locomotives: pt.locomotives?.map(l => ({ id: parseInt(l.id), code: l.code })) || [],
            })) || [],
            train_sections: train.train_sections?.map(ts => ({
                id: ts.id,
                name: ts.name,
                wagons: ts.wagons?.map(w => ({ id: parseInt(w.id), code: w.code })) || [],
            })) || [],
        },
    });

    const { fields: powerTrainFields, append: appendPowerTrain, remove: removePowerTrain } = useFieldArray({
        control: form.control,
        name: "power_trains",
    });

    const { fields: trainSectionFields, append: appendTrainSection, remove: removeTrainSection } = useFieldArray({
        control: form.control,
        name: "train_sections",
    });

    // --- FORM LOGIC ---

    const onSubmit = (values: FormValues) => {
        setIsSubmitting(true);
        // Use PUT for updates
        router.put(`/trains/${train.id}`, values, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    const onDelete = () => {
        router.delete(`/trains/${train.id}`);
    }

    const selectedLocoIds = new Set(form.watch('power_trains').flatMap(pt => pt.locomotives.map(l => l.id)));
    const selectedWagonIds = new Set(form.watch('train_sections').flatMap(ts => ts.wagons.map(w => w.id)));

    // --- HANDLERS ---

    const handleAddLoco = (loco: Locomotive) => {
        if (activeSection?.type === 'power') {
            const currentLocos = form.getValues(`power_trains.${activeSection.index}.locomotives`) || [];
            form.setValue(`power_trains.${activeSection.index}.locomotives`, [...currentLocos, { id: parseInt(loco.id), code: loco.code }]);
        }
        setLocoDialogOpen(false);
    };

    const handleRemoveLoco = (sectionIndex: number, locoId: number) => {
        const currentLocos = form.getValues(`power_trains.${sectionIndex}.locomotives`);
        form.setValue(`power_trains.${sectionIndex}.locomotives`, currentLocos.filter(l => l.id !== locoId));
    };

    const handleAddWagon = (wagon: Wagon) => {
        if (activeSection?.type === 'wagon') {
            const currentWagons = form.getValues(`train_sections.${activeSection.index}.wagons`) || [];
            form.setValue(`train_sections.${activeSection.index}.wagons`, [...currentWagons, { id: parseInt(wagon.id), code: wagon.code }]);
        }
        setWagonDialogOpen(false);
    }

    const handleRemoveWagon = (sectionIndex: number, wagonId: number) => {
        const currentWagons = form.getValues(`train_sections.${sectionIndex}.wagons`);
        form.setValue(`train_sections.${sectionIndex}.wagons`, currentWagons.filter(w => w.id !== wagonId));
    };

    // --- REUSABLE ACTION BUTTONS ---
    const ActionButtons = (
        <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" disabled={isSubmitting}>Delete Train</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the train
                            and all of its associated sections and data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );

    // --- RENDER ---
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* --- Top Action Bar --- */}
                    <div className="top-0 z-10 sticky flex justify-end bg-background p-4 border-b">
                        {ActionButtons}
                    </div>

                    <div className="space-y-6 p-6">
                        {/* --- Card 1: Train Information --- */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Train Information</CardTitle>
                            </CardHeader>
                            <CardContent className="gap-6 grid grid-cols-1 md:grid-cols-3">
                                <FormField name="name" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Train Name</FormLabel>
                                        <FormControl><Input placeholder="e.g., IR1745" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField name="latitude" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Latitude (Optional)</FormLabel>
                                        <FormControl><Input type="number" step="any" placeholder="e.g., 46.77" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField name="longitude" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Longitude (Optional)</FormLabel>
                                        <FormControl><Input type="number" step="any" placeholder="e.g., 23.62" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>

                        {/* --- Card 2: Power Train Sections --- */}
                        <Card>
                            <CardHeader className="flex-row justify-between items-center">
                                <CardTitle>Power Train</CardTitle>
                                <Button type="button" variant="outline" onClick={() => appendPowerTrain({ name: `Power Section ${powerTrainFields.length + 1}`, locomotives: [] })}>
                                    <PlusCircle className="mr-2 w-4 h-4" /> Add Power Section
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {powerTrainFields.map((field, index) => (
                                    <div key={field.id} className="space-y-3 p-4 border rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <FormField name={`power_trains.${index}.name`} control={form.control} render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl><Input placeholder="Section Name" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removePowerTrain(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                        </div>
                                        <Separator />
                                        <div className='space-y-2'>
                                            <h4 className='font-medium'>Locomotives</h4>
                                            <div className='flex flex-wrap gap-2'>
                                                {form.watch(`power_trains.${index}.locomotives`)?.map(loco => (
                                                    <div key={loco.id} className='flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm'>
                                                        <span>{loco.code}</span>
                                                        <button type="button" onClick={() => handleRemoveLoco(index, loco.id)} className="text-muted-foreground hover:text-destructive">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <Dialog open={locoDialogOpen} onOpenChange={setLocoDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button type="button" variant="secondary" size="sm" onClick={() => setActiveSection({ type: 'power', index })}>Add Locomotive</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader><DialogTitle>Select a Locomotive</DialogTitle></DialogHeader>
                                                    <Command>
                                                        <CommandInput placeholder="Search locomotives..." />
                                                        <CommandList>
                                                            <CommandEmpty>No available locomotives found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {allLocomotives.filter(loco => !selectedLocoIds.has(parseInt(loco.id))).map((loco) => (
                                                                    <CommandItem key={loco.id} onSelect={() => handleAddLoco(loco)}>
                                                                        {loco.code} - {loco.model}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </DialogContent>
                                            </Dialog>
                                            <FormMessage>{form.formState.errors.power_trains?.[index]?.locomotives?.message}</FormMessage>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* --- Card 3: Wagon Sections --- */}
                        <Card>
                            <CardHeader className="flex-row justify-between items-center">
                                <CardTitle>Wagon Sections</CardTitle>
                                <Button type="button" variant="outline" onClick={() => appendTrainSection({ name: `Wagon Section ${trainSectionFields.length + 1}`, wagons: [] })}>
                                    <PlusCircle className="mr-2 w-4 h-4" /> Add Wagon Section
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {trainSectionFields.map((field, index) => (
                                    <div key={field.id} className="space-y-3 p-4 border rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <FormField name={`train_sections.${index}.name`} control={form.control} render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl><Input placeholder="Section Name" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeTrainSection(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                        </div>
                                        <Separator />
                                        <div className='space-y-2'>
                                            <h4 className='font-medium'>Wagons</h4>
                                            <div className='flex flex-wrap gap-2'>
                                                {form.watch(`train_sections.${index}.wagons`)?.map(wagon => (
                                                    <div key={wagon.id} className='flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm'>
                                                        <span>{wagon.code}</span>
                                                        <button type="button" onClick={() => handleRemoveWagon(index, wagon.id)} className="text-muted-foreground hover:text-destructive">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <Dialog open={wagonDialogOpen} onOpenChange={setWagonDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button type="button" variant="secondary" size="sm" onClick={() => setActiveSection({ type: 'wagon', index })}>Add Wagon</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader><DialogTitle>Select a Wagon</DialogTitle></DialogHeader>
                                                    <Command>
                                                        <CommandInput placeholder="Search wagons..." />
                                                        <CommandList>
                                                            <CommandEmpty>No available wagons found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {allWagons.filter(wagon => !selectedWagonIds.has(parseInt(wagon.id))).map((wagon) => (
                                                                    <CommandItem key={wagon.id} onSelect={() => handleAddWagon(wagon)}>
                                                                        {wagon.code} - {wagon.type}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </DialogContent>
                                            </Dialog>
                                            <FormMessage>{form.formState.errors.train_sections?.[index]?.wagons?.message}</FormMessage>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* --- Bottom Action Bar --- */}
                        <div className="flex justify-end">
                            {ActionButtons}
                        </div>
                    </div>
                </form>
            </Form>
        </AppLayout >
    );
}
